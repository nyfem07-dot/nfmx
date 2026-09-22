"use client";

import { useState } from "react";
import {
  Check,
  Clipboard,
  ExternalLink,
  Globe2,
  Link2,
  RefreshCw,
} from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  TextInput,
  Workspace,
} from "../shared";

type UrlDetails = {
  href: string;
  origin: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  queryParameters: Array<[string, string]>;
};

function inspectUrl(value: string): UrlDetails {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Please enter a URL.");
  }

  const normalized = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = new URL(normalized);

  const queryParameters = Array.from(parsed.searchParams.entries());

  return {
    href: parsed.href,
    origin: parsed.origin,
    protocol: parsed.protocol.replace(":", ""),
    username: parsed.username,
    password: parsed.password,
    hostname: parsed.hostname,
    port: parsed.port || "Default",
    pathname: parsed.pathname,
    search: parsed.search || "None",
    hash: parsed.hash || "None",
    queryParameters,
  };
}

export default function UrlInspectorTools() {
  const [url, setUrl] = useState("");
  const [details, setDetails] = useState<UrlDetails | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  function inspect() {
    setError("");
    setDetails(null);
    setCopied("");

    try {
      setDetails(inspectUrl(url));
    } catch {
      setError("Please enter a valid URL.");
    }
  }

  function reset() {
    setUrl("");
    setDetails(null);
    setError("");
    setCopied("");
  }

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);

      window.setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Could not copy this value.");
    }
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Link2 className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold text-ink">
                URL Inspector
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Break down a URL into its protocol, domain, path,
                query parameters and other components.
              </p>
            </div>

            <div className="mt-8">
              <Field label="URL">
                <TextInput
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setDetails(null);
                    setError("");
                  }}
                  placeholder="https://example.com/path?name=value"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      inspect();
                    }
                  }}
                />
              </Field>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <PrimaryButton onClick={inspect}>
                  <Globe2 className="h-4 w-4" />
                  Inspect URL
                </PrimaryButton>

                {(url || details || error) && (
                  <SecondaryButton onClick={reset}>
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </SecondaryButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {details && (
          <>
            <ResultPanel>
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">
                      URL Components
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Parsed locally in your browser.
                    </p>
                  </div>

                  <SecondaryButton
                    onClick={() =>
                      copyValue("full", details.href)
                    }
                  >
                    {copied === "full" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                    {copied === "full"
                      ? "Copied"
                      : "Copy URL"}
                  </SecondaryButton>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailCard
                    label="Protocol"
                    value={details.protocol}
                    onCopy={() =>
                      copyValue(
                        "protocol",
                        details.protocol,
                      )
                    }
                    copied={copied === "protocol"}
                  />

                  <DetailCard
                    label="Hostname"
                    value={details.hostname}
                    onCopy={() =>
                      copyValue(
                        "hostname",
                        details.hostname,
                      )
                    }
                    copied={copied === "hostname"}
                  />

                  <DetailCard
                    label="Port"
                    value={details.port}
                    onCopy={() =>
                      copyValue("port", details.port)
                    }
                    copied={copied === "port"}
                  />

                  <DetailCard
                    label="Origin"
                    value={details.origin}
                    onCopy={() =>
                      copyValue("origin", details.origin)
                    }
                    copied={copied === "origin"}
                  />

                  <DetailCard
                    label="Path"
                    value={details.pathname}
                    onCopy={() =>
                      copyValue(
                        "pathname",
                        details.pathname,
                      )
                    }
                    copied={copied === "pathname"}
                  />

                  <DetailCard
                    label="Query"
                    value={details.search}
                    onCopy={() =>
                      copyValue("search", details.search)
                    }
                    copied={copied === "search"}
                  />

                  <DetailCard
                    label="Fragment"
                    value={details.hash}
                    onCopy={() =>
                      copyValue("hash", details.hash)
                    }
                    copied={copied === "hash"}
                  />

                  <DetailCard
                    label="Username"
                    value={details.username || "None"}
                    onCopy={() =>
                      copyValue(
                        "username",
                        details.username,
                      )
                    }
                    copied={copied === "username"}
                  />
                </div>
              </div>
            </ResultPanel>

            <ResultPanel>
              <div>
                <h3 className="font-semibold text-ink">
                  Query Parameters
                </h3>

                {details.queryParameters.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    This URL has no query parameters.
                  </p>
                ) : (
                  <div className="mt-5 overflow-hidden rounded-xl border border-border">
                    <div className="grid grid-cols-2 border-b border-border bg-background/70 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                      <span>Parameter</span>
                      <span>Value</span>
                    </div>

                    {details.queryParameters.map(
                      ([key, value], index) => (
                        <div
                          key={`${key}-${index}`}
                          className="grid grid-cols-2 gap-4 border-b border-border px-4 py-4 last:border-b-0"
                        >
                          <code className="break-all text-sm text-ink">
                            {key}
                          </code>

                          <code className="break-all text-sm text-muted">
                            {value || "Empty"}
                          </code>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </ResultPanel>

            <ResultPanel>
              <div>
                <h3 className="font-semibold text-ink">
                  Full URL
                </h3>

                <div className="mt-4 rounded-xl border border-border bg-background/70 p-5">
                  <code className="break-all text-sm leading-7 text-ink">
                    {details.href}
                  </code>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <SecondaryButton
                    onClick={() =>
                      window.open(
                        details.href,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open URL
                  </SecondaryButton>

                  <SecondaryButton
                    onClick={() =>
                      copyValue("full", details.href)
                    }
                  >
                    {copied === "full" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                    {copied === "full"
                      ? "Copied"
                      : "Copy URL"}
                  </SecondaryButton>
                </div>
              </div>
            </ResultPanel>
          </>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Domain"
            text="See the hostname and origin used by the URL."
          />

          <InfoCard
            title="Query Parameters"
            text="Inspect each parameter and its value separately."
          />

          <InfoCard
            title="Privacy"
            text="URL parsing happens locally in your browser."
          />
        </div>
      </div>
    </Workspace>
  );
}

function DetailCard({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>

        <button
          type="button"
          onClick={onCopy}
          className="text-muted transition hover:text-ink"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </button>
      </div>

      <code className="mt-3 block break-all text-sm leading-6 text-ink">
        {value}
      </code>
    </div>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        {text}
      </p>
    </div>
  );
}