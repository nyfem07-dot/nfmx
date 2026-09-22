"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Globe2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  TextInput,
  Workspace,
} from "../shared";

type StatusResult = {
  url: string;
  statusCode: number;
  statusText: string;
  responseTime: number;
  finalUrl: string;
  status: "online" | "redirected" | "client-error" | "server-error" | "unknown";
};

export default function WebsiteStatusTools() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkWebsite() {
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/website-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not check this website.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not check this website.",
      );
    } finally {
      setLoading(false);
    }
  }

  const statusLabel =
    result?.status === "online"
      ? "Online"
      : result?.status === "redirected"
        ? "Redirected"
        : result?.status === "client-error"
          ? "Client Error"
          : result?.status === "server-error"
            ? "Server Error"
            : "Unknown";

  const statusTitle =
    result?.status === "online"
      ? "Website is online"
      : result?.status === "redirected"
        ? "Website redirected"
        : result?.status === "client-error"
          ? "Website returned a client error"
          : result?.status === "server-error"
            ? "Website returned a server error"
            : "Website responded";

  const isHealthy = result?.status === "online";

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe2 className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold text-ink">
                Website Status Checker
              </h2>

              <p className="mt-2 max-w-lg text-sm text-muted">
                Check whether a website is reachable and see its response
                status and speed.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <label className="text-sm font-medium text-ink">
                Website URL
              </label>

              <TextInput
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="example.com"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) {
                    void checkWebsite();
                  }
                }}
              />

              <PrimaryButton
                onClick={() => void checkWebsite()}
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe2 className="h-4 w-4" />
                )}

                {loading ? "Checking..." : "Check Website"}
              </PrimaryButton>
            </div>
          </div>
        </div>

        {error && (
          <ResultPanel>
            <div>
              <h3 className="font-medium text-ink">Check failed</h3>

              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                {error}
              </div>
            </div>
          </ResultPanel>
        )}

        {result && (
          <ResultPanel>
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {isHealthy ? (
                    <CheckCircle2 className="h-7 w-7 text-green-400" />
                  ) : (
                    <XCircle className="h-7 w-7 text-red-400" />
                  )}

                  <div>
                    <h3 className="font-semibold text-ink">
                      {statusTitle}
                    </h3>

                    <p className="mt-1 break-all text-sm text-muted">
                      {result.finalUrl}
                    </p>
                  </div>
                </div>

                <SecondaryButton
                  onClick={() => void checkWebsite()}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4" />
                  Check Again
                </SecondaryButton>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <InfoCard
                  label="HTTP Status"
                  value={`${result.statusCode} ${result.statusText}`}
                />

                <InfoCard
                  label="Response Time"
                  value={`${result.responseTime} ms`}
                />

                <InfoCard label="Status" value={statusLabel} />
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            label="HTTP Status"
            value="The response code returned by the website."
          />

          <InfoCard
            label="Response Time"
            value="How long the server took to respond."
          />

          <InfoCard
            label="Redirects"
            value="Shows the final URL after redirects."
          />
        </div>
      </div>
    </Workspace>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="text-sm text-muted">{label}</div>

      <p className="mt-3 break-words text-sm leading-6 text-ink">
        {value}
      </p>
    </div>
  );
}