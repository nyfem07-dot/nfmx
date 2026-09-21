"use client";

import { useRef, useState } from "react";
import { AudioLines, Download, Loader2, Upload } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  PrimaryButton,
  ResultPanel,
  Workspace,
} from "@/components/tools/shared";

type OutputFormat = "mp3" | "wav" | "ogg" | "m4a";

export function AudioConverterTools() {
  const inputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("mp3");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function loadFFmpeg() {
    if (ffmpegRef.current) {
      return ffmpegRef.current;
    }

    const ffmpeg = new FFmpeg();

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript",
      ),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });

    ffmpegRef.current = ffmpeg;

    return ffmpeg;
  }

  function handleFileChange(selectedFile: File | undefined) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select an audio file.");
      return;
    }

    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    setFile(selectedFile);
    setOutputUrl("");
    setOutputSize(0);
    setProgress(0);
    setError("");
  }

  async function convertAudio() {
    if (!file) {
      setError("Please choose an audio file first.");
      return;
    }

    setIsConverting(true);
    setError("");
    setOutputUrl("");
    setOutputSize(0);
    setProgress(0);

    const inputName = "input-audio";
    const outputName = `converted.${format}`;

    try {
      const ffmpeg = await loadFFmpeg();

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = ["-i", inputName];

      if (format === "mp3") {
        args.push("-c:a", "libmp3lame", "-b:a", "192k");
      }

      if (format === "wav") {
        args.push("-c:a", "pcm_s16le");
      }

      if (format === "ogg") {
        args.push("-c:a", "libvorbis", "-q:a", "5");
      }

      if (format === "m4a") {
        args.push("-c:a", "aac", "-b:a", "192k");
      }

      args.push(outputName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);

      const bytes =
        typeof data === "string"
          ? new TextEncoder().encode(data)
          : data;

      const arrayBuffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(arrayBuffer).set(bytes);

      const mimeTypes: Record<OutputFormat, string> = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
        m4a: "audio/mp4",
      };

      const blob = new Blob([arrayBuffer], {
        type: mimeTypes[format],
      });

      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      setOutputSize(blob.size);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      console.error("Audio conversion error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while converting the audio.",
      );
    } finally {
      setIsConverting(false);
    }
  }

  const originalSize = file?.size ?? 0;

  return (
    <Workspace>
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-[6px] border border-border bg-paper p-2">
          <AudioLines
            className="h-5 w-5 text-ink-muted"
            strokeWidth={1.5}
          />
        </div>

        <div>
          <h2 className="text-base font-medium text-ink">
            Audio Converter
          </h2>

          <p className="mt-1 text-sm text-ink-muted">
            Convert audio files between common formats directly in your browser.
          </p>
        </div>
      </div>

      <div
        className="cursor-pointer rounded-[8px] border border-dashed border-border-strong p-8 text-center transition-colors hover:border-ink"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(event) =>
            handleFileChange(event.target.files?.[0])
          }
        />

        <Upload
          className="mx-auto mb-3 h-7 w-7 text-ink-faint"
          strokeWidth={1.5}
        />

        <p className="text-sm font-medium text-ink">
          {file ? file.name : "Choose an audio file"}
        </p>

        <p className="mt-1 text-xs text-ink-faint">
          MP3, WAV, OGG, M4A and other common audio formats
        </p>

        {file && (
          <p className="mt-3 text-xs text-ink-muted">
            Original size:{" "}
            {(originalSize / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs text-ink-muted">
          Output format
        </label>

        <select
          value={format}
          onChange={(event) =>
            setFormat(event.target.value as OutputFormat)
          }
          className="w-full rounded-[6px] border border-border-strong bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        >
          <option value="mp3">MP3 — Most compatible</option>
          <option value="wav">WAV — Uncompressed</option>
          <option value="ogg">OGG — Open format</option>
          <option value="m4a">M4A — AAC audio</option>
        </select>
      </div>

      {error && (
        <ResultPanel>
          <p className="text-sm text-ink">{error}</p>
        </ResultPanel>
      )}

      {isConverting && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Converting...
            </span>

            <span>{progress}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-ink transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <PrimaryButton
          onClick={convertAudio}
          disabled={!file || isConverting}
        >
          {isConverting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Converting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <AudioLines className="h-4 w-4" />
              Convert Audio
            </span>
          )}
        </PrimaryButton>
      </div>

      {outputUrl && (
        <ResultPanel>
          <div>
            <p className="text-sm font-medium text-ink">
              Converted audio
            </p>

            <audio
              src={outputUrl}
              controls
              className="mt-4 w-full"
            />

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[6px] border border-border bg-paper p-3">
                <p className="text-xs text-ink-faint">
                  Original
                </p>

                <p className="mt-1 font-medium text-ink">
                  {(originalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="rounded-[6px] border border-border bg-paper p-3">
                <p className="text-xs text-ink-faint">
                  Converted
                </p>

                <p className="mt-1 font-medium text-ink">
                  {(outputSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <a
              href={outputUrl}
              download={`converted-${file?.name || "audio"}.${format}`}
              className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download converted audio
            </a>
          </div>
        </ResultPanel>
      )}
    </Workspace>
  );
}