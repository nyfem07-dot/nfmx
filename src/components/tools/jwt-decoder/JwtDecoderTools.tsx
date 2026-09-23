"use client";

import { useMemo, useState } from "react";
import { Copy, KeyRound, RotateCcw } from "lucide-react";

type JsonValue = Record<string, unknown> | unknown[];

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function getTimestampInfo(payload: Record<string, unknown>) {
  const fields = [
    { key: "iat", label: "Issued" },
    { key: "nbf", label: "Not Before" },
    { key: "exp", label: "Expires" },
  ];

  return fields
    .filter((field) => typeof payload[field.key] === "number")
    .map((field) => ({
      ...field,
      date: new Date((payload[field.key] as number) * 1000),
    }));
}

export default function JwtDecoderTools() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const decoded = useMemo(() => {
    setError("");

    const trimmed = token.trim();

    if (!trimmed) {
      return null;
    }

    const parts = trimmed.split(".");

    if (parts.length !== 3) {
      return null;
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0])) as Record<
        string,
        unknown
      >;

      const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<
        string,
        unknown
      >;

      return {
        header,
        payload,
        signature: parts[2],
      };
    } catch {
      return null;
    }
  }, [token]);

  const parts = token.trim().split(".");

  const looksLikeJwt = token.trim() && parts.length === 3;

  const isValid = Boolean(decoded);

  const timestampInfo = decoded
    ? getTimestampInfo(decoded.payload)
    : [];

  const expiration = timestampInfo.find((item) => item.key === "exp");

  const isExpired = expiration
    ? expiration.date.getTime() < Date.now()
    : false;

  function handleDecode() {
    const trimmed = token.trim();

    if (!trimmed) {
      setError("Paste a JWT token first.");
      return;
    }

    const jwtParts = trimmed.split(".");

    if (jwtParts.length !== 3) {
      setError(
        "This does not look like a JWT. A JWT normally contains three dot-separated parts.",
      );
      return;
    }

    try {
      JSON.parse(decodeBase64Url(jwtParts[0]));
      JSON.parse(decodeBase64Url(jwtParts[1]));
      setError("");
    } catch {
      setError("Unable to decode this token. Check that the JWT is valid.");
    }
  }

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);

      window.setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Copy failed. Please copy the text manually.");
    }
  }

  function clearAll() {
    setToken("");
    setError("");
    setCopied("");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <KeyRound className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Developer Tools
            </p>
            <h1 className="text-2xl font-semibold text-white">
              JWT Decoder
            </h1>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-white/55">
          Decode JSON Web Tokens instantly in your browser. Inspect the header,
          payload and token timestamps without needing a secret key.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-white">JWT Token</h2>
              <p className="mt-1 text-xs text-white/40">
                Paste your three-part JWT below.
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

          <textarea
            value={token}
            onChange={(event) => {
              setToken(event.target.value);
              setError("");
            }}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            spellCheck={false}
            className="min-h-[300px] w-full resize-y rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/25"
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-white/40">
              {looksLikeJwt ? "3 token sections detected" : "Waiting for JWT"}
            </div>

            <button
              type="button"
              onClick={handleDecode}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Decode JWT
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        <section className="space-y-5">
          {!decoded && !error && (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div>
                <KeyRound className="mx-auto mb-3 h-8 w-8 text-white/20" />
                <p className="text-sm text-white/45">
                  Your decoded JWT will appear here.
                </p>
              </div>
            </div>
          )}

          {decoded && (
            <>
              {expiration && (
                <div
                  className={`rounded-xl border px-4 py-3 ${
                    isExpired
                      ? "border-red-400/20 bg-red-400/5"
                      : "border-emerald-400/20 bg-emerald-400/5"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isExpired ? "text-red-300" : "text-emerald-300"
                    }`}
                  >
                    {isExpired ? "Token expired" : "Token is not expired"}
                  </div>

                  <div className="mt-1 text-xs text-white/45">
                    Expires: {expiration.date.toLocaleString()}
                  </div>
                </div>
              )}

              <JsonPanel
                title="Header"
                value={decoded.header}
                copied={copied === "header"}
                onCopy={() =>
                  copyText("header", formatJson(decoded.header))
                }
              />

              <JsonPanel
                title="Payload"
                value={decoded.payload}
                copied={copied === "payload"}
                onCopy={() =>
                  copyText("payload", formatJson(decoded.payload))
                }
              />

              {timestampInfo.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-4 font-medium text-white">
                    Token Timestamps
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {timestampInfo.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-xl border border-white/10 bg-black/20 p-3"
                      >
                        <p className="text-xs text-white/40">{item.label}</p>
                        <p className="mt-1 text-sm text-white">
                          {item.date.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-white">Signature</h2>
                    <p className="mt-1 text-xs text-white/40">
                      Encoded signature section.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText("signature", decoded.signature)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:bg-white/5 hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied === "signature" ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="break-all rounded-xl bg-black/20 p-4 font-mono text-xs leading-5 text-white/60">
                  {decoded.signature}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-white/40">
        JWT Decoder only decodes the token locally. It does not verify the
        signature or prove that the token is authentic.
      </div>
    </div>
  );
}

function JsonPanel({
  title,
  value,
  copied,
  onCopy,
}: {
  title: string;
  value: JsonValue;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium text-white">{title}</h2>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="max-h-[320px] overflow-auto rounded-xl bg-black/20 p-4 font-mono text-xs leading-5 text-white/70">
        {formatJson(value)}
      </pre>
    </div>
  );
}
