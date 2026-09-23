const ESPN_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const MAX_DAYS = 180;
const CONCURRENCY = 6;

type EspnTeam = {
  id?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
  links?: Array<{ href?: string; rel?: string[] }>;
};

type EspnCompetitor = {
  id?: string;
  homeAway?: "home" | "away";
  score?: string;
  team?: EspnTeam;
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  venue?: {
    fullName?: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
  broadcasts?: Array<{
    names?: string[];
  }>;
  geoBroadcasts?: Array<{
    media?: {
      shortName?: string;
    };
  }>;
  status?: {
    type?: {
      state?: string;
      name?: string;
      shortDetail?: string;
      detail?: string;
      description?: string;
    };
  };
};

type EspnEvent = {
  id?: string;
  uid?: string;
  date?: string;
  name?: string;
  shortName?: string;
  competitions?: EspnCompetition[];
  links?: Array<{
    href?: string;
    rel?: string[];
  }>;
};

function errorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}

function normalizeLeague(value: string | null) {
  return value?.trim().toLowerCase() || "eng.1";
}

function toDateKey(value: string | Date) {
  const date = new Date(value);

  return `${date.getUTCFullYear()}${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`ESPN returned ${response.status}`);
  }

  return response.json();
}

function getTeamUrl(team?: EspnTeam) {
  return (
    team?.links?.find((link) =>
      link.rel?.some((rel) =>
        ["clubhouse", "desktop", "team"].includes(rel),
      ),
    )?.href || null
  );
}

function normalizeEvent(event: EspnEvent, league: string) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];

  const home = competitors.find(
    (competitor) => competitor.homeAway === "home",
  );

  const away = competitors.find(
    (competitor) => competitor.homeAway === "away",
  );

  const status = competition?.status?.type;

  const broadcasts = [
    ...(competition?.broadcasts || []).flatMap(
      (broadcast) => broadcast.names || [],
    ),
    ...(competition?.geoBroadcasts || []).map(
      (broadcast) => broadcast.media?.shortName,
    ),
  ].filter(Boolean) as string[];

  const eventUrl =
    event.links?.find((link) =>
      link.rel?.some((rel) =>
        ["summary", "event"].includes(rel),
      ),
    )?.href ||
    `https://www.espn.com/soccer/match/_/gameId/${event.id}`;

  return {
    id: event.id || event.uid || crypto.randomUUID(),
    league,
    name: event.name || event.shortName || "Football match",
    date: event.date || null,

    status: {
      state: status?.state || "pre",
      name: status?.name || "STATUS_SCHEDULED",
      detail:
        status?.shortDetail ||
        status?.detail ||
        status?.description ||
        "Scheduled",
    },

    homeTeam: {
      id: home?.team?.id || null,
      name:
        home?.team?.displayName ||
        home?.team?.shortDisplayName ||
        "Home",
      abbreviation: home?.team?.abbreviation || "",
      logo: home?.team?.logo || null,
      score: home?.score || null,
      url: getTeamUrl(home?.team),
    },

    awayTeam: {
      id: away?.team?.id || null,
      name:
        away?.team?.displayName ||
        away?.team?.shortDisplayName ||
        "Away",
      abbreviation: away?.team?.abbreviation || "",
      logo: away?.team?.logo || null,
      score: away?.score || null,
      url: getTeamUrl(away?.team),
    },

    venue: {
      name: competition?.venue?.fullName || null,
      city: competition?.venue?.address?.city || null,
      country: competition?.venue?.address?.country || null,
    },

    broadcasts: [...new Set(broadcasts)],

    eventUrl,
  };
}

async function fetchDate(
  league: string,
  dateKey: string,
): Promise<EspnEvent[]> {
  const url =
    `${ESPN_BASE}/${encodeURIComponent(league)}/scoreboard` +
    `?dates=${dateKey}`;

  try {
    const data = await fetchJson(url);

    return Array.isArray(data.events)
      ? data.events
      : [];
  } catch {
    return [];
  }
}

async function fetchInBatches(
  league: string,
  dates: string[],
) {
  const events: EspnEvent[] = [];

  for (let index = 0; index < dates.length; index += CONCURRENCY) {
    const batch = dates.slice(
      index,
      index + CONCURRENCY,
    );

    const results = await Promise.all(
      batch.map((date) => fetchDate(league, date)),
    );

    for (const result of results) {
      events.push(...result);
    }
  }

  return events;
}

async function getFixtures(
  league: string,
  requestedDays: number,
) {
  const days = Math.min(
    Math.max(Math.floor(requestedDays), 1),
    MAX_DAYS,
  );

  const today = new Date();
  const endDate = addDays(today, days);

  const firstResponse = await fetchJson(
    `${ESPN_BASE}/${encodeURIComponent(league)}/scoreboard`,
  );

  const calendar: string[] =
    firstResponse.leagues?.[0]?.calendar || [];

  const scheduledDates = calendar
    .map((date) => new Date(date))
    .filter(
      (date) =>
        date >= addDays(today, -1) &&
        date <= endDate,
    )
    .map((date) => toDateKey(date));

  const uniqueDates = [
    ...new Set(scheduledDates),
  ];

  const rawEvents = await fetchInBatches(
    league,
    uniqueDates,
  );

  const uniqueEvents = new Map<string, EspnEvent>();

  for (const event of rawEvents) {
    const id = event.id || event.uid;

    if (id) {
      uniqueEvents.set(id, event);
    }
  }

  const now = Date.now();

  return [...uniqueEvents.values()]
    .map((event) =>
      normalizeEvent(event, league),
    )
    .filter((event) => {
      if (!event.date) return true;

      const timestamp = new Date(
        event.date,
      ).getTime();

      return (
        timestamp >= now - 60 * 60 * 1000 ||
        event.status.state === "in"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.date || 0).getTime() -
        new Date(b.date || 0).getTime(),
    );
}

async function getTeams(league: string) {
  const data = await fetchJson(
    `${ESPN_BASE}/${encodeURIComponent(league)}/teams`,
  );

  const teams: EspnTeam[] = [];

  for (const sport of data.sports || []) {
    for (const leagueData of sport.leagues || []) {
      for (const entry of leagueData.teams || []) {
        if (entry.team) {
          teams.push(entry.team);
        }
      }
    }
  }

  const unique = new Map<string, EspnTeam>();

  for (const team of teams) {
    if (team.id) {
      unique.set(team.id, team);
    }
  }

  return [...unique.values()]
    .map((team) => ({
      id: team.id || "",
      name:
        team.displayName ||
        team.shortDisplayName ||
        "Unknown team",
      shortName:
        team.shortDisplayName ||
        team.displayName ||
        "",
      abbreviation:
        team.abbreviation || "",
      logo: team.logo || null,
      url: getTeamUrl(team),
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name),
    );
}

export async function GET(request: Request) {
  const { searchParams } =
    new URL(request.url);

  const league = normalizeLeague(
    searchParams.get("league"),
  );

  const mode =
    searchParams.get("mode") || "fixtures";

  try {
    if (mode === "teams") {
      const teams = await getTeams(league);

      return Response.json({
        league,
        teams,
      });
    }

    const requestedDays = Number(
      searchParams.get("days") || "180",
    );

    const events = await getFixtures(
      league,
      Number.isFinite(requestedDays)
        ? requestedDays
        : 180,
    );

    return Response.json({
      league,
      days: Math.min(
        Math.max(
          Math.floor(
            Number.isFinite(requestedDays)
              ? requestedDays
              : 180,
          ),
          1,
        ),
        MAX_DAYS,
      ),
      events,
      count: events.length,
    });
  } catch (error) {
    console.error(
      "Event Finder error:",
      error,
    );

    return errorResponse(
      "Unable to retrieve football fixtures right now.",
      502,
    );
  }
}
