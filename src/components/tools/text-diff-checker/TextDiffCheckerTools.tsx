"use client";

import { useMemo, useState } from "react";

type DiffPart = {
  type: "same" | "added" | "removed";
  text: string;
};

function buildDiff(original: string, updated: string): DiffPart[] {
  const a = original.split(/\s+/).filter(Boolean);
  const b = updated.split(/\s+/).filter(Boolean);

  const rows: DiffPart[][] = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1),
  ).map(() => []);

  const dp = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0),
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffPart[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: a[i] });
      i++;
    } else {
      result.push({ type: "added", text: b[j] });
      j++;
    }
  }

  while (i < a.length) {
    result.push({ type: "removed", text: a[i] });
    i++;
  }

  while (j < b.length) {
    result.push({ type: "added", text: b[j] });
    j++;
  }

  return result;
}

function mergeParts(parts: DiffPart[]) {
  const merged: DiffPart[] = [];

  for (const part of parts) {
    const previous = merged[merged.length - 1];

    if (previous && previous.type === part.type) {
      previous.text += ` ${part.text}`;
    } else {
      merged.push({ ...part });
    }
  }

  return merged;
}

export default function TextDiffCheckerTools() {
  const [original, setOriginal] = useState("");
  const [updated, setUpdated] = useState("");

  const diff = useMemo(
    () => mergeParts(buildDiff(original, updated)),
    [original, updated],
  );

  const added = diff
    .filter((part) => part.type === "added")
    .reduce((total, part) => total + part.text.split(/\s+/).length, 0);

  const removed = diff
    .filter((part) => part.type === "removed")
    .reduce((total, part) => total + part.text.split(/\s+/).length, 0);

  const changed = added > 0 || removed > 0;

  function clearAll() {
    setOriginal("");
    setUpdated("");
  }

  async function copyDiff() {
    const text = diff
      .map((part) => {
        if (part.type === "added") return `[+] ${part.text}`;
        if (part.type === "removed") return `[-] ${part.text}`;
        return part.text;
      })
      .join(" ");

    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            NFMX Text Tools
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Text Diff Checker
          </h2>

          <p className="mt-1 text-sm text-white/55">
            Compare two texts and instantly see what was added,
            removed, or left unchanged.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-white/75">
                Original text
              </label>

              <span className="text-xs text-white/35">
                {original.length} characters
              </span>
            </div>

            <textarea
              value={original}
              onChange={(event) =>
                setOriginal(event.target.value)
              }
              placeholder="Paste the original text here..."
              className="min-h-[260px] w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/60"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-white/75">
                Updated text
              </label>

              <span className="text-xs text-white/35">
                {updated.length} characters
              </span>
            </div>

            <textarea
              value={updated}
              onChange={(event) =>
                setUpdated(event.target.value)
              }
              placeholder="Paste the updated text here..."
              className="min-h-[260px] w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white placeholder:text-white/30 outline-none transition focus:border-emerald-400/60"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={copyDiff}
            disabled={!changed}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Copy Diff
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/40">Status</p>
          <p className="mt-1 font-semibold text-white">
            {original || updated
              ? changed
                ? "Changes found"
                : "No changes"
              : "Waiting for text"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/40">Added</p>
          <p className="mt-1 font-semibold text-emerald-300">
            {added} word{added === 1 ? "" : "s"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/40">Removed</p>
          <p className="mt-1 font-semibold text-red-300">
            {removed} word{removed === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-white">
            Difference
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Added words appear in green and removed words appear
            in red.
          </p>
        </div>

        <div className="min-h-[140px] rounded-xl border border-white/10 bg-black/20 p-5 text-sm leading-8 text-white/70">
          {!original && !updated ? (
            <span className="text-white/25">
              Your comparison will appear here.
            </span>
          ) : (
            diff.map((part, index) => (
              <span
                key={`${part.type}-${index}`}
                className={
                  part.type === "added"
                    ? "rounded bg-emerald-400/15 px-1.5 py-1 text-emerald-300"
                    : part.type === "removed"
                      ? "rounded bg-red-400/15 px-1.5 py-1 text-red-300 line-through"
                      : "text-white/65"
                }
              >
                {part.text}{" "}
              </span>
            ))
          )}
        </div>
      </div>

      <p className="text-center text-xs text-white/25">
        NFMX compares your text directly in your browser.
      </p>
    </div>
  );
}
