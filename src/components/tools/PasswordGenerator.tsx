"use client";

import { useMemo, useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Workspace, PrimaryButton } from "./shared";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}",
};

function generate(length: number, options: Record<keyof typeof SETS, boolean>) {
  const pool = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((k) => options[k])
    .map((k) => SETS[k])
    .join("");
  if (!pool) return "";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

function strength(length: number, optionsCount: number) {
  const score = length * optionsCount;
  if (score < 40) return { label: "Weak", value: 1 };
  if (score < 80) return { label: "Fair", value: 2 };
  if (score < 130) return { label: "Strong", value: 3 };
  return { label: "Very strong", value: 4 };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);

  const activeCount = Object.values(options).filter(Boolean).length;
  const meter = useMemo(() => strength(length, activeCount), [length, activeCount]);
  // Recomputed whenever length, options, or nonce change — nonce lets the
  // "generate new password" button force a fresh random value with the same settings.
  const password = useMemo(
    () => generate(length, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, options, nonce]
  );

  function regenerate() {
    setNonce((n) => n + 1);
  }

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Workspace>
      <div className="flex items-center gap-2 rounded-[6px] border border-border-strong bg-paper px-4 py-3.5">
        <p className="flex-1 truncate font-data text-lg text-ink">
          {password || "Select at least one character type"}
        </p>
        <button
          type="button"
          onClick={regenerate}
          aria-label="Generate new password"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-ink-muted hover:text-ink"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy password"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-ink-muted hover:text-ink"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= meter.value ? "bg-brass" : "bg-border"
            }`}
          />
        ))}
        <span className="ml-2 shrink-0 text-xs text-ink-muted">{meter.label}</span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">Length</span>
          <span className="font-data text-xs text-ink">{length} characters</span>
        </div>
        <input
          type="range"
          min={8}
          max={48}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="mt-2 w-full accent-brass"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {(
          [
            ["lower", "Lowercase (a–z)"],
            ["upper", "Uppercase (A–Z)"],
            ["numbers", "Numbers (0–9)"],
            ["symbols", "Symbols (!@#…)"],
          ] as [keyof typeof SETS, string][]
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(e) =>
                setOptions((s) => {
                  const next = { ...s, [key]: e.target.checked };
                  if (!Object.values(next).some(Boolean)) return s;
                  return next;
                })
              }
              className="h-4 w-4 accent-brass"
            />
            <span className="text-ink-muted">{label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={regenerate}>Generate new password</PrimaryButton>
      </div>
    </Workspace>
  );
}
