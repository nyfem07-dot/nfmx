"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Copy,
  Dices,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  TextInput,
  Workspace,
} from "../shared";

type PaletteColor = {
  hex: string;
  rgb: string;
  hsl: string;
};

type PaletteMode =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split"
  | "monochromatic";

const DEFAULT_COLOR = "#5B7CFA";

function normalizeHex(value: string) {
  const trimmed = value.trim();

  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (/^[0-9a-f]{6}$/i.test(trimmed)) {
    return `#${trimmed.toUpperCase()}`;
  }

  return null;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s =
      l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

    switch (max) {
      case red:
        h =
          (green - blue) / d +
          (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      default:
        h = (red - green) / d + 4;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  const saturation = s / 100;
  const lightness = l / 100;

  const chroma =
    (1 - Math.abs(2 * lightness - 1)) * saturation;

  const x =
    chroma *
    (1 -
      Math.abs(((h / 60) % 2) - 1));

  const m = lightness - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = chroma;
    g = x;
  } else if (h < 120) {
    r = x;
    g = chroma;
  } else if (h < 180) {
    g = chroma;
    b = x;
  } else if (h < 240) {
    g = x;
    b = chroma;
  } else if (h < 300) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return rgbToHex(
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255,
  );
}

function createColor(hex: string): PaletteColor {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
  };
}

function generatePalette(
  baseHex: string,
  mode: PaletteMode,
) {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  let hexValues: string[] = [];

  switch (mode) {
    case "complementary":
      hexValues = [
        baseHex,
        hslToHex((h + 180) % 360, s, l),
      ];
      break;

    case "analogous":
      hexValues = [
        hslToHex((h + 330) % 360, s, l),
        baseHex,
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h + 60) % 360, s, l),
      ];
      break;

    case "triadic":
      hexValues = [
        baseHex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ];
      break;

    case "split":
      hexValues = [
        baseHex,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
      ];
      break;

    case "monochromatic":
      hexValues = [
        hslToHex(h, s, Math.max(15, l - 30)),
        hslToHex(h, s, Math.max(25, l - 15)),
        baseHex,
        hslToHex(h, s, Math.min(85, l + 15)),
        hslToHex(h, s, Math.min(95, l + 30)),
      ];
      break;
  }

  return hexValues.map(createColor);
}

function randomHex() {
  return rgbToHex(
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  );
}

export default function ColorPaletteTools() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [mode, setMode] =
    useState<PaletteMode>("complementary");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const palette = useMemo(
    () => generatePalette(color, mode),
    [color, mode],
  );

  function updateColor(value: string) {
    setColor(value.toUpperCase());
    setError("");
  }

  function applyColor() {
    const normalized = normalizeHex(color);

    if (!normalized) {
      setError("Enter a valid 6-digit HEX color.");
      return;
    }

    setColor(normalized);
    setError("");
  }

  function randomize() {
    setColor(randomHex());
    setError("");
  }

  function reset() {
    setColor(DEFAULT_COLOR);
    setMode("complementary");
    setError("");
    setCopied("");
  }

  async function copyValue(
    label: string,
    value: string,
  ) {
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

  async function copyPalette() {
    try {
      const text = palette
        .map(
          (item) =>
            `${item.hex} — ${item.rgb} — ${item.hsl}`,
        )
        .join("\n");

      await navigator.clipboard.writeText(text);
      setCopied("palette");

      window.setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Could not copy the palette.");
    }
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold text-ink">
                Color Palette Studio
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Generate useful color combinations from a
                single base color.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_auto]">
              <Field label="Base Color">
                <TextInput
                  value={color}
                  onChange={(event) =>
                    updateColor(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applyColor();
                    }
                  }}
                  placeholder="#5B7CFA"
                />
              </Field>

              <div className="flex items-end gap-3">
                <PrimaryButton onClick={applyColor}>
                  Generate
                </PrimaryButton>

                <SecondaryButton onClick={randomize}>
                  <Dices className="h-4 w-4" />
                  Random
                </SecondaryButton>
              </div>
            </div>

            <div className="mt-5">
              <Field label="Palette Style">
                <select
                  value={mode}
                  onChange={(event) =>
                    setMode(
                      event.target.value as PaletteMode,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                >
                  <option value="complementary">
                    Complementary
                  </option>
                  <option value="analogous">
                    Analogous
                  </option>
                  <option value="triadic">
                    Triadic
                  </option>
                  <option value="split">
                    Split Complementary
                  </option>
                  <option value="monochromatic">
                    Monochromatic
                  </option>
                </select>
              </Field>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <SecondaryButton onClick={copyPalette}>
                {copied === "palette" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === "palette"
                  ? "Palette Copied"
                  : "Copy Palette"}
              </SecondaryButton>

              <SecondaryButton onClick={reset}>
                <RefreshCw className="h-4 w-4" />
                Reset
              </SecondaryButton>
            </div>
          </div>
        </div>

        <ResultPanel>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-ink">
                  Generated Palette
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {mode.charAt(0).toUpperCase() +
                    mode.slice(1)}{" "}
                  color relationship
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {palette.map((item, index) => (
                <ColorCard
                  key={`${item.hex}-${index}`}
                  color={item}
                  index={index}
                  copied={copied}
                  onCopy={copyValue}
                />
              ))}
            </div>
          </div>
        </ResultPanel>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="HEX"
            text="Six-digit hexadecimal color values ready for web design."
          />

          <InfoCard
            title="RGB"
            text="Red, green and blue values for digital interfaces."
          />

          <InfoCard
            title="HSL"
            text="Hue, saturation and lightness values for precise color control."
          />
        </div>
      </div>
    </Workspace>
  );
}

function ColorCard({
  color,
  index,
  copied,
  onCopy,
}: {
  color: PaletteColor;
  index: number;
  copied: string;
  onCopy: (label: string, value: string) => void;
}) {
  const label = `color-${index}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
      <div
        className="h-36"
        style={{ backgroundColor: color.hex }}
      />

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <code className="text-lg font-semibold text-ink">
            {color.hex}
          </code>

          <button
            type="button"
            onClick={() =>
              onCopy(label, color.hex)
            }
            className="text-muted transition hover:text-ink"
            aria-label={`Copy ${color.hex}`}
          >
            {copied === label ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted">RGB</span>
            <code className="text-ink">
              {color.rgb}
            </code>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted">HSL</span>
            <code className="text-ink">
              {color.hsl}
            </code>
          </div>
        </div>
      </div>
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