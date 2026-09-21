"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import {
  Dropzone,
  PrimaryButton,
  SecondaryButton,
  Workspace,
} from "./shared";

export function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  function selectFile(files: File[]) {
    const selected = files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setFile(selected);
    setResultUrl("");
    setError("");
    setProgress(0);
  }

  async function processImage() {
    if (!file) return;

    setProcessing(true);
    setError("");
    setProgress(0);

    try {
      const blob = await removeBackground(file, {
        progress: (_key, current, total) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setProgress(100);
    } catch {
      setError(
        "Background removal failed. Try another image or check your internet connection.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setFile(null);
    setResultUrl("");
    setError("");
    setProgress(0);
    setProcessing(false);
  }

  return (
    <Workspace>
      {!file && (
        <Dropzone
          accept="image/png,image/jpeg,image/webp"
          onFiles={selectFile}
          hint="PNG, JPG, or WebP"
        />
      )}

      {file && !resultUrl && (
        <div className="space-y-4">
          <div className="rounded-[8px] border border-border p-4">
            <p className="text-sm font-medium text-ink">{file.name}</p>

            <p className="mt-1 text-xs text-ink-faint">
              Background will be removed locally in your browser.
            </p>
          </div>

          {processing && (
            <div className="rounded-[8px] border border-border bg-paper-raised p-4">
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Loader2 size={16} className="animate-spin" />
                Removing background…
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-ink transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-ink-faint">
                {progress}% complete
              </p>
            </div>
          )}

          {error && <p className="text-sm text-ink-muted">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <PrimaryButton
              onClick={() => void processImage()}
              disabled={processing}
            >
              {processing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Processing…
                </span>
              ) : (
                "Remove background"
              )}
            </PrimaryButton>

            <SecondaryButton onClick={reset} disabled={processing}>
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={15} />
                Choose another
              </span>
            </SecondaryButton>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="space-y-4">
          <div className="rounded-[8px] border border-border bg-paper-raised p-4">
            <p className="text-sm font-medium text-ink">
              Background removed
            </p>

            <p className="mt-1 text-xs text-ink-faint">
              Your image is ready as a transparent PNG.
            </p>
          </div>

          <div className="flex items-center justify-center overflow-hidden rounded-[8px] border border-border bg-paper p-4">
            <Image
              src={resultUrl}
              alt="Image with background removed"
              width={1200}
              height={1200}
              unoptimized
              className="max-h-[500px] max-w-full object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={resultUrl}
              download={`${file?.name.replace(/\.[^/.]+$/, "") || "image"}-no-background.png`}
              className="inline-flex items-center gap-2 rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              <Download size={15} />
              Download PNG
            </a>

            <SecondaryButton onClick={reset}>
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={15} />
                Remove another
              </span>
            </SecondaryButton>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        The background-removal model may need to download the first time you
        use this tool.
      </p>
    </Workspace>
  );
}