"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Workspace, PrimaryButton, SecondaryButton } from "./shared";

interface Rule {
  key: string;
  label: string;
  apply: (text: string) => string;
}

const rules: Rule[] = [
  {
    key: "trim",
    label: "Trim leading and trailing whitespace",
    apply: (t) => t.trim(),
  },
  {
    key: "collapseSpaces",
    label: "Collapse repeated spaces into one",
    apply: (t) => t.replace(/[ \t]{2,}/g, " "),
  },
  {
    key: "collapseLines",
    label: "Collapse repeated blank lines",
    apply: (t) => t.replace(/\n{3,}/g, "\n\n"),
  },
  {
    key: "smartQuotes",
    label: "Convert smart quotes to straight quotes",
    apply: (t) => t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'),
  },
  {
    key: "trailingSpace",
    label: "Remove trailing spaces on each line",
    apply: (t) =>
      t
        .split("\n")
        .map((line) => line.replace(/[ \t]+$/g, ""))
        .join("\n"),
  },
  {
    key: "nonBreaking",
    label: "Replace non-breaking spaces with regular spaces",
    apply: (t) => t.replace(/\u00a0/g, " "),
  },
];

export function TextCleaner() {
  const [input, setInput] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(rules.map((r) => [r.key, true]))
  );
  const [copied, setCopied] = useState(false);

  function clean(text: string) {
    let result = text;
    for (const rule of rules) {
      if (enabled[rule.key]) result = rule.apply(result);
    }
    return result;
  }

  const output = clean(input);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Workspace>
      <div className="grid gap-4 sm:grid-cols-2">
        {rules.map((rule) => (
          <label key={rule.key} className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={enabled[rule.key]}
              onChange={(e) => setEnabled((s) => ({ ...s, [rule.key]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-brass"
            />
            <span className="text-ink-muted">{rule.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs text-ink-muted">Original</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder="Paste messy text here…"
            className="w-full resize-y rounded-[6px] border border-border-strong bg-paper p-3 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs text-ink-muted">Cleaned</p>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full resize-y rounded-[6px] border border-border bg-paper/60 p-3 text-sm text-ink outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <PrimaryButton onClick={handleCopy} disabled={!output}>
          <span className="flex items-center gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy result"}
          </span>
        </PrimaryButton>
        <SecondaryButton onClick={() => setInput("")} disabled={!input}>
          Clear
        </SecondaryButton>
      </div>
    </Workspace>
  );
}
