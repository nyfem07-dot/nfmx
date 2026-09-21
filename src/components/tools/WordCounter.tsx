"use client";

import { useMemo, useState } from "react";
import { Workspace, SecondaryButton } from "./shared";

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || (trimmed ? 1 : 0);
  const paragraphs = trimmed.length === 0 ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingMinutes = words === 0 ? 0 : Math.max(1, Math.round(words / 200));
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
}

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: `${stats.readingMinutes} min` },
  ];

  return (
    <Workspace>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={10}
        className="w-full resize-y rounded-[6px] border border-border-strong bg-paper p-3 text-sm text-ink outline-none focus:border-ink"
      />
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-ink-faint">Counts update as you type.</p>
        <SecondaryButton onClick={() => setText("")} disabled={!text}>
          Clear
        </SecondaryButton>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[6px] border border-border px-3 py-3">
            <p className="font-data text-lg text-ink">{item.value}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </Workspace>
  );
}
