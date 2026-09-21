import {
  Minimize2,
  FileImage,
  Scaling,
  Eraser,
  Combine,
  Scissors,
  FileDown,
  Radio,
  QrCode,
  Type,
  SprayCan,
  Braces,
  DollarSign,
  Ruler,
  KeyRound,
  Calculator,
  WandSparkles,
  Film,
  AudioLines,
} from "lucide-react";
import type { Tool } from "./types";

export const tools: Tool[] = [
  {
    slug: "ai-tools",
    name: "AI Tools",
    shortDescription: "Summarize, rewrite, fix grammar and create useful text with AI.",
    helpText:
      "A collection of AI-powered writing tools for transforming and creating text.",
    category: "ai",
    icon: WandSparkles,
    status: "live",
    keywords: ["ai", "artificial intelligence", "summarize", "rewrite", "grammar", "email", "caption"],
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription: "Useful calculators for finance, percentages, age and engineering.",
    helpText:
      "A collection of practical calculators that run entirely in your browser.",
    category: "calculators",
    icon: Calculator,
    status: "live",
    keywords: ["calculator", "math", "percentage", "loan", "interest", "age", "engineering"],
  },
  {
    slug: "compress-image",
    name: "Compress Image",
    shortDescription: "Shrink JPG, PNG or WebP files without losing much quality.",
    helpText:
      "Compression happens entirely in your browser using the canvas API. Pick a quality level and NFMX re-encodes the image, so nothing is uploaded anywhere.",
    category: "images",
    icon: Minimize2,
    status: "live",
    keywords: ["compress", "shrink", "optimize", "jpg", "png", "size"],
    popular: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert between JPG, PNG and WebP.",
    helpText:
      "Your image is decoded and redrawn to a new format directly in the browser, with a quality slider for lossy formats.",
    category: "images",
    icon: FileImage,
    status: "live",
    keywords: ["convert", "jpg", "png", "webp", "format"],
    popular: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    shortDescription: "Change image dimensions by pixels or percentage.",
    helpText:
      "Set an exact width and height, or scale proportionally. The resize happens on-device using the canvas API.",
    category: "images",
    icon: Scaling,
    status: "live",
    keywords: ["resize", "scale", "dimensions", "pixels"],
  },
  {
    slug: "remove-background",
    name: "Remove Image Background",
    shortDescription: "Cut a subject out from its background automatically.",
    helpText:
      "Remove an image background directly in your browser and download a transparent PNG.",
    category: "images",
    icon: Eraser,
    status: "live",
    keywords: ["background", "cutout", "transparent", "remove"],
  },
  {
    slug: "pdf-merge",
    name: "PDF Merge",
    shortDescription: "Combine several PDF files into one document.",
    helpText:
      "Files are joined in the order you add them, using pdf-lib running fully in your browser. Reorder before merging with drag and drop.",
    category: "pdf",
    icon: Combine,
    status: "live",
    keywords: ["pdf", "merge", "combine", "join"],
    popular: true,
  },
  {
    slug: "pdf-split",
    name: "PDF Split",
    shortDescription: "Pull specific pages out of a PDF, or split every page.",
    helpText:
      "Choose a page range or split into individual single-page files. Processing stays on your device.",
    category: "pdf",
    icon: Scissors,
    status: "live",
    keywords: ["pdf", "split", "extract", "pages"],
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    shortDescription: "Reduce a PDF's file size for easier sharing.",
    helpText:
      "NFMX re-saves the PDF with its objects optimized. Savings vary a lot depending on what's inside the file Ã¢â‚¬â€ image-heavy PDFs shrink the most.",
    category: "pdf",
    icon: FileDown,
    status: "live",
    keywords: ["pdf", "compress", "shrink", "size"],
  },
  {
    slug: "global-radio",
    name: "Global Radio",
    shortDescription: "Listen to live radio stations from around the world.",
    helpText:
      "Search and listen to live radio stations from around the world.",
    category: "media",
    icon: Radio,
    status: "live",
    keywords: ["radio", "stream", "listen", "music"],
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    shortDescription: "Turn a link or text into a scannable QR code.",
    helpText:
      "The code is generated on-device and can be downloaded as a PNG. Nothing you type is sent anywhere.",
    category: "internet",
    icon: QrCode,
    status: "live",
    keywords: ["qr", "code", "generator", "link"],
    popular: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences and reading time.",
    helpText:
      "Paste or type text to see live counts. Useful for captions, essays and anything with a length limit.",
    category: "text",
    icon: Type,
    status: "live",
    keywords: ["word", "count", "characters", "reading time"],
    popular: true,
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner",
    shortDescription: "Strip extra spaces, line breaks and odd formatting.",
    helpText:
      "Choose which cleanup rules to apply Ã¢â‚¬â€ trimming whitespace, collapsing blank lines, removing smart quotes and more Ã¢â‚¬â€ then copy the result.",
    category: "text",
    icon: SprayCan,
    status: "live",
    keywords: ["clean", "text", "whitespace", "format"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Pretty-print, validate and minify JSON.",
    helpText:
      "Paste JSON to format it with proper indentation, or catch syntax errors with a clear message pointing at the problem.",
    category: "text",
    icon: Braces,
    status: "live",
    keywords: ["json", "format", "validate", "minify", "pretty print"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    shortDescription: "Convert between world currencies.",
    helpText:
      "Convert between major world currencies using reference exchange rates. Rates are fetched when you choose a base currency.",
    category: "converters",
    icon: DollarSign,
    status: "live",
    keywords: ["currency", "money", "exchange", "convert"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortDescription: "Convert length, weight, temperature and more.",
    helpText:
      "Pick a category and two units to convert between. Conversions update as you type.",
    category: "converters",
    icon: Ruler,
    status: "live",
    keywords: ["unit", "convert", "length", "weight", "temperature"],
    popular: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription: "Create strong, random passwords.",
    helpText:
      "Passwords are generated using your browser's cryptographically secure random number generator and never leave your device.",
    category: "privacy",
    icon: KeyRound,
    status: "live",
    keywords: ["password", "generator", "security", "random"],
    popular: true,
  },
  {
    slug: "video-compressor",
    name: "Video Compressor",
    shortDescription: "Reduce video file size for sharing or uploading.",
    helpText:
      "Video encoding is heavy work that needs a dedicated engine we haven't shipped in the browser yet. Coming in a future release.",
    category: "media",
    icon: Film,
    status: "live",
    keywords: ["video", "compress", "shrink", "size"],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    shortDescription: "Convert audio between common formats.",
    helpText:
      "Audio transcoding needs a dedicated engine we haven't shipped in the browser yet. Coming in a future release.",
    category: "media",
    icon: AudioLines,
    status: "live",
    keywords: ["audio", "convert", "mp3", "wav", "format"],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function popularTools(): Tool[] {
  return tools.filter((t) => t.popular);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();

  if (!q) return [];

  return tools.filter((t) => {
    const haystack = [
      t.name,
      t.shortDescription,
      t.category,
      ...t.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function categoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const t of tools) {
    counts[t.category] = (counts[t.category] ?? 0) + 1;
  }

  return counts;
}
