"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  Select,
  TextInput,
  Workspace,
} from "./shared";

type Rates = Record<string, number>;

const currencies = [
  ["USD", "US Dollar"],
  ["EUR", "Euro"],
  ["GBP", "British Pound"],
  ["NGN", "Nigerian Naira"],
  ["CAD", "Canadian Dollar"],
  ["AUD", "Australian Dollar"],
  ["JPY", "Japanese Yen"],
  ["CNY", "Chinese Yuan"],
  ["INR", "Indian Rupee"],
  ["GHS", "Ghanaian Cedi"],
  ["ZAR", "South African Rand"],
  ["KES", "Kenyan Shilling"],
  ["AED", "UAE Dirham"],
  ["SAR", "Saudi Riyal"],
  ["CHF", "Swiss Franc"],
];

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  async function loadRates(base: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch exchange rates.");
      }

      const data: { rates: Rates; date?: string } = await response.json();

      setRates({
        [base]: 1,
        ...data.rates,
      });

      setUpdatedAt(data.date ?? "");
    } catch {
      setRates(null);
      setError(
        "Exchange rates could not be loaded. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRates(from);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [from]);

  const result = useMemo(() => {
    const numericAmount = Number(amount);

    if (!rates || !Number.isFinite(numericAmount)) {
      return null;
    }

    const rate = rates[to];

    if (!rate) {
      return null;
    }

    return numericAmount * rate;
  }, [amount, rates, to]);

  const rate = rates?.[to];

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  return (
    <Workspace>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <Field label="Amount">
          <TextInput
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1"
          />
        </Field>

        <SecondaryButton onClick={swapCurrencies}>
          <span className="inline-flex items-center gap-2">
            <ArrowDownUp size={16} />
            Swap
          </span>
        </SecondaryButton>

        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <Select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="To">
            <Select
              value={to}
              onChange={(event) => setTo(event.target.value)}
            >
              {currencies.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      {loading && (
        <ResultPanel>
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <RefreshCw size={16} className="animate-spin" />
            Loading exchange rates…
          </div>
        </ResultPanel>
      )}

      {!loading && error && (
        <ResultPanel>
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">{error}</p>

            <PrimaryButton onClick={() => void loadRates(from)}>
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={15} />
                Try again
              </span>
            </PrimaryButton>
          </div>
        </ResultPanel>
      )}

      {!loading && !error && result !== null && (
        <ResultPanel>
          <p className="text-sm text-ink-muted">
            {amount || "0"} {from} =
          </p>

          <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {result.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            {to}
          </p>

          {rate !== undefined && (
            <p className="mt-3 text-sm text-ink-muted">
              1 {from} ={" "}
              {rate.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}{" "}
              {to}
            </p>
          )}

          {updatedAt && (
            <p className="mt-3 text-xs text-ink-faint">
              Reference rate dated {updatedAt}.
            </p>
          )}
        </ResultPanel>
      )}

      {!loading && !error && result === null && (
        <ResultPanel>
          <p className="text-sm text-ink-muted">
            Enter a valid amount to see the conversion.
          </p>
        </ResultPanel>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Rates are reference exchange rates and may differ from the rates offered
        by banks, cards, or money-transfer services.
      </p>
    </Workspace>
  );
}