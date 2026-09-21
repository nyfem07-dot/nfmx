"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Percent,
  Landmark,
  TrendingUp,
  CalendarDays,
  Sigma,
} from "lucide-react";
import {
  Field,
  ResultPanel,
  Select,
  TextInput,
  Workspace,
} from "../shared";

type CalculatorType =
  | "scientific"
  | "percentage"
  | "loan"
  | "compound"
  | "age"
  | "engineering";

const calculators = [
  { id: "scientific", name: "Scientific Calculator", icon: Calculator },
  { id: "percentage", name: "Percentage Calculator", icon: Percent },
  { id: "loan", name: "Loan Calculator", icon: Landmark },
  { id: "compound", name: "Compound Interest", icon: TrendingUp },
  { id: "age", name: "Age Calculator", icon: CalendarDays },
  { id: "engineering", name: "Engineering Calculator", icon: Sigma },
] as const;

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(value);
}

export function CalculatorTools() {
  const [active, setActive] = useState<CalculatorType>("scientific");

  return (
    <Workspace>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => {
          const Icon = calculator.icon;
          const selected = active === calculator.id;

          return (
            <button
              key={calculator.id}
              type="button"
              onClick={() => setActive(calculator.id)}
              className={`flex items-center gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper-raised text-ink hover:border-ink"
              }`}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span className="text-sm font-medium">{calculator.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {active === "scientific" && <ScientificCalculator />}
        {active === "percentage" && <PercentageCalculator />}
        {active === "loan" && <LoanCalculator />}
        {active === "compound" && <CompoundCalculator />}
        {active === "age" && <AgeCalculator />}
        {active === "engineering" && <EngineeringCalculator />}
      </div>
    </Workspace>
  );
}

function ScientificCalculator() {
  const [expression, setExpression] = useState("");

  function calculate() {
    try {
      const safe = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/p/g, String(Math.PI))
        .replace(/\^/g, "**");

      if (!/^[0-9+\-*/().%\s*]+$/.test(safe)) {
        throw new Error();
      }

      const result = Function(`"use strict"; return (${safe})`)();

      if (!Number.isFinite(result)) throw new Error();

      setExpression(String(result));
    } catch {
      setExpression("Error");
    }
  }

  const buttons = [
    "7", "8", "9", "÷",
    "4", "5", "6", "×",
    "1", "2", "3", "-",
    "0", ".", "%", "+",
    "(", ")", "^", "=",
  ];

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">
        Scientific Calculator
      </h3>

      <p className="mt-1 text-sm text-ink-muted">
        Perform everyday mathematical calculations directly in your browser.
      </p>

      <div className="mt-4">
        <TextInput
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") calculate();
          }}
          placeholder="Enter an expression"
          className="w-full text-right text-lg"
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:max-w-md">
        {buttons.map((button) => (
          <button
            key={button}
            type="button"
            onClick={() => {
              if (button === "=") {
                calculate();
              } else {
                setExpression((current) =>
                  current === "Error" ? button : current + button,
                );
              }
            }}
            className={`rounded-[6px] border border-border-strong px-3 py-3 text-sm font-medium text-ink hover:border-ink ${
              button === "=" ? "bg-ink text-paper" : "bg-paper-raised"
            }`}
          >
            {button}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpression("")}
        className="mt-3 text-xs text-ink-muted underline underline-offset-2"
      >
        Clear
      </button>
    </div>
  );
}

function PercentageCalculator() {
  const [value, setValue] = useState("100");
  const [percentage, setPercentage] = useState("15");

  const result = Number(value) * (Number(percentage) / 100);

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">Percentage Calculator</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Calculate what percentage of a number is worth.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Number">
          <TextInput
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>

        <Field label="Percentage">
          <TextInput
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </Field>
      </div>

      <ResultPanel>
        <p className="text-xs text-ink-muted">
          {percentage}% of {value}
        </p>
        <p className="mt-1 text-2xl font-semibold text-ink">
          {formatNumber(result)}
        </p>
      </ResultPanel>
    </div>
  );
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("15");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const p = Number(principal);
    const monthlyRate = Number(rate) / 100 / 12;
    const months = Number(years) * 12;

    if (!p || !months) return null;

    const payment =
      monthlyRate === 0
        ? p / months
        : (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    return {
      payment,
      total: payment * months,
      interest: payment * months - p,
    };
  }, [principal, rate, years]);

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">Loan Calculator</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Estimate monthly payments and total loan cost.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount">
          <TextInput
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>

        <Field label="Annual interest (%)">
          <TextInput
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>

        <Field label="Term (years)">
          <TextInput
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>
      </div>

      {result && (
        <ResultPanel>
          <p className="text-xs text-ink-muted">Estimated monthly payment</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {formatNumber(result.payment)}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-ink-muted">Total repayment</p>
              <p className="font-medium text-ink">
                {formatNumber(result.total)}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-muted">Total interest</p>
              <p className="font-medium text-ink">
                {formatNumber(result.interest)}
              </p>
            </div>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

function CompoundCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("12");

  const result = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(years);
    const n = Number(frequency);

    if (!p || !Number.isFinite(r) || !t || !n) return null;

    const amount = p * Math.pow(1 + r / n, n * t);

    return {
      amount,
      interest: amount - p,
    };
  }, [principal, rate, years, frequency]);

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">Compound Interest</h3>
      <p className="mt-1 text-sm text-ink-muted">
        See how an investment grows when interest compounds over time.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Starting amount">
          <TextInput
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Field>

        <Field label="Annual interest (%)">
          <TextInput
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>

        <Field label="Years">
          <TextInput
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </Field>

        <Field label="Compounding">
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="1">Annually</option>
            <option value="2">Semi-annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </Select>
        </Field>
      </div>

      {result && (
        <ResultPanel>
          <p className="text-xs text-ink-muted">Future value</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {formatNumber(result.amount)}
          </p>

          <p className="mt-3 text-xs text-ink-muted">Interest earned</p>
          <p className="font-medium text-ink">
            {formatNumber(result.interest)}
          </p>
        </ResultPanel>
      )}
    </div>
  );
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");

  const age = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(`${birthDate}T00:00:00`);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      );
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  }, [birthDate]);

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">Age Calculator</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Calculate your exact age in years, months and days.
      </p>

      <div className="mt-5 max-w-sm">
        <Field label="Date of birth">
          <TextInput
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Field>
      </div>

      {age && (
        <ResultPanel>
          <p className="text-xs text-ink-muted">Your age</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {age.years} years, {age.months} months, {age.days} days
          </p>
        </ResultPanel>
      )}
    </div>
  );
}

function EngineeringCalculator() {
  const [force, setForce] = useState("1000");
  const [area, setArea] = useState("0.01");

  const stress = Number(force) / Number(area);

  return (
    <div>
      <h3 className="text-base font-semibold text-ink">
        Engineering Calculator
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Calculate basic mechanical-engineering quantities.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Force (N)">
          <TextInput
            type="number"
            value={force}
            onChange={(e) => setForce(e.target.value)}
          />
        </Field>

        <Field label="Area (m²)">
          <TextInput
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </Field>
      </div>

      <ResultPanel>
        <p className="text-xs text-ink-muted">Normal stress</p>
        <p className="mt-1 text-2xl font-semibold text-ink">
          {formatNumber(stress)} Pa
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Stress = Force ÷ Area
        </p>
      </ResultPanel>
    </div>
  );
}

