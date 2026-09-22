"use client";

import { useState } from "react";
import {
  CheckCircle2,
  File,
  FileImage,
  FileText,
  HardDrive,
  Info,
} from "lucide-react";
import {
  Dropzone,
  ResultPanel,
  SecondaryButton,
  Workspace,
  formatBytes,
} from "../shared";

type FileDetails = {
  name: string;
  extension: string;
  type: string;
  size: number;
  lastModified: string;
};

function getExtension(fileName: string) {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "None";
  }

  return parts.pop()?.toUpperCase() || "None";
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return FileImage;
  }

  if (type.startsWith("text/") || type.includes("json")) {
    return FileText;
  }

  return File;
}

export default function FileInspectorTools() {
  const [file, setFile] = useState<File | null>(null);

  const details: FileDetails | null = file
    ? {
        name: file.name,
        extension: getExtension(file.name),
        type: file.type || "Unknown",
        size: file.size,
        lastModified: new Date(file.lastModified).toLocaleString(),
      }
    : null;

  const Icon = details ? getFileIcon(details.type) : File;

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Info className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold text-ink">
                File Inspector
              </h2>

              <p className="mt-2 max-w-lg text-sm text-muted">
                Inspect a file and view its basic metadata without uploading
                it anywhere.
              </p>
            </div>

            <div className="mt-8">
              <Dropzone
  accept="*/*"
  hint="Drop any file here, or click to browse"
  onFiles={(files) => {
                  const selectedFile = files[0];

                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {details && (
          <ResultPanel>
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-ink">
                      {details.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      File information
                    </p>
                  </div>
                </div>

                <SecondaryButton onClick={() => setFile(null)}>
                  <HardDrive className="h-4 w-4" />
                  Inspect Another
                </SecondaryButton>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="File Name"
                  value={details.name}
                />

                <InfoCard
                  label="Extension"
                  value={details.extension}
                />

                <InfoCard
                  label="File Type"
                  value={details.type}
                />

                <InfoCard
                  label="File Size"
                  value={formatBytes(details.size)}
                />

                <InfoCard
                  label="Size in Bytes"
                  value={details.size.toLocaleString()}
                />

                <InfoCard
                  label="Last Modified"
                  value={details.lastModified}
                />
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />

                <span>
                  This file was inspected locally in your browser.
                  It was not uploaded to a server.
                </span>
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            label="File Type"
            value="The MIME type reported by your browser."
          />

          <InfoCard
            label="File Size"
            value="The amount of storage space occupied by the file."
          />

          <InfoCard
            label="Privacy"
            value="Your file stays in your browser during inspection."
          />
        </div>
      </div>
    </Workspace>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="text-sm text-muted">{label}</div>

      <p className="mt-3 break-words text-sm leading-6 text-ink">
        {value}
      </p>
    </div>
  );
}