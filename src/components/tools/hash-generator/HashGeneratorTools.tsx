"use client";

import { useState } from "react";
import {
  Check,
  Clipboard,
  File,
  Hash,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
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

type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

async function digestText(
  value: string,
  algorithm: HashAlgorithm,
) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest(algorithm, data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function digestFile(
  file: File,
  algorithm: HashAlgorithm,
) {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest(algorithm, buffer);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorTools() {
  const [algorithm, setAlgorithm] =
    useState<HashAlgorithm>("SHA-256");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generateHash() {
    setError("");
    setHash("");
    setCopied(false);

    if (!text.trim() && !file) {
      setError("Enter text or choose a file to generate a hash.");
      return;
    }

    setLoading(true);

    try {
      const result = file
        ? await digestFile(file, algorithm)
        : await digestText(text, algorithm);

      setHash(result);
    } catch {
      setError("Could not generate the hash.");
    } finally {
      setLoading(false);
    }
  }

  async function copyHash() {
    if (!hash) return;

    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Could not copy the hash.");
    }
  }

  function reset() {
    setText("");
    setFile(null);
    setHash("");
    setError("");
    setCopied(false);
  }

  return (
    <Workspace>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Hash className="h-9 w-9" />
              </div>

              <h2 className="text-2xl font-semibold text-ink">
                Hash Generator
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                Generate SHA-256, SHA-384, or SHA-512 hashes from
                text or files directly in your browser.
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              <Field label="Hash Algorithm">
                <Select
                  value={algorithm}
                  onChange={(event) =>
                    setAlgorithm(
                      event.target.value as HashAlgorithm,
                    )
                  }
                >
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-384">SHA-384</option>
                  <option value="SHA-512">SHA-512</option>
                </Select>
              </Field>

              <Field label="Text">
                <TextInput
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                    setFile(null);
                    setHash("");
                    setError("");
                  }}
                  placeholder="Enter text to hash..."
                />
              </Field>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-ink">
                  File
                </div>

                {file ? (
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <File className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {file.size.toLocaleString()} bytes
                        </p>
                      </div>
                    </div>

                    <SecondaryButton
                      onClick={() => {
                        setFile(null);
                        setHash("");
                        setError("");
                      }}
                    >
                      Remove
                    </SecondaryButton>
                  </div>
                ) : (
                  <Dropzone
                    accept="*/*"
                    hint="Drop a file here, or click to browse"
                    onFiles={(files) => {
                      const selectedFile = files[0];

                      if (selectedFile) {
                        setFile(selectedFile);
                        setText("");
                        setHash("");
                        setError("");
                      }
                    }}
                  />
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <PrimaryButton
                  onClick={generateHash}
                  disabled={loading}
                >
                  <Hash className="h-4 w-4" />
                  {loading ? "Generating..." : "Generate Hash"}
                </PrimaryButton>

                {(text || file || hash || error) && (
                  <SecondaryButton
                    onClick={reset}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </SecondaryButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {hash && (
          <ResultPanel>
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-ink">
                    Generated Hash
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {algorithm}
                    {file
                      ? ` • ${file.name}`
                      : " • Text input"}
                  </p>
                </div>

                <SecondaryButton onClick={copyHash}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy Hash"}
                </SecondaryButton>
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-background/70 p-5">
                <code className="break-all font-mono text-sm leading-7 text-ink">
                  {hash}
                </code>
              </div>
            </div>
          </ResultPanel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="SHA-256"
            text="A widely used 256-bit cryptographic hash."
          />

          <InfoCard
            title="SHA-384"
            text="A 384-bit SHA-2 hash with a longer output."
          />

          <InfoCard
            title="SHA-512"
            text="A 512-bit SHA-2 hash for stronger digest output."
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-6 text-muted">
            Hashing happens locally in your browser. Your text and
            files are not uploaded to NFMX.
          </p>
        </div>
      </div>
    </Workspace>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        {text}
      </p>
    </div>
  );
}