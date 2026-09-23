"use client";

import { useMemo, useState } from "react";
import {
  Bold,
  Check,
  Code,
  Copy,
  Download,
  Heading,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
} from "lucide-react";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdown(markdown: string) {
  let html = escapeHtml(markdown);

  html = html.replace(
    /^###### (.*)$/gm,
    "<h6>$1</h6>",
  );
  html = html.replace(
    /^##### (.*)$/gm,
    "<h5>$1</h5>",
  );
  html = html.replace(
    /^#### (.*)$/gm,
    "<h4>$1</h4>",
  );
  html = html.replace(
    /^### (.*)$/gm,
    "<h3>$1</h3>",
  );
  html = html.replace(
    /^## (.*)$/gm,
    "<h2>$1</h2>",
  );
  html = html.replace(
    /^# (.*)$/gm,
    "<h1>$1</h1>",
  );

  html = html.replace(
    /^> (.*)$/gm,
    "<blockquote>$1</blockquote>",
  );

  html = html.replace(
    /^[-*] (.*)$/gm,
    "<li>$1</li>",
  );

  html = html.replace(
    /^\d+\. (.*)$/gm,
    "<li>$1</li>",
  );

  html = html.replace(
    /```([\s\S]*?)```/g,
    "<pre><code>$1</code></pre>",
  );

  html = html.replace(
    /`([^`]+)`/g,
    "<code>$1</code>",
  );

  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>",
  );

  html = html.replace(
    /__([^_]+)__/g,
    "<strong>$1</strong>",
  );

  html = html.replace(
    /\*([^*]+)\*/g,
    "<em>$1</em>",
  );

  html = html.replace(
    /_([^_]+)_/g,
    "<em>$1</em>",
  );

  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );

  html = html.replace(
    /^(<li>.*<\/li>)$/gm,
    "$1",
  );

  html = html.replace(/\n{2,}/g, "<br /><br />");
  html = html.replace(/\n/g, "<br />");

  return html;
}

export default function MarkdownEditorTools() {
  const [markdown, setMarkdown] = useState(
    "# Welcome to NFMX\n\nWrite **Markdown** here and see the result instantly.\n\n- Fast\n- Simple\n- Browser-based",
  );
  const [copied, setCopied] = useState(false);

  const preview = useMemo(
    () => renderMarkdown(markdown),
    [markdown],
  );

  function insert(text: string, cursorOffset = 0) {
    const textarea = document.getElementById(
      "markdown-editor",
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end);

    const nextValue =
      markdown.slice(0, start) +
      text.replace("$SELECTION", selected) +
      markdown.slice(end);

    setMarkdown(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const newPosition =
        start + text.replace("$SELECTION", selected).length + cursorOffset;

      textarea.setSelectionRange(newPosition, newPosition);
    });
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "nfmX-document.md";
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function clearMarkdown() {
    setMarkdown("");
    setCopied(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => insert("# $SELECTION")}
          title="Heading"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Heading className="h-4 w-4" />
          Heading
        </button>

        <button
          type="button"
          onClick={() => insert("**$SELECTION**")}
          title="Bold"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Bold className="h-4 w-4" />
          Bold
        </button>

        <button
          type="button"
          onClick={() => insert("*$SELECTION*")}
          title="Italic"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Italic className="h-4 w-4" />
          Italic
        </button>

        <button
          type="button"
          onClick={() => insert("[${SELECTION}](https://example.com)")}
          title="Link"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Link className="h-4 w-4" />
          Link
        </button>

        <button
          type="button"
          onClick={() => insert("- $SELECTION")}
          title="Bullet list"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <List className="h-4 w-4" />
          List
        </button>

        <button
          type="button"
          onClick={() => insert("1. $SELECTION")}
          title="Numbered list"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ListOrdered className="h-4 w-4" />
          Numbered
        </button>

        <button
          type="button"
          onClick={() => insert("> $SELECTION")}
          title="Quote"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Quote className="h-4 w-4" />
          Quote
        </button>

        <button
          type="button"
          onClick={() => insert("`$SELECTION`")}
          title="Inline code"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Code className="h-4 w-4" />
          Code
        </button>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={copyMarkdown}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>

          <button
            type="button"
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download
          </button>

          <button
            type="button"
            onClick={clearMarkdown}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold text-white">
              Markdown
            </span>
          </div>

          <textarea
            id="markdown-editor"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
            className="min-h-[520px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-white outline-none placeholder:text-white/25"
            placeholder="Write your Markdown here..."
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold text-white">
              Preview
            </span>
          </div>

          <div
            className="prose prose-invert min-h-[520px] max-w-none overflow-auto p-5 text-sm leading-7 text-white/85 [&_a]:text-emerald-400 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:bg-black/40 [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </section>
      </div>

      <p className="text-xs text-white/40">
        Markdown is processed locally in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}
