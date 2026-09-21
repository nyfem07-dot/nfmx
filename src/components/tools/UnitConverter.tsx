"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Workspace, Field, Select, TextInput } from "./shared";

type UnitGroup = {
  label: string;
  units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
};

const linear = (factor: number) => ({
  toBase: (v: number) => v * factor,
  fromBase: (v: number) => v / factor,
});

const groups: Record<string, UnitGroup> = {
  length: {
    label: "Length",
    units: [
      { key: "m", label: "Meters", ...linear(1) },
      { key: "km", label: "Kilometers", ...linear(1000) },
      { key: "cm", label: "Centimeters", ...linear(0.01) },
      { key: "mm", label: "Millimeters", ...linear(0.001) },
      { key: "mi", label: "Miles", ...linear(1609.344) },
      { key: "yd", label: "Yards", ...linear(0.9144) },
      { key: "ft", label: "Feet", ...linear(0.3048) },
      { key: "in", label: "Inches", ...linear(0.0254) },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { key: "kg", label: "Kilograms", ...linear(1) },
      { key: "g", label: "Grams", ...linear(0.001) },
      { key: "mg", label: "Milligrams", ...linear(0.000001) },
      { key: "lb", label: "Pounds", ...linear(0.45359237) },
      { key: "oz", label: "Ounces", ...linear(0.028349523125) },
      { key: "st", label: "Stone", ...linear(6.35029318) },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { key: "c", label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { key: "f", label: "Fahrenheit", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { key: "k", label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { key: "l", label: "Liters", ...linear(1) },
      { key: "ml", label: "Milliliters", ...linear(0.001) },
      { key: "gal", label: "US Gallons", ...linear(3.785411784) },
      { key: "qt", label: "US Quarts", ...linear(0.946352946) },
      { key: "cup", label: "Cups", ...linear(0.2365882365) },
      { key: "floz", label: "Fluid ounces", ...linear(0.0295735296) },
    ],
  },
  area: {
    label: "Area",
    units: [
      { key: "sqm", label: "Square meters", ...linear(1) },
      { key: "sqkm", label: "Square kilometers", ...linear(1_000_000) },
      { key: "sqft", label: "Square feet", ...linear(0.09290304) },
      { key: "acre", label: "Acres", ...linear(4046.8564224) },
      { key: "hectare", label: "Hectares", ...linear(10000) },
    ],
  },
};

export function UnitConverter() {
  const [groupKey, setGroupKey] = useState("length");
  const group = groups[groupKey];
  const [fromUnit, setFromUnit] = useState(group.units[0].key);
  const [toUnit, setToUnit] = useState(group.units[1].key);
  const [value, setValue] = useState("1");

  function changeGroup(key: string) {
    setGroupKey(key);
    setFromUnit(groups[key].units[0].key);
    setToUnit(groups[key].units[1].key);
  }

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return "";
    const from = group.units.find((u) => u.key === fromUnit)!;
    const to = group.units.find((u) => u.key === toUnit)!;
    const converted = to.fromBase(from.toBase(num));
    return Number(converted.toFixed(6)).toString();
  }, [value, fromUnit, toUnit, group]);

  return (
    <Workspace>
      <Field label="Category">
        <Select value={groupKey} onChange={(e) => changeGroup(e.target.value)}>
          {Object.entries(groups).map(([key, g]) => (
            <option key={key} value={key}>
              {g.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Field label="From">
          <div className="flex flex-col gap-2">
            <TextInput
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="decimal"
            />
            <Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {group.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </Select>
          </div>
        </Field>

        <button
          type="button"
          aria-label="Swap units"
          onClick={() => {
            setFromUnit(toUnit);
            setToUnit(fromUnit);
          }}
          className="mb-2 flex h-9 w-9 items-center justify-center justify-self-center rounded-[6px] border border-border text-ink-muted hover:border-border-strong hover:text-ink"
        >
          <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <Field label="To">
          <div className="flex flex-col gap-2">
            <div className="flex h-[38px] items-center rounded-[6px] border border-border bg-paper/60 px-3 font-data text-sm text-ink">
              {result}
            </div>
            <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {group.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </Select>
          </div>
        </Field>
      </div>
    </Workspace>
  );
}
