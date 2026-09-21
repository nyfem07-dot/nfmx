"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";
import { Dropzone, Workspace, PrimaryButton, SecondaryButton, formatBytes } from "./shared";
import { downloadBlob, stripExtension } from "@/lib/image";

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    const f = files.find((f) => f.type === "application/pdf");
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    await compress(f);
  }

  async function compress(target: File) {
    setBusy(true);
    setError(null);
    try {
      const bytes = await target.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const out = await doc.save({ useObjectStreams: true });
      setResult(new Blob([out as BlobPart], { type: "application/pdf" }));
    } catch {
      setError("Couldn't compress this PDF — make sure it isn't password protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace>
      <Dropzone accept="application/pdf" onFiles={handleFiles} hint="One PDF file" />

      {busy && <p className="mt-4 text-sm text-ink-muted">Compressing…</p>}
      {error && <p className="mt-4 text-sm text-ink-muted">{error}</p>}

      {result && file && (
        <div className="mt-5 rounded-[8px] border border-border bg-brass-tint/40 p-4">
          <p className="text-sm text-ink">
            {formatBytes(file.size)} → <span className="font-medium">{formatBytes(result.size)}</span>{" "}
            {result.size < file.size ? (
              <span className="text-ink-muted">
                ({Math.round((1 - result.size / file.size) * 100)}% smaller)
              </span>
            ) : (
              <span className="text-ink-muted">(already well optimized)</span>
            )}
          </p>
          <div className="mt-3 flex gap-3">
            <PrimaryButton
              onClick={() => downloadBlob(result, `${stripExtension(file.name)}-compressed.pdf`)}
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
      )}
    </Workspace>
  );
}
