"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  Image as ImageIcon,
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
} from "@/components/tools/shared";

type BackgroundMode = "solid" | "gradient";

export default function ScreenshotBeautifierTools() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("gradient");
  const [background, setBackground] = useState("#151827");
  const [gradientEnd, setGradientEnd] = useState("#5b7cff");
  const [padding, setPadding] = useState("64");
  const [radius, setRadius] = useState("24");
  const [shadow, setShadow] = useState("32");
  const [scale, setScale] = useState("100");
  const [outputUrl, setOutputUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      return;
    }

    setFile(selectedFile);
    setOutputUrl("");
    setCopied(false);
  }

  function reset() {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    setFile(null);
    setPreviewUrl("");
    setOutputUrl("");
    setCopied(false);
    setBusy(false);
    setBackgroundMode("gradient");
    setBackground("#151827");
    setGradientEnd("#5b7cff");
    setPadding("64");
    setRadius("24");
    setShadow("32");
    setScale("100");
  }

  function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radiusValue: number,
  ) {
    const r = Math.min(radiusValue, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function generate() {
    if (!file) return;

    setBusy(true);
    setCopied(false);

    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        setBusy(false);
        return;
      }

      const paddingValue = Math.max(
        0,
        Math.min(Number(padding) || 0, 300),
      );

      const radiusValue = Math.max(
        0,
        Math.min(Number(radius) || 0, 100),
      );

      const shadowValue = Math.max(
        0,
        Math.min(Number(shadow) || 0, 80),
      );

      const scaleValue =
        Math.max(25, Math.min(Number(scale) || 100, 150)) / 100;

      const imageWidth = Math.round(image.width * scaleValue);
      const imageHeight = Math.round(image.height * scaleValue);

      const shadowSpace = shadowValue * 2;

      canvas.width =
        imageWidth + paddingValue * 2 + shadowSpace;

      canvas.height =
        imageHeight + paddingValue * 2 + shadowSpace;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setBusy(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundMode === "solid") {
        ctx.fillStyle = background;
      } else {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        gradient.addColorStop(0, background);
        gradient.addColorStop(1, gradientEnd);

        ctx.fillStyle = gradient;
      }

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const x = shadowSpace / 2 + paddingValue;
      const y = shadowSpace / 2 + paddingValue;

      ctx.save();

      if (shadowValue > 0) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = shadowValue;
        ctx.shadowOffsetY = Math.round(shadowValue / 3);
      }

      roundedRect(
        ctx,
        x,
        y,
        imageWidth,
        imageHeight,
        radiusValue,
      );

      ctx.clip();

      ctx.drawImage(
        image,
        x,
        y,
        imageWidth,
        imageHeight,
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setBusy(false);
            return;
          }

          if (outputUrl) {
            URL.revokeObjectURL(outputUrl);
          }

          setOutputUrl(URL.createObjectURL(blob));
          setBusy(false);
        },
        "image/png",
        1,
      );
    };

    image.onerror = () => {
      setBusy(false);
    };

    image.src = URL.createObjectURL(file);
  }

  async function copyImage() {
    if (!outputUrl) return;

    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Workspace>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Screenshot Beautifier
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Turn screenshots into clean, presentation-ready images
          with polished backgrounds, spacing, rounded corners, and
          shadows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Field label="Screenshot">
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 text-center transition hover:border-primary/50 hover:bg-card">
              <ImageIcon className="mb-3 h-8 w-8 text-ink-muted" />

              <span className="text-sm font-medium text-ink">
                {file ? file.name : "Choose an image"}
              </span>

              <span className="mt-1 text-xs text-ink-faint">
                PNG, JPG, WEBP, GIF
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  handleFile(event.target.files?.[0])
                }
              />
            </label>
          </Field>

          <Field label="Background">
            <div className="grid grid-cols-2 gap-2">
              <SecondaryButton
                onClick={() => setBackgroundMode("solid")}
              >
                Solid
              </SecondaryButton>

              <SecondaryButton
                onClick={() => setBackgroundMode("gradient")}
              >
                Gradient
              </SecondaryButton>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start color">
              <TextInput
                value={background}
                onChange={(event) =>
                  setBackground(event.target.value)
                }
                placeholder="#151827"
              />
            </Field>

            {backgroundMode === "gradient" && (
              <Field label="End color">
                <TextInput
                  value={gradientEnd}
                  onChange={(event) =>
                    setGradientEnd(event.target.value)
                  }
                  placeholder="#5b7cff"
                />
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Padding">
              <TextInput
                type="number"
                value={padding}
                onChange={(event) =>
                  setPadding(event.target.value)
                }
              />
            </Field>

            <Field label="Corner radius">
              <TextInput
                type="number"
                value={radius}
                onChange={(event) =>
                  setRadius(event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Shadow">
              <TextInput
                type="number"
                value={shadow}
                onChange={(event) =>
                  setShadow(event.target.value)
                }
              />
            </Field>

            <Field label="Scale (%)">
              <TextInput
                type="number"
                value={scale}
                onChange={(event) =>
                  setScale(event.target.value)
                }
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={generate}
              disabled={!file || busy}
            >
              <Sparkles className="h-4 w-4" />
              {busy ? "Generating..." : "Beautify Screenshot"}
            </PrimaryButton>

            <SecondaryButton onClick={reset}>
              <RefreshCw className="h-4 w-4" />
              Reset
            </SecondaryButton>
          </div>
        </div>

        <ResultPanel>
          {outputUrl ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-black/20">
                <img
                  src={outputUrl}
                  alt="Beautified screenshot"
                  className="max-h-[520px] w-full object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = outputUrl;
                    link.download =
                      "nfmx-beautified-screenshot.png";
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </PrimaryButton>

                <SecondaryButton onClick={copyImage}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}

                  {copied ? "Copied" : "Copy Image"}
                </SecondaryButton>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-black/20">
              <img
                src={previewUrl}
                alt="Selected screenshot"
                className="max-h-[520px] w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <ImageIcon className="h-10 w-10 text-ink-faint" />

              <p className="mt-4 text-sm font-medium text-ink">
                No screenshot selected
              </p>

              <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-muted">
                Choose an image, adjust the styling, then generate
                your polished screenshot.
              </p>
            </div>
          )}
        </ResultPanel>
      </div>

      <canvas ref={(canvas) => {
        canvasRef.current = canvas;
      }} className="hidden" />

      <p className="mt-5 text-xs leading-relaxed text-ink-faint">
        Your image is processed locally in your browser. NFMX does
        not upload the screenshot to a server.
      </p>
    </Workspace>
  );
}