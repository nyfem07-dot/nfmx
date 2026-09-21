"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, GripVertical } from "lucide-react";
import { Dropzone, Workspace, PrimaryButton, SecondaryButton, formatBytes } from "./shared";
import { downloadBlob } from "@/lib/image";

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function addFiles(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles.filter((f) => f.type === "application/pdf")]);
    setError(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function reorder(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      downloadBlob(new Blob([out as BlobPart], { type: "application/pdf" }), "merged.pdf");
    } catch {
      setError("Couldn't merge these files — make sure each one is a valid PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace>
      <Dropzone
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        hint="Add two or more PDF files"
      />

      {files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              className="flex items-center gap-3 rounded-[6px] border border-border bg-paper px-3 py-2 text-sm"
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink-faint" strokeWidth={1.75} />
              <span className="font-data w-5 shrink-0 text-xs text-ink-faint">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-ink">{file.name}</span>
              <span className="shrink-0 font-data text-xs text-ink-faint">{formatBytes(file.size)}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="shrink-0 text-xs text-ink-faint hover:text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-ink-faint">Drag rows to reorder before merging.</p>

      {error && <p className="mt-3 text-sm text-ink-muted">{error}</p>}

      <div className="mt-5 flex gap-3">
        <PrimaryButton onClick={merge} disabled={files.length < 2 || busy}>
          <span className="flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            {busy ? "Merging…" : "Merge & download"}
          </span>
        </PrimaryButton>
        {files.length > 0 && (
          <SecondaryButton onClick={() => setFiles([])}>Clear all</SecondaryButton>
        )}
      </div>
    </Workspace>
  );
}
