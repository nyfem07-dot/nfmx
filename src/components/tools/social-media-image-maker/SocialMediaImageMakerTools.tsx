"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  Dropzone,
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  Select,
  TextInput,
  Workspace,
} from "../shared";

type PresetKey =
  | "instagram"
  | "story"
  | "x"
  | "youtube"
  | "linkedin"
  | "facebook";

type Preset = {
  label: string;
  width: number;
  height: number;
};

const presets: Record<PresetKey, Preset> = {
  instagram: {
    label: "Instagram Post",
    width: 1080,
    height: 1080,
  },
  story: {
    label: "Instagram / Facebook Story",
    width: 1080,
    height: 1920,
  },
  x: {
    label: "X Post",
    width: 1600,
    height: 900,
  },
  youtube: {
    label: "YouTube Thumbnail",
    width: 1280,
    height: 720,
  },
  linkedin: {
    label: "LinkedIn Post",
    width: 1200,
    height: 627,
  },
  facebook: {
    label: "Facebook Post",
    width: 1200,
    height: 630,
  },
};

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  scale: number,
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let drawWidth: number;
  let drawHeight: number;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
  }

  drawWidth *= scale;
  drawHeight *= scale;

  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;

    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);

  return lines;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export default function SocialMediaImageMakerTools() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [preset, setPreset] = useState<PresetKey>("instagram");
  const [file, setFile] = useState<File | null>(null);
  const [headline, setHeadline] = useState("Your headline goes here");
  const [background, setBackground] = useState("#111827");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("64");
  const [overlay, setOverlay] = useState("35");
  const [imageScale, setImageScale] = useState("100");
  const [padding, setPadding] = useState("80");
  const [radius, setRadius] = useState("0");
  const [isReady, setIsReady] = useState(false);

  const currentPreset = presets[preset];

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!file) {
      imageRef.current = null;
      setIsReady(false);
      return;
    }

    const url = URL.createObjectURL(file);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = url;

    const image = new Image();

    image.onload = () => {
      imageRef.current = image;
      setIsReady(true);
    };

    image.src = url;
  }, [file]);

  useEffect(() => {
    renderCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    preset,
    headline,
    background,
    textColor,
    fontSize,
    overlay,
    imageScale,
    padding,
    radius,
    isReady,
  ]);

  function renderCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const width = currentPreset.width;
    const height = currentPreset.height;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    if (imageRef.current) {
      ctx.save();

      if (Number(radius) > 0) {
        roundedRect(
          ctx,
          0,
          0,
          width,
          height,
          Number(radius),
        );
        ctx.clip();
      }

      drawImageCover(
        ctx,
        imageRef.current,
        width,
        height,
        Math.max(Number(imageScale) / 100, 0.1),
      );

      ctx.restore();

      const overlayOpacity = Math.min(
        Math.max(Number(overlay) / 100, 0),
        1,
      );

      ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }

    const size = Math.max(Number(fontSize) || 64, 12);
    const sidePadding = Math.max(Number(padding) || 0, 0);

    ctx.fillStyle = textColor;
    ctx.font = `800 ${size}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxTextWidth = width - sidePadding * 2;
    const lines = wrapText(
      ctx,
      headline || "",
      Math.max(maxTextWidth, 100),
    );

    const lineHeight = size * 1.15;
    const totalHeight = lines.length * lineHeight;
    const startY = height / 2 - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        width / 2,
        startY + index * lineHeight,
        Math.max(maxTextWidth, 100),
      );
    });
  }

  function handleFiles(files: File[]) {
    const selected = files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      return;
    }

    setFile(selected);
  }

  function downloadImage() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `nfmx-${preset}.png`;
      link.click();

      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function copyImage() {
    const canvas = canvasRef.current;

    if (!canvas || !navigator.clipboard) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob || typeof ClipboardItem === "undefined") {
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
    } catch {
      // Clipboard image support varies by browser.
    }
  }

  function reset() {
    setPreset("instagram");
    setFile(null);
    setHeadline("Your headline goes here");
    setBackground("#111827");
    setTextColor("#ffffff");
    setFontSize("64");
    setOverlay("35");
    setImageScale("100");
    setPadding("80");
    setRadius("0");
  }

  return (
    <Workspace>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Field label="Social media preset">
            <Select
              value={preset}
              onChange={(event) =>
                setPreset(event.target.value as PresetKey)
              }
            >
              {Object.entries(presets).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label} — {value.width} × {value.height}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Background image">
            <Dropzone
              accept="image/*"
              hint="Drop an image here, or click to browse"
              onFiles={handleFiles}
            />
          </Field>

          <Field label="Headline">
            <TextInput
              value={headline}
              onChange={(event) =>
                setHeadline(event.target.value)
              }
              placeholder="Enter your headline"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Background">
              <input
                type="color"
                value={background}
                onChange={(event) =>
                  setBackground(event.target.value)
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-transparent"
              />
            </Field>

            <Field label="Text color">
              <input
                type="color"
                value={textColor}
                onChange={(event) =>
                  setTextColor(event.target.value)
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-transparent"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Font size">
              <TextInput
                type="number"
                min="12"
                max="240"
                value={fontSize}
                onChange={(event) =>
                  setFontSize(event.target.value)
                }
              />
            </Field>

            <Field label="Image scale (%)">
              <TextInput
                type="number"
                min="20"
                max="200"
                value={imageScale}
                onChange={(event) =>
                  setImageScale(event.target.value)
                }
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Overlay (%)">
              <TextInput
                type="number"
                min="0"
                max="100"
                value={overlay}
                onChange={(event) =>
                  setOverlay(event.target.value)
                }
              />
            </Field>

            <Field label="Padding (px)">
              <TextInput
                type="number"
                min="0"
                max="400"
                value={padding}
                onChange={(event) =>
                  setPadding(event.target.value)
                }
              />
            </Field>
          </div>

          <Field label="Corner radius">
            <TextInput
              type="number"
              min="0"
              max="300"
              value={radius}
              onChange={(event) =>
                setRadius(event.target.value)
              }
            />
          </Field>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={downloadImage}
              disabled={!isReady && !headline}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </PrimaryButton>

            <SecondaryButton onClick={copyImage}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Copy Image
            </SecondaryButton>

            <SecondaryButton onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </SecondaryButton>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            Your image is processed locally in your browser. NFMX
            does not upload the image to a server.
          </div>
        </div>

        <ResultPanel>
          <div className="flex min-h-[500px] items-center justify-center overflow-auto rounded-2xl border border-[var(--border)] bg-black/20 p-5">
            <div className="w-full max-w-3xl">
              <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>
                  {currentPreset.label}
                </span>
                <span>
                  {currentPreset.width} × {currentPreset.height}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-2xl">
                <canvas
                  ref={canvasRef}
                  className="block h-auto w-full"
                />
              </div>

              {!file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
                  <Upload className="h-4 w-4" />
                  Upload an image to create a social graphic.
                </div>
              )}
            </div>
          </div>
        </ResultPanel>
      </div>
    </Workspace>
  );
}