"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  Check,
  Copy,
  Globe2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  Workspace,
} from "../shared";

type NetworkInfo = {
  ip: string;
  network: string;
  org: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
};

export default function MyIpTools() {
  const [data, setData] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function loadIp() {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/my-ip", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Could not retrieve your IP information.",
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not retrieve your IP information.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIp();
  }, []);

  async function copyIp() {
    if (!data?.ip) return;

    await navigator.clipboard.writeText(data.ip);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe2 className="h-9 w-9" />
            </div>

            <h2 className="text-2xl font-semibold text-ink">
              What&apos;s My IP
            </h2>

            <p className="mt-2 max-w-lg text-sm text-muted">
              See your public IP address and basic network information.
            </p>

            {loading && (
              <div className="mt-8 flex items-center gap-2 text-sm text-muted">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Checking your connection...
              </div>
            )}

            {!loading && data && (
              <>
                <div className="mt-8">
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Your public IP
                  </div>

                  <div className="mt-2 break-all text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    {data.ip}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <PrimaryButton onClick={copyIp}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied" : "Copy IP"}
                  </PrimaryButton>

                  <SecondaryButton onClick={() => void loadIp()}>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </SecondaryButton>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <ResultPanel>
            <div>
              <h3 className="font-medium text-ink">Something went wrong</h3>

              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                {error}
              </div>

              <div className="mt-4">
                <SecondaryButton onClick={() => void loadIp()}>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </SecondaryButton>
              </div>
            </div>
          </ResultPanel>
        )}

        {data && !loading && (
          <ResultPanel>
            <div>
              <h3 className="mb-4 font-medium text-ink">
                Network information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Building2 className="h-5 w-5" />}
                  label="ISP / Organization"
                  value={data.org || "Unavailable"}
                />

                <InfoCard
                  icon={<Activity className="h-5 w-5" />}
                  label="Network"
                  value={data.network || "Unavailable"}
                />

                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={
                    [data.city, data.region, data.country]
                      .filter(Boolean)
                      .join(", ") || "Unavailable"
                  }
                />

                <InfoCard
                  icon={<Globe2 className="h-5 w-5" />}
                  label="Timezone"
                  value={data.timezone || "Unavailable"}
                />
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<Globe2 className="h-5 w-5" />}
            label="Public IP"
            value="The address visible to internet services."
          />

          <InfoCard
            icon={<Building2 className="h-5 w-5" />}
            label="Network"
            value="Basic information about the network carrying your connection."
          />

          <InfoCard
            icon={<MapPin className="h-5 w-5" />}
            label="Location"
            value="Approximate network-based location information."
          />
        </div>
      </div>
    </Workspace>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>

      <p className="mt-3 break-words text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}