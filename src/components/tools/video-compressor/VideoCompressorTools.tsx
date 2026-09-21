"use client";

import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  Download,
  Film,
  Loader2,
  Upload,
} from "lucide-react";
import {
  PrimaryButton,
  ResultPanel,
  Workspace,
} from "@/components/tools/shared";

type CompressionLevel = "low" | "medium" | "high";

export function VideoCompressorTools() {
  const inputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
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

    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a video file.");
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

  async function compressVideo() {
    if (!file) {
      setError("Please choose a video first.");
      return;
    }

    setIsCompressing(true);
    setError("");
    setOutputUrl("");
    setOutputSize(0);
    setProgress(0);

    const inputName = "input-video";
    const outputName = "compressed.mp4";

    try {
      const ffmpeg = await loadFFmpeg();

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let crf = "28";

      if (level === "low") {
        crf = "24";
      }

      if (level === "high") {
        crf = "32";
      }

      await ffmpeg.exec([
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-crf",
        crf,
        "-preset",
        "fast",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);

      const bytes =
        typeof data === "string"
          ? new TextEncoder().encode(data)
          : data;

      const arrayBuffer = new ArrayBuffer(bytes.byteLength);
new Uint8Array(arrayBuffer).set(bytes);

const blob = new Blob([arrayBuffer], {
  type: "video/mp4",
});

      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      setOutputSize(blob.size);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      console.error("Video compression error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while compressing the video.",
      );
    } finally {
      setIsCompressing(false);
    }
  }

  const originalSize = file?.size ?? 0;

  const reduction =
    originalSize > 0 && outputSize > 0
      ? Math.max(
          0,
          Math.round((1 - outputSize / originalSize) * 100),
        )
      : 0;

  return (
    <Workspace>
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-[6px] border border-border bg-paper p-2">
          <Film
            className="h-5 w-5 text-ink-muted"
            strokeWidth={1.5}
          />
        </div>

        <div>
          <h2 className="text-base font-medium text-ink">
            Video Compressor
          </h2>

          <p className="mt-1 text-sm text-ink-muted">
            Reduce video file size directly in your browser.
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
          accept="video/*"
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
          {file ? file.name : "Choose a video"}
        </p>

        <p className="mt-1 text-xs text-ink-faint">
          MP4, MOV, WebM and other common video formats
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
          Compression level
        </label>

        <select
          value={level}
          onChange={(event) =>
            setLevel(event.target.value as CompressionLevel)
          }
          className="w-full rounded-[6px] border border-border-strong bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        >
          <option value="low">
            Low — Better quality
          </option>

          <option value="medium">
            Medium — Recommended
          </option>

          <option value="high">
            High — Smaller file
          </option>
        </select>
      </div>

      {error && (
        <ResultPanel>
          <p className="text-sm text-ink">{error}</p>
        </ResultPanel>
      )}

      {isCompressing && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Compressing...
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
          onClick={compressVideo}
          disabled={!file || isCompressing}
        >
          {isCompressing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Compressing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Compress Video
            </span>
          )}
        </PrimaryButton>
      </div>

      {outputUrl && (
        <ResultPanel>
          <div>
            <p className="text-sm font-medium text-ink">
              Compressed video
            </p>

            <video
              src={outputUrl}
              controls
              className="mt-4 w-full rounded-[6px]"
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
                  Compressed
                </p>

                <p className="mt-1 font-medium text-ink">
                  {(outputSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-ink-muted">
              Reduced by approximately {reduction}%.
            </p>

            <a
              href={outputUrl}
              download={`compressed-${file?.name || "video.mp4"}`}
              className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download compressed video
            </a>
          </div>
        </ResultPanel>
      )}
    </Workspace>
  );
}