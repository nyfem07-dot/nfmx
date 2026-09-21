"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Radio, RefreshCw, Search, Volume2 } from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  Select,
  TextInput,
  Workspace,
} from "./shared";

type Station = {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  country: string;
  countrycode: string;
  language: string;
  tags: string;
  codec: string;
  bitrate: number;
  clickcount: number;
  lastcheckok: boolean;
};

const API_SERVERS = [
  "https://de1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
];

const countries = [
  ["", "All countries"],
  ["NG", "Nigeria"],
  ["GH", "Ghana"],
  ["KE", "Kenya"],
  ["ZA", "South Africa"],
  ["US", "United States"],
  ["GB", "United Kingdom"],
  ["CA", "Canada"],
  ["AU", "Australia"],
  ["DE", "Germany"],
  ["FR", "France"],
  ["IN", "India"],
  ["JP", "Japan"],
  ["BR", "Brazil"],
];

const PAGE_SIZE = 200;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function GlobalRadio() {
  const [stations, setStations] = useState<Station[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playing, setPlaying] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  async function fetchFromServer(
    server: string,
    searchQuery: string,
    countryCode: string,
    offset: number,
  ): Promise<Station[]> {
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
      hidebroken: "true",
      order: "clickcount",
      reverse: "true",
    });

    if (searchQuery.trim()) {
      params.set("name", searchQuery.trim());
    }

    if (countryCode) {
      params.set("countrycode", countryCode);
    }

    const response = await fetch(
      `${server}/json/stations/search?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return (await response.json()) as Station[];
  }

  async function loadStations(
    searchQuery = query,
    countryCode = country,
    append = false,
  ) {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError("");
      setHasMore(true);
    }

    const offset = append ? stations.length : 0;
    const servers = shuffle(API_SERVERS);
    let lastError: unknown = null;

    for (const server of servers) {
      try {
        const results = await fetchFromServer(
          server,
          searchQuery,
          countryCode,
          offset,
        );

        const usable = results.filter(
          (station) =>
            station.stationuuid &&
            station.name &&
            station.url_resolved &&
            station.lastcheckok !== false,
        );

        setStations((previous) => {
          if (!append) {
            return usable;
          }

          const existing = new Set(
            previous.map((station) => station.stationuuid),
          );

          const additional = usable.filter(
            (station) => !existing.has(station.stationuuid),
          );

          return [...previous, ...additional];
        });

        setHasMore(results.length === PAGE_SIZE);
        setLoading(false);
        setLoadingMore(false);
        return;
      } catch (err) {
        lastError = err;
      }
    }

    setLoading(false);
    setLoadingMore(false);

    if (!append) {
      setStations([]);
    }

    setError(
      lastError
        ? "Radio stations could not be loaded. Please try again."
        : "No radio stations were found.",
    );
  }

  function playStation(station: Station) {
    const audio = audioRef.current;

    if (!audio) return;

    setStreamError("");
    setCurrentStation(station);

    audio.pause();
    audio.src = station.url_resolved;
    audio.load();

    void audio
      .play()
      .then(() => {
        setPlaying(true);
      })
      .catch(() => {
        setPlaying(false);
        setStreamError(
          "This station could not be played in your browser. Try another station.",
        );
      });
  }

  function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || !currentStation) return;

    if (audio.paused) {
      void audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
          setStreamError("Playback could not start. Try another station.");
        });
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStations("", "");
    }, 0);

    return () => window.clearTimeout(timer);
    // Initial station load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Workspace>
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setStreamError(
            "This station stopped responding. Try another station.",
          );
        }}
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
        <Field label="Search stations">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />

            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void loadStations();
                }
              }}
              placeholder="Station name..."
              className="w-full pl-9"
            />
          </div>
        </Field>

        <Field label="Country">
          <Select
            value={country}
            onChange={(event) => {
              const nextCountry = event.target.value;

              setCountry(nextCountry);
              void loadStations(query, nextCountry);
            }}
            className="w-full"
          >
            {countries.map(([code, name]) => (
              <option key={code || "all"} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </Field>

        <PrimaryButton
          onClick={() => void loadStations()}
          disabled={loading}
        >
          <span className="inline-flex items-center gap-2">
            <Search size={15} />
            Search
          </span>
        </PrimaryButton>
      </div>

      {currentStation && (
        <ResultPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-ink-faint">Now playing</p>

              <p className="mt-1 truncate text-lg font-semibold text-ink">
                {currentStation.name}
              </p>

              <p className="mt-1 text-sm text-ink-muted">
                {currentStation.country || "Unknown country"}
                {currentStation.codec ? ` · ${currentStation.codec}` : ""}
                {currentStation.bitrate
                  ? ` · ${currentStation.bitrate} kbps`
                  : ""}
              </p>
            </div>

            <SecondaryButton onClick={togglePlayback}>
              <span className="inline-flex items-center gap-2">
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? "Pause" : "Play"}
              </span>
            </SecondaryButton>
          </div>

          {streamError && (
            <p className="mt-3 text-sm text-ink-muted">{streamError}</p>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
            <Volume2 size={14} />
            Use your browser&apos;s audio controls to adjust volume.
          </div>
        </ResultPanel>
      )}

      {loading && (
        <ResultPanel>
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <RefreshCw size={16} className="animate-spin" />
            Finding radio stations…
          </div>
        </ResultPanel>
      )}

      {!loading && error && (
        <ResultPanel>
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">{error}</p>

            <SecondaryButton onClick={() => void loadStations()}>
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={15} />
                Try again
              </span>
            </SecondaryButton>
          </div>
        </ResultPanel>
      )}

      {!loading && !error && stations.length === 0 && (
        <ResultPanel>
          <p className="text-sm text-ink-muted">
            No compatible stations were found. Try another search or country.
          </p>
        </ResultPanel>
      )}

      {!loading && !error && stations.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-ink-faint">
              {stations.length.toLocaleString()} stations loaded
            </p>

            <button
              type="button"
              onClick={() => void loadStations()}
              disabled={loadingMore}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={loadingMore ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {stations.map((station) => {
            const isCurrent =
              currentStation?.stationuuid === station.stationuuid;

            return (
              <div
                key={station.stationuuid}
                className="flex items-center gap-3 rounded-[8px] border border-border px-3 py-3"
              >
                <button
                  type="button"
                  onClick={() => playStation(station)}
                  aria-label={`Play ${station.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-opacity hover:opacity-90"
                >
                  {isCurrent && playing ? (
                    <Pause size={15} />
                  ) : (
                    <Play size={15} />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {station.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {station.country || "Unknown country"}
                    {station.codec ? ` · ${station.codec}` : ""}
                    {station.bitrate ? ` · ${station.bitrate} kbps` : ""}
                  </p>
                </div>

                {isCurrent && (
                  <Radio
                    size={16}
                    className="shrink-0 text-ink-muted"
                  />
                )}
              </div>
            );
          })}

          {hasMore && (
            <div className="flex justify-center pt-4">
              <SecondaryButton
                onClick={() => void loadStations(query, country, true)}
                disabled={loadingMore}
              >
                <span className="inline-flex items-center gap-2">
                  {loadingMore && (
                    <RefreshCw size={15} className="animate-spin" />
                  )}
                  {loadingMore ? "Loading stations…" : "Load more stations"}
                </span>
              </SecondaryButton>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Radio streams are provided by third-party stations. Some stations may
        become unavailable or may not work on every network or browser.
      </p>
    </Workspace>
  );
}