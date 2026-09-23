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

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const positions: Record<Position, string> = {
  "top-left": "Top Left",
  "top-center": "Top Center",
  "top-right": "Top Right",
  "center-left": "Center Left",
  center: "Center",
  "center-right": "Center Right",
  "bottom-left": "Bottom Left",
  "bottom-center": "Bottom Center",
  "bottom-right": "Bottom Right",
};

export default function ImageWatermarkTools() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("NFMX");
  const [fontSize, setFontSize] = useState("48");
  const [opacity, setOpacity] = useState("45");
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] =
    useState<Position>("bottom-right");
  const [rotation, setRotation] = useState("0");
  const [tiled, setTiled] = useState(false);
  const [format, setFormat] =
    useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState("92");
  const [isReady, setIsReady] = useState(false);

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
    text,
    fontSize,
    opacity,
    color,
    position,
    rotation,
    tiled,
    isReady,
  ]);

  function handleFiles(files: File[]) {
    const selected = files[0];

    if (!selected || !selected.type.startsWith("image/")) {
      return;
    }

    setFile(selected);
  }

  function getPosition(
    width: number,
    height: number,
    textWidth: number,
    textHeight: number,
  ) {
    const padding = Math.max(
      24,
      Math.round(Math.min(width, height) * 0.04),
    );

    let x = width / 2;
    let y = height / 2;

    if (position.includes("left")) {
      x = padding + textWidth / 2;
    }

    if (position.includes("right")) {
      x = width - padding - textWidth / 2;
    }

    if (
      position === "top-left" ||
      position === "top-center" ||
      position === "top-right"
    ) {
      y = padding + textHeight / 2;
    }

    if (
      position === "bottom-left" ||
      position === "bottom-center" ||
      position === "bottom-right"
    ) {
      y = height - padding - textHeight / 2;
    }

    return { x, y };
  }

  function drawWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) {
    const watermark = text.trim();

    if (!watermark) {
      return;
    }

    const size = Math.max(
      8,
      Math.min(Number(fontSize) || 48, 500),
    );

    const alpha = Math.min(
      Math.max(Number(opacity) / 100, 0),
      1,
    );

    const angle =
      (Number(rotation) || 0) * (Math.PI / 180);

    ctx.save();

    ctx.font = `700 ${size}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;

    const metrics = ctx.measureText(watermark);
    const textWidth = metrics.width;
    const textHeight = size * 1.15;

    if (tiled) {
      const gapX = Math.max(80, textWidth * 1.8);
      const gapY = Math.max(80, textHeight * 2.2);

      for (
        let y = -height;
        y < height * 2;
        y += gapY
      ) {
        for (
          let x = -width;
          x < width * 2;
          x += gapX
        ) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillText(watermark, 0, 0);
          ctx.restore();
        }
      }

      ctx.restore();
      return;
    }

    const { x, y } = getPosition(
      width,
      height,
      textWidth,
      textHeight,
    );

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(watermark, 0, 0);

    ctx.restore();
  }

  function renderCanvas() {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) {
      return;
    }

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    drawWatermark(
      ctx,
      canvas.width,
      canvas.height,
    );
  }

  function downloadImage() {
    const canvas = canvasRef.current;

    if (!canvas || !isReady) {
      return;
    }

    const mime =
      format === "jpeg"
        ? "image/jpeg"
        : "image/png";

    const extension =
      format === "jpeg"
        ? "jpg"
        : "png";

    const imageQuality =
      format === "jpeg"
        ? Math.min(
            Math.max(Number(quality) / 100, 0.1),
            1,
          )
        : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `nfmx-watermarked-image.${extension}`;
        link.click();

        URL.revokeObjectURL(url);
      },
      mime,
      imageQuality,
    );
  }

  function reset() {
    setFile(null);
    setText("NFMX");
    setFontSize("48");
    setOpacity("45");
    setColor("#ffffff");
    setPosition("bottom-right");
    setRotation("0");
    setTiled(false);
    setFormat("png");
    setQuality("92");
  }

  return (
    <Workspace>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Field label="Image">
            <Dropzone
              accept="image/*"
              hint="Drop an image here, or click to browse"
              onFiles={handleFiles}
            />
          </Field>

          <Field label="Watermark text">
            <TextInput
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              placeholder="Enter watermark text"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Font size">
              <TextInput
                type="number"
                min="8"
                max="500"
                value={fontSize}
                onChange={(event) =>
                  setFontSize(event.target.value)
                }
              />
            </Field>

            <Field label="Opacity (%)">
              <TextInput
                type="number"
                min="0"
                max="100"
                value={opacity}
                onChange={(event) =>
                  setOpacity(event.target.value)
                }
              />
            </Field>
          </div>

          <Field label="Text color">
            <div className="flex gap-3">
              <input
                type="color"
                value={color}
                onChange={(event) =>
                  setColor(event.target.value)
                }
                className="h-11 w-14 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--card)] p-1"
              />

              <TextInput
                value={color}
                onChange={(event) =>
                  setColor(event.target.value)
                }
              />
            </div>
          </Field>

          <Field label="Position">
            <Select
              value={position}
              onChange={(event) =>
                setPosition(
                  event.target.value as Position,
                )
              }
              disabled={tiled}
            >
              {Object.entries(positions).map(
                ([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ),
              )}
            </Select>
          </Field>

          <Field label="Rotation (degrees)">
            <TextInput
              type="number"
              min="-180"
              max="180"
              value={rotation}
              onChange={(event) =>
                setRotation(event.target.value)
              }
              disabled={tiled}
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
            <input
              type="checkbox"
              checked={tiled}
              onChange={(event) =>
                setTiled(event.target.checked)
              }
              className="h-4 w-4"
            />
            <span>
              Repeat watermark across the image
            </span>
          </label>

          <Field label="Export format">
            <Select
              value={format}
              onChange={(event) =>
                setFormat(
                  event.target.value as "png" | "jpeg",
                )
              }
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
            </Select>
          </Field>

          {format === "jpeg" && (
            <Field label="JPG quality (%)">
              <TextInput
                type="number"
                min="10"
                max="100"
                value={quality}
                onChange={(event) =>
                  setQuality(event.target.value)
                }
              />
            </Field>
          )}

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={downloadImage}
              disabled={!isReady}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </PrimaryButton>

            <SecondaryButton onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </SecondaryButton>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            <div className="mb-2 flex items-center gap-2 text-[var(--foreground)]">
              <ImageIcon className="h-4 w-4" />
              Private by design
            </div>
            Your image is processed locally in your
            browser. NFMX does not upload your image.
          </div>
        </div>

        <ResultPanel>
          <div className="flex min-h-[500px] items-center justify-center overflow-auto rounded-2xl border border-[var(--border)] bg-black/20 p-5">
            <div className="w-full max-w-4xl">
              {isReady ? (
                <>
                  <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Watermark preview</span>
                    <span>
                      {imageRef.current?.width} ×{" "}
                      {imageRef.current?.height}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-2xl">
                    <canvas
                      ref={canvasRef}
                      className="block h-auto w-full"
                    />
                  </div>
                </>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-[var(--muted)]">
                  <div>
                    <Upload className="mx-auto mb-3 h-8 w-8" />
                    Upload an image to add a watermark.
                  </div>
                </div>
              )}
            </div>
          </div>
        </ResultPanel>
      </div>
    </Workspace>
  );
}