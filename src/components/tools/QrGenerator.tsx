"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Workspace, Field, TextInput, PrimaryButton, Select } from "./shared";

export function QrGenerator() {
  const [text, setText] = useState("https://example.com");
  const [color, setColor] = useState("#1c1b19");
  const [size, setSize] = useState("320");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(
      canvasRef.current,
      text,
      {
        width: Number(size),
        margin: 1,
        color: { dark: color, light: "#00000000" },
      },
      (err) => setError(err ? "Couldn't generate a code for this text." : null)
    );
  }, [text, color, size]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <Workspace>
      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <Field label="Text or link">
            <TextInput
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://your-link.com"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-[6px] border border-border-strong bg-paper p-1"
                />
                <TextInput value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </Field>
            <Field label="Size">
              <Select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="240">Small — 240px</option>
                <option value="320">Medium — 320px</option>
                <option value="480">Large — 480px</option>
              </Select>
            </Field>
          </div>
          <div>
            <PrimaryButton onClick={download} disabled={!text.trim() || !!error}>
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                Download PNG
              </span>
            </PrimaryButton>
          </div>
          {error && <p className="text-xs text-ink-muted">{error}</p>}
        </div>

        <div className="flex items-center justify-center rounded-[8px] border border-border bg-[repeating-conic-gradient(var(--border)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] p-4">
          <canvas ref={canvasRef} className="h-40 w-40 sm:h-48 sm:w-48" />
        </div>
      </div>
    </Workspace>
  );
}
