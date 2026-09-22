"use client";

import { useRef, useState } from "react";
import { Activity, Download, Gauge, RotateCcw, Upload } from "lucide-react";
import { PrimaryButton, ResultPanel, SecondaryButton, Workspace } from "../shared";

type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

type SpeedResult = {
  ping: number;
  download: number;
  upload: number;
};

const TEST_SIZE = 5 * 1024 * 1024;

function formatSpeed(mbps: number) {
  if (!Number.isFinite(mbps)) return "0.00";
  return mbps >= 100 ? mbps.toFixed(0) : mbps.toFixed(2);
}

async function measurePing() {
  const samples: number[] = [];

  for (let i = 0; i < 4; i++) {
    const start = performance.now();

    try {
      await fetch(`/api/speed-test/ping?t=${Date.now()}-${i}`, {
        cache: "no-store",
      });

      samples.push(performance.now() - start);
    } catch {
      // Ignore failed samples.
    }
  }

  if (!samples.length) {
    throw new Error("Could not measure latency.");
  }

  samples.sort((a, b) => a - b);

  const usable = samples.length > 2 ? samples.slice(0, -1) : samples;

  return usable.reduce((sum, value) => sum + value, 0) / usable.length;
}

async function measureDownload() {
  const start = performance.now();

  const response = await fetch(
    `/api/speed-test/download?size=${TEST_SIZE}&t=${Date.now()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Download test failed.");
  }

  const buffer = await response.arrayBuffer();
  const elapsed = (performance.now() - start) / 1000;

  if (!buffer.byteLength || elapsed <= 0) {
    throw new Error("Download test returned no data.");
  }

  return (buffer.byteLength * 8) / elapsed / 1_000_000;
}

async function measureUpload() {
  const payload = new Uint8Array(TEST_SIZE);

  const start = performance.now();

  const response = await fetch("/api/speed-test/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Upload test failed.");
  }

  const elapsed = (performance.now() - start) / 1000;

  if (elapsed <= 0) {
    throw new Error("Upload test returned an invalid duration.");
  }

  return (payload.byteLength * 8) / elapsed / 1_000_000;
}

export default function SpeedTestTools() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef(false);

  const running = phase !== "idle" && phase !== "complete";

  async function runTest() {
    abortRef.current = false;
    setError("");
    setResult(null);
    setProgress(0);

    try {
      setPhase("ping");
      setProgress(10);

      const ping = await measurePing();

      if (abortRef.current) return;

      setPhase("download");
      setProgress(25);

      const download = await measureDownload();

      if (abortRef.current) return;

      setProgress(65);
      setPhase("upload");

      const upload = await measureUpload();

      if (abortRef.current) return;

      setProgress(100);
      setResult({ ping, download, upload });
      setPhase("complete");
    } catch (err) {
      setPhase("idle");
      setProgress(0);
      setError(
        err instanceof Error
          ? err.message
          : "The speed test could not be completed.",
      );
    }
  }

  function reset() {
    abortRef.current = true;
    setPhase("idle");
    setProgress(0);
    setResult(null);
    setError("");
  }

  const phaseLabel =
    phase === "ping"
      ? "Measuring latency..."
      : phase === "download"
        ? "Testing download speed..."
        : phase === "upload"
          ? "Testing upload speed..."
          : phase === "complete"
            ? "Test complete"
            : "Ready to test";

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-semibold text-ink">
              Internet Speed Test
            </h2>

            <p className="mt-2 max-w-lg text-sm text-muted">
              {phase === "idle"
                ? "Check your download speed, upload speed, and latency."
                : phase === "ping"
                  ? "Checking how quickly your connection responds."
                  : phase === "download"
                    ? "Downloading test data to measure your connection."
                    : phase === "upload"
                      ? "Uploading test data to measure your connection."
                      : "Your connection test has finished."}
            </p>

            {(running || phase === "complete") && (
              <div className="mt-7 w-full max-w-xl">
                <div className="mb-2 flex justify-between text-xs text-muted">
                  <span>{phaseLabel}</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-7 flex gap-3">
              {!running && (
                <PrimaryButton onClick={runTest}>
                  <Gauge className="h-4 w-4" />
                  {phase === "complete" ? "Test Again" : "Start Test"}
                </PrimaryButton>
              )}

              {running && (
                <SecondaryButton onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Cancel
                </SecondaryButton>
              )}
            </div>
          </div>
        </div>

        {error && (
          <ResultPanel>
            <div>
              <h3 className="font-medium text-ink">Test error</h3>

              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                {error}
              </div>
            </div>
          </ResultPanel>
        )}

        {result && (
          <ResultPanel>
            <div>
              <h3 className="mb-4 font-medium text-ink">Your results</h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard
                  icon={<Download className="h-5 w-5" />}
                  label="Download"
                  value={formatSpeed(result.download)}
                  unit="Mbps"
                />

                <ResultCard
                  icon={<Upload className="h-5 w-5" />}
                  label="Upload"
                  value={formatSpeed(result.upload)}
                  unit="Mbps"
                />

                <ResultCard
                  icon={<Activity className="h-5 w-5" />}
                  label="Latency"
                  value={Math.round(result.ping).toString()}
                  unit="ms"
                />
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Download"
            text="How quickly your connection can receive data."
          />

          <InfoCard
            title="Upload"
            text="How quickly your connection can send data."
          />

          <InfoCard
            title="Latency"
            text="How quickly your connection responds to a request."
          />
        </div>
      </div>
    </Workspace>
  );
}

function ResultCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-3xl font-semibold tracking-tight text-ink">
          {value}
        </span>

        <span className="pb-1 text-sm text-muted">{unit}</span>
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}