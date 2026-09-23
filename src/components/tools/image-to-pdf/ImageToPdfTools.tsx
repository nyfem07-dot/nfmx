"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, GripVertical, Trash2, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
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

type PageSize = "a4" | "letter" | "a5" | "fit";

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

const pageSizes: Record<
  PageSize,
  { label: string; width: number; height: number }
> = {
  a4: {
    label: "A4",
    width: 595.28,
    height: 841.89,
  },
  letter: {
    label: "Letter",
    width: 612,
    height: 792,
  },
  a5: {
    label: "A5",
    width: 419.53,
    height: 595.28,
  },
  fit: {
    label: "Fit to Image",
    width: 0,
    height: 0,
  },
};

export default function ImageToPdfTools() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] =
    useState<PageSize>("a4");
  const [orientation, setOrientation] =
    useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState("24");
  const [quality, setQuality] = useState("85");
  const [isGenerating, setIsGenerating] = useState(false);

  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      images.forEach((image) =>
        URL.revokeObjectURL(image.url),
      );
    };
  }, [images]);

  const totalSize = useMemo(
    () =>
      images.reduce(
        (total, image) => total + image.file.size,
        0,
      ),
    [images],
  );

  function handleFiles(files: File[]) {
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!validFiles.length) {
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((current) => {
      const target = current.find(
        (image) => image.id === id,
      );

      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  function moveImage(from: number, to: number) {
    if (
      from < 0 ||
      to < 0 ||
      from >= images.length ||
      to >= images.length
    ) {
      return;
    }

    setImages((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);

      if (!moved) {
        return current;
      }

      next.splice(to, 0, moved);

      return next;
    });
  }

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;

    dragIndexRef.current = null;

    if (from === null || from === index) {
      return;
    }

    moveImage(from, index);
  }

  function reset() {
    images.forEach((image) =>
      URL.revokeObjectURL(image.url),
    );

    setImages([]);
    setPageSize("a4");
    setOrientation("portrait");
    setMargin("24");
    setQuality("85");
  }

  function loadImage(file: File) {
    return new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(
            new Error(`Could not read ${file.name}`),
          );
        };

        image.src = url;
      },
    );
  }

  function getPageDimensions(
    image: HTMLImageElement,
  ) {
    if (pageSize === "fit") {
      const maxDimension = 595;

      const scale = Math.min(
        maxDimension / image.width,
        maxDimension / image.height,
        1,
      );

      return {
        width: Math.max(
          1,
          Math.round(image.width * scale),
        ),
        height: Math.max(
          1,
          Math.round(image.height * scale),
        ),
      };
    }

    const base = pageSizes[pageSize];

    if (orientation === "landscape") {
      return {
        width: base.height,
        height: base.width,
      };
    }

    return {
      width: base.width,
      height: base.height,
    };
  }

  async function imageToJpegBytes(
    image: HTMLImageElement,
  ) {
    const canvas = document.createElement("canvas");

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create image canvas.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const blob = await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          "image/jpeg",
          Math.min(
            Math.max(Number(quality) / 100, 0.1),
            1,
          ),
        ),
    );

    if (!blob) {
      throw new Error("Could not convert image.");
    }

    return new Uint8Array(
      await blob.arrayBuffer(),
    );
  }

  async function generatePdf() {
    if (!images.length || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = await PDFDocument.create();
      const padding = Math.max(
        0,
        Math.min(Number(margin) || 24, 120),
      );

      for (const item of images) {
        const image = await loadImage(item.file);

        const dimensions =
          getPageDimensions(image);

        const page = pdf.addPage([
          dimensions.width,
          dimensions.height,
        ]);

        const availableWidth = Math.max(
          1,
          dimensions.width - padding * 2,
        );

        const availableHeight = Math.max(
          1,
          dimensions.height - padding * 2,
        );

        const imageRatio =
          image.naturalWidth / image.naturalHeight;

        const availableRatio =
          availableWidth / availableHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imageRatio > availableRatio) {
          drawWidth = availableWidth;
          drawHeight =
            availableWidth / imageRatio;
        } else {
          drawHeight = availableHeight;
          drawWidth =
            availableHeight * imageRatio;
        }

        const x =
          (dimensions.width - drawWidth) / 2;

        const y =
          (dimensions.height - drawHeight) / 2;

        const jpegBytes =
          await imageToJpegBytes(image);

        const embeddedImage =
          await pdf.embedJpg(jpegBytes);

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const bytes = await pdf.save();

      const arrayBuffer = new ArrayBuffer(
        bytes.byteLength,
      );

      new Uint8Array(arrayBuffer).set(bytes);

      const blob = new Blob(
        [arrayBuffer],
        { type: "application/pdf" },
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "nfmx-images.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image to PDF error:", error);
      window.alert(
        "Could not create the PDF. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Workspace>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Field label="Images">
            <Dropzone
              accept="image/*"
              hint="Drop images here, or click to browse"
              onFiles={handleFiles}
            />
          </Field>

          <Field label="Page size">
            <Select
              value={pageSize}
              onChange={(event) =>
                setPageSize(
                  event.target.value as PageSize,
                )
              }
            >
              {Object.entries(pageSizes).map(
                ([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ),
              )}
            </Select>
          </Field>

          {pageSize !== "fit" && (
            <Field label="Orientation">
              <Select
                value={orientation}
                onChange={(event) =>
                  setOrientation(
                    event.target.value as
                      | "portrait"
                      | "landscape",
                  )
                }
              >
                <option value="portrait">
                  Portrait
                </option>
                <option value="landscape">
                  Landscape
                </option>
              </Select>
            </Field>
          )}

          <Field label="Margin (PDF points)">
            <TextInput
              type="number"
              min="0"
              max="120"
              value={margin}
              onChange={(event) =>
                setMargin(event.target.value)
              }
            />
          </Field>

          <Field label="Image quality (%)">
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

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={generatePdf}
              disabled={
                images.length === 0 || isGenerating
              }
            >
              <Download className="mr-2 h-4 w-4" />
              {isGenerating
                ? "Creating PDF..."
                : "Download PDF"}
            </PrimaryButton>

            <SecondaryButton
              onClick={reset}
              disabled={isGenerating}
            >
              Reset
            </SecondaryButton>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            Images are processed locally in your browser.
            NFMX does not upload your images.
          </div>
        </div>

        <ResultPanel>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">
                  PDF pages
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {images.length}{" "}
                  {images.length === 1
                    ? "image"
                    : "images"}{" "}
                  ·{" "}
                  {(totalSize / 1024 / 1024).toFixed(
                    2,
                  )}{" "}
                  MB
                </p>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() =>
                      handleDragStart(index)
                    }
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={() =>
                      handleDrop(index)
                    }
                    className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                      <img
                        src={image.url}
                        alt={image.file.name}
                        className="h-full w-full object-contain"
                      />

                      <div className="absolute left-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white">
                        Page {index + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(image.id)
                        }
                        className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 p-3">
                      <GripVertical className="h-4 w-4 shrink-0 text-[var(--muted)]" />

                      <div className="min-w-0">
                        <p className="truncate text-sm text-[var(--foreground)]">
                          {image.file.name}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {(
                            image.file.size /
                            1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-center text-sm text-[var(--muted)]">
                <div>
                  <Upload className="mx-auto mb-3 h-8 w-8" />
                  <p>
                    Add images to build your PDF.
                  </p>
                  <p className="mt-1">
                    Drag pages to change their order.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResultPanel>
      </div>
    </Workspace>
  );
}