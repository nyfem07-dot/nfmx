"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Copy, RotateCcw } from "lucide-react";

function encodeBase64(value: string, urlSafe: boolean) {
  const bytes = new TextEncoder().encode(value);

  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  let result = btoa(binary);

  if (urlSafe) {
    result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  return result;
}

function decodeBase64(value: string, urlSafe: boolean) {
  let normalized = value.trim();

  if (urlSafe) {
    normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");

    while (normalized.length % 4 !== 0) {
      normalized += "=";
    }
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error("Invalid Base64 string.");
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Tools() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) {
      return { value: "", error: "" };
    }

    try {
      if (mode === "encode") {
        return {
          value: encodeBase64(input, urlSafe),
          error: "",
        };
      }

      return {
        value: decodeBase64(input, urlSafe),
        error: "",
      };
    } catch {
      return {
        value: "",
        error:
          mode === "decode"
            ? "Invalid Base64 string. Check the input and try again."
            : "Unable to encode this text.",
      };
    }
  }, [input, mode, urlSafe]);

  async function copyResult() {
    if (!result.value) return;

    await navigator.clipboard.writeText(result.value);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function clearAll() {
    setInput("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            mode === "encode"
              ? "bg-emerald-500 text-black"
              : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
          }`}
        >
          Encode
        </button>

        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            mode === "decode"
              ? "bg-emerald-500 text-black"
              : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
          }`}
        >
          Decode
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          checked={urlSafe}
          onChange={(event) => setUrlSafe(event.target.checked)}
          className="h-4 w-4 rounded border-white/20"
        />
        URL-safe Base64
      </label>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">
              {mode === "encode" ? "Text" : "Base64"}
            </label>

            <span className="text-xs text-white/40">
              {input.length.toLocaleString()} characters
            </span>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              mode === "encode"
                ? "Type or paste text here..."
                : "Paste Base64 here..."
            }
            spellCheck={false}
            className="min-h-[300px] w-full resize-y rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/40"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">
              {mode === "encode" ? "Base64 Result" : "Decoded Text"}
            </label>

            <button
              type="button"
              onClick={copyResult}
              disabled={!result.value}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="min-h-[300px] whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-sm leading-6 text-white/90">
            {result.error ? (
              <div className="text-sm text-red-400">{result.error}</div>
            ) : result.value ? (
              result.value
            ) : (
              <span className="text-white/25">
                Your result will appear here...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-white/45">
        <Clipboard className="h-4 w-4 shrink-0" />
        Processing happens locally in your browser. Your text is not uploaded.
      </div>
    </div>
  );
}
