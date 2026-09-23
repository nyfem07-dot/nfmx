"use client";

import { useMemo, useState } from "react";
import { Copy, RotateCcw, Search } from "lucide-react";

type MatchInfo = {
  index: number;
  text: string;
  start: number;
  end: number;
  groups: string[];
};

export default function RegexTesterTools() {
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("");
  const [global, setGlobal] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [dotAll, setDotAll] = useState(false);
  const [unicode, setUnicode] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!pattern) {
      return {
        regex: null,
        matches: [] as MatchInfo[],
        error: "",
      };
    }

    try {
      const flags = [
        global ? "g" : "",
        ignoreCase ? "i" : "",
        multiline ? "m" : "",
        dotAll ? "s" : "",
        unicode ? "u" : "",
      ].join("");

      const regex = new RegExp(pattern, flags);
      const matches: MatchInfo[] = [];

      if (global) {
        let match: RegExpExecArray | null;

        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            index: matches.length + 1,
            text: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups: match.slice(1),
          });

          if (match[0] === "") {
            regex.lastIndex += 1;
          }
        }
      } else {
        const match = regex.exec(testText);

        if (match) {
          matches.push({
            index: 1,
            text: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups: match.slice(1),
          });
        }
      }

      return {
        regex,
        matches,
        error: "",
      };
    } catch (error) {
      return {
        regex: null,
        matches: [] as MatchInfo[],
        error:
          error instanceof Error ? error.message : "Invalid regular expression.",
      };
    }
  }, [pattern, testText, global, ignoreCase, multiline, dotAll, unicode]);

  const highlightedText = useMemo(() => {
    if (!testText || result.matches.length === 0) {
      return testText;
    }

    const pieces: Array<{
      text: string;
      matched: boolean;
    }> = [];

    let cursor = 0;

    for (const match of result.matches) {
      if (match.start > cursor) {
        pieces.push({
          text: testText.slice(cursor, match.start),
          matched: false,
        });
      }

      pieces.push({
        text: testText.slice(match.start, match.end),
        matched: true,
      });

      cursor = match.end;
    }

    if (cursor < testText.length) {
      pieces.push({
        text: testText.slice(cursor),
        matched: false,
      });
    }

    return pieces;
  }, [testText, result.matches]);

  async function copyMatches() {
    const output = result.matches
      .map(
        (match) =>
          `Match ${match.index}: ${match.text} [${match.start}-${match.end}]`,
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  function clearAll() {
    setPattern("");
    setTestText("");
    setGlobal(true);
    setIgnoreCase(false);
    setMultiline(false);
    setDotAll(false);
    setUnicode(false);
    setCopied(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Search className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Developer Tools
            </p>
            <h1 className="text-2xl font-semibold text-white">
              Regex Tester
            </h1>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-white/55">
          Test regular expressions against text, highlight matches and inspect
          capture groups directly in your browser.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-white">Regular Expression</h2>
              <p className="mt-1 text-xs text-white/40">
                Enter your regex pattern.
              </p>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:bg-white/5 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          <div className="flex items-center rounded-xl border border-white/10 bg-black/20">
            <span className="pl-4 font-mono text-lg text-white/35">/</span>

            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="\\b[A-Za-z]+\\b"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent px-3 py-4 font-mono text-sm text-white outline-none placeholder:text-white/20"
            />

            <span className="pr-4 font-mono text-lg text-white/35">/</span>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Flags
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <FlagButton
                label="g"
                description="Global"
                checked={global}
                onClick={() => setGlobal(!global)}
              />
              <FlagButton
                label="i"
                description="Ignore case"
                checked={ignoreCase}
                onClick={() => setIgnoreCase(!ignoreCase)}
              />
              <FlagButton
                label="m"
                description="Multiline"
                checked={multiline}
                onClick={() => setMultiline(!multiline)}
              />
              <FlagButton
                label="s"
                description="Dot all"
                checked={dotAll}
                onClick={() => setDotAll(!dotAll)}
              />
              <FlagButton
                label="u"
                description="Unicode"
                checked={unicode}
                onClick={() => setUnicode(!unicode)}
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
              Test Text
            </p>

            <textarea
              value={testText}
              onChange={(event) => setTestText(event.target.value)}
              placeholder="Paste or type text to test..."
              spellCheck={false}
              className="min-h-[260px] w-full resize-y rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/25"
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-medium text-white">Match Results</h2>
                <p className="mt-1 text-xs text-white/40">
                  {result.matches.length}{" "}
                  {result.matches.length === 1 ? "match" : "matches"} found
                </p>
              </div>

              <button
                type="button"
                onClick={copyMatches}
                disabled={result.matches.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {result.error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                <p className="text-sm font-medium text-red-300">
                  Invalid regular expression
                </p>
                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {result.error}
                </p>
              </div>
            ) : (
              <div className="min-h-[120px] rounded-xl border border-white/10 bg-black/20 p-4">
                {highlightedText ? (
                  Array.isArray(highlightedText) ? (
                    <div className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-white/70">
                      {highlightedText.map((piece, index) => (
                        <span
                          key={`${piece.text}-${index}`}
                          className={
                            piece.matched
                              ? "rounded bg-emerald-400/20 px-1 text-emerald-200 ring-1 ring-emerald-400/30"
                              : ""
                          }
                        >
                          {piece.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-mono text-sm text-white/40">
                      {highlightedText}
                    </div>
                  )
                ) : (
                  <p className="text-sm text-white/25">
                    Enter a regex and test text to see matches.
                  </p>
                )}
              </div>
            )}
          </div>

          {result.matches.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-medium text-white">
                Match Details
              </h2>

              <div className="space-y-3">
                {result.matches.map((match) => (
                  <div
                    key={`${match.index}-${match.start}-${match.end}`}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-white/45">
                        Match {match.index}
                      </span>

                      <span className="font-mono text-xs text-white/35">
                        characters {match.start}–{match.end}
                      </span>
                    </div>

                    <div className="mt-2 break-all rounded-lg bg-white/[0.03] px-3 py-2 font-mono text-sm text-emerald-200">
                      {match.text || "(empty match)"}
                    </div>

                    {match.groups.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs text-white/40">
                          Capture Groups
                        </p>

                        <div className="space-y-1">
                          {match.groups.map((group, groupIndex) => (
                            <div
                              key={`${match.index}-group-${groupIndex}`}
                              className="flex gap-3 rounded-lg bg-white/[0.02] px-3 py-2 font-mono text-xs"
                            >
                              <span className="text-white/30">
                                ${groupIndex + 1}
                              </span>
                              <span className="break-all text-white/60">
                                {group ?? "(undefined)"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-white/40">
        Regex processing happens locally in your browser. No test text is
        uploaded.
      </div>
    </div>
  );
}

function FlagButton({
  label,
  description,
  checked,
  onClick,
}: {
  label: string;
  description: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={description}
      className={`rounded-xl border px-3 py-3 text-left transition ${
        checked
          ? "border-emerald-400/30 bg-emerald-400/10"
          : "border-white/10 bg-white/[0.02] hover:bg-white/5"
      }`}
    >
      <span
        className={`font-mono text-sm ${
          checked ? "text-emerald-200" : "text-white/60"
        }`}
      >
        {label}
      </span>
      <span className="mt-1 block text-[10px] text-white/30">
        {description}
      </span>
    </button>
  );
}
