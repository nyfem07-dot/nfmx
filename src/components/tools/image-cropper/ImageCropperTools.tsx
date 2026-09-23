"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
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

type AspectRatio =
  | "free"
  | "1:1"
  | "4:5"
  | "16:9"
  | "9:16"
  | "3:2";

const aspectRatios: Record<
  AspectRatio,
  { label: string; ratio: number | null }
> = {
  free: {
    label: "Free",
    ratio: null,
  },
  "1:1": {
    label: "1:1 Square",
    ratio: 1,
  },
  "4:5": {
    label: "4:5 Portrait",
    ratio: 4 / 5,
  },
  "16:9": {
    label: "16:9 Landscape",
    ratio: 16 / 9,
  },
  "9:16": {
    label: "9:16 Portrait",
    ratio: 9 / 16,
  },
  "3:2": {
    label: "3:2 Landscape",
    ratio: 3 / 2,
  },
};

export default function ImageCropperTools() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>("free");
  const [zoom, setZoom] = useState("100");
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
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
    aspectRatio,
    zoom,
    rotation,
    flipHorizontal,
    flipVertical,
    isReady,
  ]);

  function getCropSize() {
    const image = imageRef.current;

    if (!image) {
      return {
        width: 0,
        height: 0,
      };
    }

    const ratio = aspectRatios[aspectRatio].ratio;

    if (!ratio) {
      return {
        width: image.width,
        height: image.height,
      };
    }

    let width = image.width;
    let height = width / ratio;

    if (height > image.height) {
      height = image.height;
      width = height * ratio;
    }

    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    };
  }

  function renderCanvas() {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) {
      return;
    }

    const crop = getCropSize();

    if (!crop.width || !crop.height) {
      return;
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, crop.width, crop.height);

    const scale = Math.max(Number(zoom) / 100, 0.1);

    ctx.save();

    ctx.translate(crop.width / 2, crop.height / 2);

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.scale(
      flipHorizontal ? -1 : 1,
      flipVertical ? -1 : 1,
    );

    const imageRatio = image.width / image.height;
    const cropRatio = crop.width / crop.height;

    let drawWidth: number;
    let drawHeight: number;

    if (imageRatio > cropRatio) {
      drawHeight = crop.height;
      drawWidth = crop.height * imageRatio;
    } else {
      drawWidth = crop.width;
      drawHeight = crop.width / imageRatio;
    }

    drawWidth *= scale;
    drawHeight *= scale;

    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight,
    );

    ctx.restore();
  }

  function handleFiles(files: File[]) {
    const selected = files[0];

    if (!selected) {
      return;
    }

    if (!selected.type.startsWith("image/")) {
      return;
    }

    setFile(selected);
    setZoom("100");
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  }

  function rotate() {
    setRotation((current) => (current + 90) % 360);
  }

  function downloadImage() {
    const canvas = canvasRef.current;

    if (!canvas) {
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
        link.download = `nfmx-cropped-image.${extension}`;
        link.click();

        URL.revokeObjectURL(url);
      },
      mime,
      imageQuality,
    );
  }

  function reset() {
    setFile(null);
    setAspectRatio("free");
    setZoom("100");
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setFormat("png");
    setQuality("92");
  }

  const crop = getCropSize();

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

          <Field label="Aspect ratio">
            <Select
              value={aspectRatio}
              onChange={(event) =>
                setAspectRatio(
                  event.target.value as AspectRatio,
                )
              }
            >
              {Object.entries(aspectRatios).map(
                ([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ),
              )}
            </Select>
          </Field>

          <Field label="Zoom (%)">
            <TextInput
              type="number"
              min="20"
              max="300"
              value={zoom}
              onChange={(event) =>
                setZoom(event.target.value)
              }
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <SecondaryButton onClick={rotate}>
              <RotateCw className="mr-2 h-4 w-4" />
              Rotate 90°
            </SecondaryButton>

            <SecondaryButton
              onClick={() =>
                setFlipHorizontal((current) => !current)
              }
            >
              <FlipHorizontal className="mr-2 h-4 w-4" />
              Flip H
            </SecondaryButton>
          </div>

          <SecondaryButton
            onClick={() =>
              setFlipVertical((current) => !current)
            }
          >
            <FlipVertical className="mr-2 h-4 w-4" />
            Flip Vertical
          </SecondaryButton>

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
              Reset
            </SecondaryButton>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            Your image is processed locally in your browser.
            NFMX does not upload your image to a server.
          </div>
        </div>

        <ResultPanel>
          <div className="flex min-h-[500px] items-center justify-center overflow-auto rounded-2xl border border-[var(--border)] bg-black/20 p-5">
            <div className="w-full max-w-3xl">
              {isReady ? (
                <>
                  <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Crop preview</span>
                    <span>
                      {crop.width} × {crop.height}
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
                    Upload an image to start cropping.
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