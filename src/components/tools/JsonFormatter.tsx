"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { Workspace, PrimaryButton, SecondaryButton } from "./shared";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function run(mode: "format" | "minify") {
    if (!input.trim()) {
      setError(null);
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Workspace>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here, e.g. {"name":"Toolbox","ready":true}'
        rows={10}
        className="w-full resize-y rounded-[6px] border border-border-strong bg-paper p-3 font-mono text-[0.83rem] text-ink outline-none focus:border-ink"
        spellCheck={false}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PrimaryButton onClick={() => run("format")} disabled={!input.trim()}>
          Format
        </PrimaryButton>
        <SecondaryButton onClick={() => run("minify")}>Minify</SecondaryButton>
        <SecondaryButton
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          disabled={!input}
        >
          Clear
        </SecondaryButton>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-border bg-paper px-3 py-2.5 text-sm text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.75} />
          <span>
            This isn&apos;t valid JSON: <span className="text-ink-muted">{error}</span>
          </span>
        </div>
      )}

      {output && !error && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs text-ink-muted">Result</p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-[6px] border border-border bg-paper/60 p-3 font-mono text-[0.83rem] text-ink">
            {output}
          </pre>
        </div>
      )}
    </Workspace>
  );
}
