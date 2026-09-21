"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  Dropzone,
  Workspace,
  Field,
  TextInput,
  PrimaryButton,
  SecondaryButton,
  formatBytes,
} from "./shared";
import { loadImage, canvasToBlob, downloadBlob, stripExtension } from "@/lib/image";

export function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setResult(null);
    setError(null);
    try {
      const img = await loadImage(f);
      setFile(f);
      setOriginal({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read this image.");
    }
  }

  function onWidthChange(v: number) {
    setWidth(v);
    if (lockRatio && original) {
      setHeight(Math.round((v / original.w) * original.h));
    }
  }

  function onHeightChange(v: number) {
    setHeight(v);
    if (lockRatio && original) {
      setWidth(Math.round((v / original.h) * original.w));
    }
  }

  async function resize() {
    if (!file || !width || !height) return;
    setBusy(true);
    setError(null);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      const blob = await canvasToBlob(canvas, file.type || "image/png", 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong resizing this image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace>
      <Dropzone accept="image/*" onFiles={handleFiles} hint="PNG, JPG or WebP — up to ~20 MB" />

      {original && (
        <div className="mt-5">
          <p className="text-xs text-ink-faint">
            Original size: {original.w} × {original.h}px
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:max-w-sm">
            <Field label="Width (px)">
              <TextInput
                type="number"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
              />
            </Field>
            <Field label="Height (px)">
              <TextInput
                type="number"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
              />
            </Field>
          </div>
          <label className="mt-3 flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="h-4 w-4 accent-brass"
            />
            <span className="text-ink-muted">Lock aspect ratio</span>
          </label>
          <div className="mt-4">
            <PrimaryButton onClick={resize} disabled={busy}>
              {busy ? "Resizing…" : "Resize image"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-ink-muted">{error}</p>}

      {result && file && (
        <div className="mt-5 rounded-[8px] border border-border bg-brass-tint/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Resized preview"
              className="h-24 w-24 shrink-0 rounded-[6px] border border-border object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-ink">
                Now {width} × {height}px — {formatBytes(result.blob.size)}
              </p>
              <div className="mt-3 flex gap-3">
                <PrimaryButton
                  onClick={() => downloadBlob(result.blob, `${stripExtension(file.name)}-resized.png`)}
                >
                  <span className="flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Download
                  </span>
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setFile(null);
                    setOriginal(null);
                    setResult(null);
                  }}
                >
                  Start over
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </Workspace>
  );
}
