"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Dropzone, Workspace, Field, Select, PrimaryButton, SecondaryButton, formatBytes } from "./shared";
import { loadImage, canvasToBlob, downloadBlob, stripExtension } from "@/lib/image";

const formats: Record<string, { label: string; mime: string; ext: string }> = {
  jpeg: { label: "JPG", mime: "image/jpeg", ext: "jpg" },
  png: { label: "PNG", mime: "image/png", ext: "png" },
  webp: { label: "WebP", mime: "image/webp", ext: "webp" },
};

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("webp");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert(targetFile: File, formatKey: string) {
    setBusy(true);
    setError(null);
    try {
      const img = await loadImage(targetFile);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, formats[formatKey].mime, 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong converting this image.");
    } finally {
      setBusy(false);
    }
  }

  function handleFiles(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    convert(f, target);
  }

  function handleFormatChange(formatKey: string) {
    setTarget(formatKey);
    if (file) convert(file, formatKey);
  }

  return (
    <Workspace>
      <Dropzone accept="image/*" onFiles={handleFiles} hint="PNG, JPG or WebP — up to ~20 MB" />

      <div className="mt-5 max-w-xs">
        <Field label="Convert to">
          <Select value={target} onChange={(e) => handleFormatChange(e.target.value)}>
            {Object.entries(formats).map(([key, f]) => (
              <option key={key} value={key}>
                {f.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-ink-muted">{error}</p>}
      {busy && <p className="mt-4 text-sm text-ink-muted">Converting…</p>}

      {result && file && (
        <div className="mt-5 rounded-[8px] border border-border bg-brass-tint/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Converted preview"
              className="h-24 w-24 shrink-0 rounded-[6px] border border-border object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-ink">
                Converted to <span className="font-medium">{formats[target].label}</span> —{" "}
                {formatBytes(result.blob.size)}
              </p>
              <div className="mt-3 flex gap-3">
                <PrimaryButton
                  onClick={() =>
                    downloadBlob(result.blob, `${stripExtension(file.name)}.${formats[target].ext}`)
                  }
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
    </Workspace>
  );
}
