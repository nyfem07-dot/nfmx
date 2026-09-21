"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";
import { Dropzone, Workspace, Field, TextInput, PrimaryButton, SecondaryButton } from "./shared";
import { downloadBlob, stripExtension } from "@/lib/image";

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    const f = files.find((f) => f.type === "application/pdf");
    if (!f) return;
    setError(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
      setRange(`1-${doc.getPageCount()}`);
    } catch {
      setError("Couldn't open this PDF.");
    }
  }

  function parseRange(text: string, max: number): number[] {
    const pages = new Set<number>();
    for (const part of text.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes("-")) {
        const [a, b] = trimmed.split("-").map((n) => parseInt(n.trim(), 10));
        if (Number.isFinite(a) && Number.isFinite(b)) {
          for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
            if (i >= 1 && i <= max) pages.add(i);
          }
        }
      } else {
        const n = parseInt(trimmed, 10);
        if (Number.isFinite(n) && n >= 1 && n <= max) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function extract() {
    if (!file || !pageCount) return;
    setBusy(true);
    setError(null);
    try {
      const pages = parseRange(range, pageCount);
      if (pages.length === 0) {
        setError(`Enter page numbers between 1 and ${pageCount}, e.g. 1-3, 5.`);
        setBusy(false);
        return;
      }
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const result = await out.save();
      downloadBlob(
        new Blob([result as BlobPart], { type: "application/pdf" }),
        `${stripExtension(file.name)}-pages.pdf`
      );
    } catch {
      setError("Something went wrong splitting this PDF.");
    } finally {
      setBusy(false);
    }
  }

  async function splitEvery() {
    if (!file || !pageCount) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      for (let i = 0; i < pageCount; i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const result = await out.save();
        downloadBlob(
          new Blob([result as BlobPart], { type: "application/pdf" }),
          `${stripExtension(file.name)}-page-${i + 1}.pdf`
        );
      }
    } catch {
      setError("Something went wrong splitting this PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace>
      <Dropzone accept="application/pdf" onFiles={handleFiles} hint="One PDF file" />

      {pageCount && file && (
        <div className="mt-5">
          <p className="text-xs text-ink-faint">{file.name} — {pageCount} pages</p>

          <div className="mt-3 max-w-xs">
            <Field label="Pages to extract">
              <TextInput
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-3, 5"
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton onClick={extract} disabled={busy}>
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                Extract pages
              </span>
            </PrimaryButton>
            <SecondaryButton onClick={splitEvery} disabled={busy}>
              Split every page into its own file
            </SecondaryButton>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-ink-muted">{error}</p>}
    </Workspace>
  );
}
