"use client";

import { useEffect, useMemo, useState } from "react";

type Competition = {
  group: string;
  name: string;
  slug: string;
};

type Team = {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  logo: string | null;
  url: string | null;
};

type EventItem = {
  id: string;
  league: string;
  name: string;
  date: string | null;
  status: {
    state: string;
    name: string;
    detail: string;
  };
  homeTeam: {
    id: string | null;
    name: string;
    abbreviation: string;
    logo: string | null;
    score: string | null;
    url: string | null;
  };
  awayTeam: {
    id: string | null;
    name: string;
    abbreviation: string;
    logo: string | null;
    score: string | null;
    url: string | null;
  };
  venue: {
    name: string | null;
    city: string | null;
    country: string | null;
  };
  broadcasts: string[];
  eventUrl: string;
};

const competitions: Competition[] = [
  { group: "🌍 International", name: "FIFA World Cup", slug: "fifa.world" },
  { group: "🌍 International", name: "World Cup Qualifiers", slug: "fifa.worldq" },
  { group: "🌍 International", name: "World Cup Qualifiers — CAF", slug: "fifa.worldq.caf" },
  { group: "🌍 International", name: "World Cup Qualifiers — UEFA", slug: "fifa.worldq.uefa" },
  { group: "🌍 International", name: "World Cup Qualifiers — CONMEBOL", slug: "fifa.worldq.conmebol" },
  { group: "🌍 International", name: "World Cup Qualifiers — AFC", slug: "fifa.worldq.afc" },
  { group: "🌍 International", name: "World Cup Qualifiers — CONCACAF", slug: "fifa.worldq.concacaf" },
  { group: "🌍 International", name: "World Cup Qualifiers — OFC", slug: "fifa.worldq.ofc" },
  { group: "🌍 International", name: "International Friendlies", slug: "fifa.friendly" },
  { group: "🇪🇺 UEFA", name: "Champions League", slug: "uefa.champions" },
  { group: "🇪🇺 UEFA", name: "Europa League", slug: "uefa.europa" },
  { group: "🇪🇺 UEFA", name: "Conference League", slug: "uefa.europa.conf" },
  { group: "🇪🇺 UEFA", name: "European Championship", slug: "uefa.euro" },
  { group: "🇪🇺 UEFA", name: "Nations League", slug: "uefa.nations" },
  { group: "🇪🇺 UEFA", name: "Women's Champions League", slug: "uefa.wchampions" },
  { group: "🇪🇺 UEFA", name: "Women's European Championship", slug: "uefa.weuro" },
  { group: "🇪🇺 UEFA", name: "European U21 Championship", slug: "uefa.euro_u21" },
  { group: "🇬🇧 England", name: "Premier League", slug: "eng.1" },
  { group: "🇬🇧 England", name: "Championship", slug: "eng.2" },
  { group: "🇬🇧 England", name: "League One", slug: "eng.3" },
  { group: "🇬🇧 England", name: "League Two", slug: "eng.4" },
  { group: "🇬🇧 England", name: "FA Cup", slug: "eng.fa" },
  { group: "🇪🇸 Spain", name: "La Liga", slug: "esp.1" },
  { group: "🇪🇸 Spain", name: "La Liga 2", slug: "esp.2" },
  { group: "🇪🇸 Spain", name: "Copa del Rey", slug: "esp.copa_del_rey" },
  { group: "🇮🇹 Italy", name: "Serie A", slug: "ita.1" },
  { group: "🇮🇹 Italy", name: "Serie B", slug: "ita.2" },
  { group: "🇩🇪 Germany", name: "Bundesliga", slug: "ger.1" },
  { group: "🇩🇪 Germany", name: "2. Bundesliga", slug: "ger.2" },
  { group: "🇫🇷 France", name: "Ligue 1", slug: "fra.1" },
  { group: "🇫🇷 France", name: "Ligue 2", slug: "fra.2" },
  { group: "🇳🇱 Netherlands", name: "Eredivisie", slug: "ned.1" },
  { group: "🇵🇹 Portugal", name: "Primeira Liga", slug: "por.1" },
  { group: "🇹🇷 Turkey", name: "Süper Lig", slug: "tur.1" },
  { group: "🇧🇪 Belgium", name: "Belgian Pro League", slug: "bel.1" },
  { group: "🇸🇨 Scotland", name: "Scottish Premiership", slug: "sco.1" },
  { group: "🇺🇸 North America", name: "MLS", slug: "usa.1" },
  { group: "🇲🇽 North America", name: "Liga MX", slug: "mex.1" },
  { group: "🌎 CONCACAF", name: "Gold Cup", slug: "concacaf.gold" },
  { group: "🌎 CONCACAF", name: "Nations League", slug: "concacaf.nations.league" },
  { group: "🌎 CONCACAF", name: "Champions Cup", slug: "concacaf.champions" },
  { group: "🇧🇷 South America", name: "Brazilian Serie A", slug: "bra.1" },
  { group: "🇦🇷 South America", name: "Argentine Primera", slug: "arg.1" },
  { group: "🌎 CONMEBOL", name: "Copa América", slug: "conmebol.america" },
  { group: "🌎 CONMEBOL", name: "Libertadores", slug: "conmebol.libertadores" },
  { group: "🌎 CONMEBOL", name: "Sudamericana", slug: "conmebol.sudamericana" },
  { group: "🌍 Africa", name: "AFCON", slug: "caf.nations" },
  { group: "🌍 Africa", name: "AFCON Qualifiers", slug: "caf.nations_qual" },
  { group: "🌍 Africa", name: "CAF Champions League", slug: "caf.champions" },
  { group: "🇳🇬 Nigeria", name: "Nigerian Professional Football League", slug: "nga.1" },
  { group: "🇬🇭 Africa", name: "Ghana Premier League", slug: "gha.1" },
  { group: "🇿🇦 Africa", name: "South African Premiership", slug: "rsa.1" },
  { group: "🌏 Asia", name: "AFC Champions League Elite", slug: "afc.champions" },
  { group: "🌏 Asia", name: "AFC Asian Cup", slug: "afc.asian.cup" },
  { group: "🇸🇦 Middle East", name: "Saudi Pro League", slug: "ksa.1" },
  { group: "🇯🇵 Asia", name: "J.League", slug: "jpn.1" },
  { group: "🇮🇳 Asia", name: "Indian Super League", slug: "ind.1" },
  { group: "🇦🇺 Oceania", name: "A-League Men", slug: "aus.1" },
];

const groupedCompetitions = competitions.reduce<Record<string, Competition[]>>(
  (groups, competition) => {
    if (!groups[competition.group]) {
      groups[competition.group] = [];
    }

    groups[competition.group].push(competition);
    return groups;
  },
  {},
);

function formatKickoff(date: string | null) {
  if (!date) return "Time unavailable";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatus(event: EventItem) {
  if (event.status.state === "in") return "LIVE";
  if (event.status.state === "post") return "FT";
  return "UPCOMING";
}

function matchesSearch(event: EventItem, query: string) {
  if (!query.trim()) return true;

  const value = query.toLowerCase();

  return [
    event.homeTeam.name,
    event.awayTeam.name,
    event.venue.name,
    event.venue.city,
    event.venue.country,
  ]
    .filter(Boolean)
    .some((item) => String(item).toLowerCase().includes(value));
}

export default function EventFinderTools() {
  const [league, setLeague] = useState("eng.1");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clubQuery, setClubQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedCompetition =
    competitions.find((item) => item.slug === league) ||
    competitions[0];

  async function loadData() {
    setLoading(true);
    setTeamsLoading(true);
    setError("");
    setSelectedTeam(null);
    setClubQuery("");
    setSearchQuery("");

    try {
      const [eventsResponse, teamsResponse] = await Promise.all([
        fetch(`/api/event-finder?league=${encodeURIComponent(league)}&days=365`),
        fetch(
          `/api/event-finder?league=${encodeURIComponent(
            league,
          )}&mode=teams`,
        ),
      ]);

      const eventsData = await eventsResponse.json();
      const teamsData = await teamsResponse.json();

      if (!eventsResponse.ok) {
        throw new Error(
          eventsData.error || "Unable to load football fixtures.",
        );
      }

      if (!teamsResponse.ok) {
        throw new Error(
          teamsData.error || "Unable to load football teams.",
        );
      }

      setEvents(Array.isArray(eventsData.events) ? eventsData.events : []);
      setTeams(Array.isArray(teamsData.teams) ? teamsData.teams : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load football data.",
      );
      setEvents([]);
      setTeams([]);
    } finally {
      setLoading(false);
      setTeamsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [league, refreshKey]);

  const suggestions = useMemo(() => {
    const query = clubQuery.trim().toLowerCase();

    if (query.length < 3) return [];

    return teams
      .filter((team) =>
        [
          team.name,
          team.shortName,
          team.abbreviation,
        ].some((value) => value.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [clubQuery, teams]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const teamMatch = selectedTeam
        ? event.homeTeam.id === selectedTeam.id ||
          event.awayTeam.id === selectedTeam.id
        : true;

      return teamMatch && matchesSearch(event, searchQuery);
    });
  }, [events, selectedTeam, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            NFMX Football
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Global Event Finder
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Find upcoming football fixtures across major club and
            international competitions.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">
              Competition
            </span>

            <select
              value={league}
              onChange={(event) => setLeague(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60"
            >
              {Object.entries(groupedCompetitions).map(
                ([group, items]) => (
                  <optgroup key={group} label={group}>
                    {items.map((competition) => (
                      <option
                        key={competition.slug}
                        value={competition.slug}
                      >
                        {competition.name}
                      </option>
                    ))}
                  </optgroup>
                ),
              )}
            </select>
          </label>

          <div className="relative">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/75">
                Search club
              </span>

              <input
                value={clubQuery}
                onChange={(event) => {
                  setClubQuery(event.target.value);
                  if (!event.target.value.trim()) {
                    setSelectedTeam(null);
                  }
                }}
                placeholder={
                  teamsLoading
                    ? "Loading clubs..."
                    : "Type at least 3 characters..."
                }
                disabled={teamsLoading}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/60"
              />
            </label>

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[76px] z-20 overflow-hidden rounded-xl border border-white/10 bg-[#101313] shadow-2xl">
                {suggestions.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeam(team);
                      setClubQuery(team.name);
                    }}
                    className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/5"
                  >
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt=""
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10" />
                    )}

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-white">
                        {team.name}
                      </span>
                      <span className="text-xs text-white/40">
                        {team.abbreviation || team.shortName}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by club, venue or city..."
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/60"
          />

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {selectedTeam && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
            {selectedTeam.logo && (
              <img
                src={selectedTeam.logo}
                alt=""
                className="h-7 w-7 object-contain"
              />
            )}

            <span className="text-sm text-white">
              Showing fixtures for{" "}
              <strong>{selectedTeam.name}</strong>
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedTeam(null);
                setClubQuery("");
              }}
              className="ml-auto text-xs text-white/50 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">
            {selectedCompetition.name}
          </h3>
          <p className="text-sm text-white/40">
            {filteredEvents.length} upcoming fixture
            {filteredEvents.length === 1 ? "" : "s"} found
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
          <p className="font-medium text-white">
            No upcoming fixtures found.
          </p>
          <p className="mt-1 text-sm text-white/40">
            Try another competition, club or search term.
          </p>
        </div>
      )}

      {!loading && filteredEvents.length > 0 && (
        <div className="grid gap-4">
          {filteredEvents.map((event) => {
            const status = getStatus(event);

            return (
              <article
                key={event.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-white/40">
                    {formatKickoff(event.date)}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                      status === "LIVE"
                        ? "bg-red-400/10 text-red-300"
                        : status === "FT"
                          ? "bg-white/10 text-white/50"
                          : "bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="flex items-center gap-3">
                    {event.homeTeam.logo ? (
                      <img
                        src={event.homeTeam.logo}
                        alt=""
                        className="h-11 w-11 object-contain"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-white/10" />
                    )}

                    <div>
                      <p className="font-medium text-white">
                        {event.homeTeam.name}
                      </p>
                      {event.homeTeam.score !== null && (
                        <p className="text-sm text-white/50">
                          {event.homeTeam.score}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center text-xs font-semibold text-white/30">
                    VS
                  </div>

                  <div className="flex items-center justify-end gap-3 text-right">
                    <div>
                      <p className="font-medium text-white">
                        {event.awayTeam.name}
                      </p>
                      {event.awayTeam.score !== null && (
                        <p className="text-sm text-white/50">
                          {event.awayTeam.score}
                        </p>
                      )}
                    </div>

                    {event.awayTeam.logo ? (
                      <img
                        src={event.awayTeam.logo}
                        alt=""
                        className="h-11 w-11 object-contain"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-white/10" />
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-2 border-t border-white/5 pt-4 text-xs text-white/45 sm:grid-cols-2">
                  <div>
                    📍{" "}
                    {[
                      event.venue.name,
                      event.venue.city,
                      event.venue.country,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "Venue unavailable"}
                  </div>

                  <div>
                    📺{" "}
                    {event.broadcasts.length > 0
                      ? event.broadcasts.join(", ")
                      : "Broadcast information unavailable"}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={event.eventUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    Match Details →
                  </a>

                  {event.homeTeam.url && (
                    <a
                      href={event.homeTeam.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      {event.homeTeam.name}
                    </a>
                  )}

                  {event.awayTeam.url && (
                    <a
                      href={event.awayTeam.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      {event.awayTeam.name}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-white/25">
        Football data provided by ESPN. Kickoff times are displayed in your
        browser&apos;s local timezone.
      </p>
    </div>
  );
}
