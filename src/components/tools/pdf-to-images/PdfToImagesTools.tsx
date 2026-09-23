"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";
import {
  Download,
  FileImage,
  FileText,
  Loader2,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  Dropzone,
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  Select,
  Workspace,
} from "../shared";

type OutputFormat = "png" | "jpg";

type PageImage = {
  pageNumber: number;
  blob: Blob;
  url: string;
};

const MAX_PAGES = 100;

export default function PdfToImagesTools() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState("90");
  const [scale, setScale] = useState("1.5");
  const [selectedPages, setSelectedPages] = useState("");
  const [images, setImages] = useState<PageImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const outputMime = format === "png" ? "image/png" : "image/jpeg";

  const pageSelection = useMemo(() => {
    if (!selectedPages.trim()) {
      return null;
    }

    const values = new Set<number>();

    for (const part of selectedPages.split(",")) {
      const trimmed = part.trim();

      if (!trimmed) {
        continue;
      }

      if (trimmed.includes("-")) {
        const [startText, endText] = trimmed
          .split("-")
          .map((value) => value.trim());

        const start = Number(startText);
        const end = Number(endText);

        if (
          Number.isInteger(start) &&
          Number.isInteger(end) &&
          start > 0 &&
          end >= start
        ) {
          for (let page = start; page <= end; page += 1) {
            values.add(page);
          }
        }
      } else {
        const page = Number(trimmed);

        if (Number.isInteger(page) && page > 0) {
          values.add(page);
        }
      }
    }

    return values.size > 0 ? values : null;
  }, [selectedPages]);

  function clearImages() {
    setImages((current) => {
      for (const image of current) {
        URL.revokeObjectURL(image.url);
      }

      return [];
    });
  }

  function reset() {
    clearImages();
    setFile(null);
    setFormat("png");
    setQuality("90");
    setScale("1.5");
    setSelectedPages("");
    setProgress(0);
    setError("");
  }

  function handleFiles(files: File[]) {
    const selectedFile = files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    clearImages();
    setFile(selectedFile);
    setProgress(0);
    setError("");
  }

  async function convertPdf() {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setError("");
    clearImages();

    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
      });

      const pdf = await loadingTask.promise;

      if (pdf.numPages > MAX_PAGES) {
        throw new Error(
          `This PDF contains ${pdf.numPages} pages. NFMX currently supports up to ${MAX_PAGES} pages per conversion.`,
        );
      }

      const pagesToRender: number[] = [];

      for (let page = 1; page <= pdf.numPages; page += 1) {
        if (!pageSelection || pageSelection.has(page)) {
          pagesToRender.push(page);
        }
      }

      if (pagesToRender.length === 0) {
        throw new Error(
          "No valid pages were selected. Use values such as 1, 3, 5-7.",
        );
      }

      const generated: PageImage[] = [];

      for (let index = 0; index < pagesToRender.length; index += 1) {
        const pageNumber = pagesToRender[index];

        if (!pageNumber) {
          continue;
        }

        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: Number(scale),
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Could not create a canvas for PDF rendering.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        if (format === "jpg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            resolve,
            outputMime,
            format === "jpg"
              ? Math.min(Math.max(Number(quality) / 100, 0.1), 1)
              : undefined,
          );
        });

        if (!blob) {
          throw new Error(
            `Could not create an image for page ${pageNumber}.`,
          );
        }

        generated.push({
          pageNumber,
          blob,
          url: URL.createObjectURL(blob),
        });

        setProgress(
          Math.round(((index + 1) / pagesToRender.length) * 100),
        );

        page.cleanup();
      }

      setImages(generated);
    } catch (conversionError) {
      console.error("PDF to images error:", conversionError);

      setError(
        conversionError instanceof Error
          ? conversionError.message
          : "Something went wrong while converting the PDF.",
      );
    } finally {
      setIsConverting(false);
    }
  }

  function downloadImage(image: PageImage) {
    const link = document.createElement("a");

    link.href = image.url;
    link.download = `nfmx-page-${image.pageNumber}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function downloadZip() {
    if (images.length === 0) {
      return;
    }

    const zip = new JSZip();

    for (const image of images) {
      zip.file(
        `nfmx-page-${image.pageNumber}.${format}`,
        image.blob,
      );
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nfmx-pdf-images.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            PDF to Images
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Convert PDF pages into high-quality PNG or JPG images.
          </p>
        </div>

        <Dropzone
          accept="application/pdf,.pdf"
          hint="Drop a PDF here, or click to browse"
          onFiles={handleFiles}
        />

        {file && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <FileText size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {file.name}
                </p>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <SecondaryButton onClick={reset}>
                <Trash2 size={16} />
                Remove
              </SecondaryButton>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Output format">
            <Select
              value={format}
              onChange={(event) =>
                setFormat(event.target.value as OutputFormat)
              }
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </Select>
          </Field>

          <Field label="Render scale">
            <Select
              value={scale}
              onChange={(event) => setScale(event.target.value)}
            >
              <option value="1">1× — Smaller</option>
              <option value="1.5">1.5× — Recommended</option>
              <option value="2">2× — High quality</option>
              <option value="2.5">2.5× — Very high quality</option>
            </Select>
          </Field>
        </div>

        {format === "jpg" && (
          <Field label="JPG quality">
            <Select
              value={quality}
              onChange={(event) => setQuality(event.target.value)}
            >
              <option value="70">70%</option>
              <option value="80">80%</option>
              <option value="90">90%</option>
              <option value="100">100%</option>
            </Select>
          </Field>
        )}

        <Field label="Pages to convert">
          <input
            value={selectedPages}
            onChange={(event) => setSelectedPages(event.target.value)}
            placeholder="Leave empty for all pages, or enter 1, 3, 5-7"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/20"
          />
        </Field>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {isConverting && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Converting PDF...
              </div>

              <span className="text-sm font-medium text-white">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PrimaryButton
            onClick={convertPdf}
            disabled={!file || isConverting}
          >
            {isConverting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileImage size={17} />
                Convert PDF
              </>
            )}
          </PrimaryButton>

          {images.length > 0 && (
            <SecondaryButton onClick={downloadZip}>
              <Download size={17} />
              Download ZIP
            </SecondaryButton>
          )}

          <SecondaryButton
            onClick={reset}
            disabled={isConverting}
          >
            <RefreshCcw size={17} />
            Reset
          </SecondaryButton>
        </div>

        {images.length > 0 && (
          <ResultPanel>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white">
                  Converted Pages
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {images.length}{" "}
                  {images.length === 1 ? "page" : "pages"} converted
                  successfully.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <div
                    key={image.pageNumber}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-slate-950">
                      <img
                        src={image.url}
                        alt={`PDF page ${image.pageNumber}`}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3">
                      <div>
                        <p className="text-sm font-medium text-white">
                          Page {image.pageNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(image.blob.size / 1024).toFixed(0)} KB
                        </p>
                      </div>

                      <SecondaryButton
                        onClick={() => downloadImage(image)}
                      >
                        <Download size={15} />
                        Download
                      </SecondaryButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
          <p className="text-sm text-slate-300">
            <span className="font-medium text-emerald-300">
              Privacy:
            </span>{" "}
            PDF processing happens in your browser. Your PDF is not
            uploaded to an NFMX server.
          </p>
        </div>
      </div>
    </Workspace>
  );
}