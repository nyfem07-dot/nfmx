"use client";

import { UploadCloud, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

export function Workspace({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] border border-border bg-paper-raised p-5 sm:p-6">
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-[6px] border border-border-strong px-4 py-2 text-sm text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={`rounded-[6px] border border-border-strong bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink ${
        props.className ?? ""
      }`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={`rounded-[6px] border border-border-strong bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink ${
        props.className ?? ""
      }`}
    />
  );
}

export function ResultPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-[8px] border border-border bg-brass-tint/40 p-4">
      {children}
    </div>
  );
}

interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint: string;
  files?: File[];
  onRemove?: (index: number) => void;
}

export function Dropzone({
  accept,
  multiple,
  onFiles,
  hint,
  files = [],
  onRemove,
}: DropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    onFiles(Array.from(fileList));
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed px-6 py-10 text-center transition-colors ${
          dragOver
            ? "border-brass bg-brass-tint/50"
            : "border-border-strong hover:border-ink"
        }`}
      >
        <UploadCloud
          className="h-6 w-6 text-ink-faint"
          strokeWidth={1.5}
        />

        <p className="text-sm text-ink">
          <span className="font-medium">Click to upload</span> or drag and
          drop
        </p>

        <p className="text-xs text-ink-faint">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-[6px] border border-border px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate text-ink">
                {file.name}
              </span>

              <span className="flex shrink-0 items-center gap-3">
                <span className="font-data text-xs text-ink-faint">
                  {formatBytes(file.size)}
                </span>

                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    aria-label={`Remove ${file.name}`}
                    className="text-ink-faint hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / Math.pow(1024, i);

  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
}