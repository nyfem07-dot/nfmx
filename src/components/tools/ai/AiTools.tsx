"use client";

import { useState } from "react";
import {
  WandSparkles,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  Select,
  Workspace,
} from "../shared";

type Mode =
  | "summarize"
  | "rewrite"
  | "grammar"
  | "email"
  | "caption";

const modes = [
  ["summarize", "Summarize"],
  ["rewrite", "Rewrite"],
  ["grammar", "Fix Grammar"],
  ["email", "Write Email"],
  ["caption", "Create Caption"],
] as const;

const modeInstructions: Record<Mode, string> = {
  summarize:
    "Summarize the user's text clearly. Keep the important information and remove unnecessary detail. Use short paragraphs or bullet points where appropriate.",
  rewrite:
    "Rewrite the user's text to make it clearer, more natural, and better written while preserving the original meaning.",
  grammar:
    "Correct grammar, spelling, punctuation, and awkward phrasing. Return only the corrected version unless a brief explanation is necessary.",
  email:
    "Turn the user's notes into a clear, natural, professional email. Do not invent important facts that were not provided.",
  caption:
    "Create a natural, engaging social-media caption based on the user's text. Avoid generic corporate language and keep it suitable for a modern social platform.",
};

export function AiTools() {
  const [mode, setMode] = useState<Mode>("summarize");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("natural");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    const text = input.trim();

    if (!text) {
      setError("Enter some text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setCopied(false);

    const prompt = `${modeInstructions[mode]}

Tone: ${tone}.

User's content:
${text}`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      setResult(data.text || "The AI returned an empty response.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <Workspace>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {modes.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setResult("");
              setError("");
            }}
            className={`rounded-[8px] border px-3 py-3 text-sm font-medium transition-colors ${
              mode === id
                ? "border-ink bg-ink text-paper"
                : "border-border bg-paper-raised text-ink hover:border-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Tone">
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="natural">Natural</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="concise">Concise</option>
            <option value="casual">Casual</option>
          </Select>
        </Field>

        <div className="flex items-end">
          <p className="text-xs leading-5 text-ink-faint">
            Your text is sent to the AI service only when you click Generate.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Field label="Your text">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "email"
                ? "Paste your notes or describe the email you want to write..."
                : mode === "caption"
                  ? "Describe what you want the caption to say..."
                  : "Paste or type your text here..."
            }
            rows={10}
            className="w-full resize-y rounded-[6px] border border-border-strong bg-paper px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-ink"
          />
        </Field>
      </div>

      {error && (
        <p className="mt-3 text-sm text-ink-muted">
          {error}
        </p>
      )}

      <div className="mt-4">
        <PrimaryButton
          onClick={() => void generate()}
          disabled={loading || !input.trim()}
        >
          <span className="inline-flex items-center gap-2">
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <WandSparkles size={15} />
            )}
            {loading ? "Generating…" : "Generate"}
          </span>
        </PrimaryButton>
      </div>

      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-ink-muted">
              Result
            </p>

            <button
              type="button"
              onClick={() => void copyResult()}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink">
            {result}
          </div>
        </ResultPanel>
      )}
    </Workspace>
  );
}
