"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Dropzone, Workspace, PrimaryButton, SecondaryButton, formatBytes } from "./shared";
import { loadImage, canvasToBlob, downloadBlob, stripExtension } from "@/lib/image";

export function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function compress(targetFile: File, q: number) {
    setBusy(true);
    setError(null);
    try {
      const img = await loadImage(targetFile);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const type = targetFile.type === "image/png" ? "image/jpeg" : targetFile.type || "image/jpeg";
      const blob = await canvasToBlob(canvas, type, q / 100);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong compressing this image.");
    } finally {
      setBusy(false);
    }
  }

  function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    compress(f, quality);
  }

  function handleQualityChange(q: number) {
    setQuality(q);
    if (file) compress(file, q);
  }

  return (
    <Workspace>
      <Dropzone accept="image/*" onFiles={handleFiles} hint="PNG, JPG or WebP — up to ~20 MB" />

      {file && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Quality</span>
            <span className="font-data text-xs text-ink">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={95}
            value={quality}
            onChange={(e) => handleQualityChange(Number(e.target.value))}
            className="mt-2 w-full accent-brass"
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-ink-muted">{error}</p>}

      {result && file && (
        <div className="mt-5 rounded-[8px] border border-border bg-brass-tint/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Compressed preview"
              className="h-24 w-24 shrink-0 rounded-[6px] border border-border object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-ink">
                {formatBytes(file.size)} → <span className="font-medium">{formatBytes(result.blob.size)}</span>{" "}
                <span className="text-ink-muted">
                  ({Math.max(0, Math.round((1 - result.blob.size / file.size) * 100))}% smaller)
                </span>
              </p>
              <div className="mt-3 flex gap-3">
                <PrimaryButton
                  onClick={() => downloadBlob(result.blob, `${stripExtension(file.name)}-compressed.jpg`)}
                >
                  <span className="flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Download
                  </span>
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setFile(null);
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

      {busy && <p className="mt-4 text-sm text-ink-muted">Compressing…</p>}
    </Workspace>
  );
}
