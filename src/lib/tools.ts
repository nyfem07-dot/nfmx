import {
  Activity,
  AudioLines,
  Braces,
  Calculator,
  CircleDollarSign,
  FileImage,
  FileSearch,
  FileText,
  Globe2,
  Hash,
  Image,
  KeyRound,
  Link2,
  QrCode,
  Radio,
  Ruler,
  ScanLine,
  Scissors,
  Sparkles,
  SprayCan,
  Type,
  Video,
  Wifi,
} from "lucide-react";

export type ToolCategory =
  | "media"
  | "images"
  | "pdf"
  | "internet"
  | "text"
  | "converters"
  | "privacy"
  | "social"
  | "calculators"
  | "ai";

export type ToolStatus = "live" | "soon";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  helpText: string;
  category: ToolCategory;
  icon: typeof FileText;
  status: ToolStatus;
  keywords: string[];
  popular?: boolean;
};

export const tools: ToolDefinition[] = [
  {
    slug: "compress-image",
    name: "Compress Image",
    shortDescription:
      "Reduce image file size without unnecessary quality loss.",
    helpText:
      "Upload an image and compress it directly in your browser.",
    category: "images",
    icon: Image,
    status: "live",
    keywords: [
      "image",
      "compress",
      "size",
      "optimize",
      "jpg",
      "png",
      "webp",
    ],
    popular: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription:
      "Convert images between JPG, PNG and WebP.",
    helpText:
      "Convert common image formats directly in your browser.",
    category: "images",
    icon: FileImage,
    status: "live",
    keywords: [
      "image",
      "convert",
      "jpg",
      "png",
      "webp",
      "format",
    ],
    popular: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    shortDescription:
      "Resize images to exact dimensions or by percentage.",
    helpText:
      "Choose the dimensions you need and export the resized image.",
    category: "images",
    icon: ScanLine,
    status: "live",
    keywords: [
      "image",
      "resize",
      "dimensions",
      "scale",
      "width",
      "height",
    ],
  },
  {
    slug: "remove-background",
    name: "Remove Background",
    shortDescription:
      "Remove an image background automatically.",
    helpText:
      "Use AI background removal directly in your browser.",
    category: "images",
    icon: Sparkles,
    status: "live",
    keywords: [
      "image",
      "background",
      "remove",
      "transparent",
      "ai",
    ],
  },
  {
    slug: "color-palette",
    name: "Color Palette Studio",
    shortDescription:
      "Generate complementary, analogous, triadic, and monochromatic color palettes.",
    helpText:
      "Create useful color combinations from a base HEX color and copy HEX, RGB, or HSL values.",
    category: "images",
    icon: Sparkles,
    status: "live",
    popular: true,
    keywords: [
      "color",
      "palette",
      "color palette",
      "hex",
      "rgb",
      "hsl",
      "complementary",
      "analogous",
      "triadic",
      "monochromatic",
      "designer",
      "colors",
    ],
  },
  {
    slug: "screenshot-beautifier",
    name: "Screenshot Beautifier",
    shortDescription:
      "Turn screenshots into polished images with backgrounds, spacing, rounded corners, and shadows.",
    helpText:
      "Upload a screenshot and create a clean presentation-ready image entirely in your browser.",
    category: "images",
    icon: Sparkles,
    status: "live",
    keywords: [
      "screenshot",
      "beautify",
      "image",
      "presentation",
      "mockup",
      "background",
      "shadow",
      "rounded corners",
      "padding",
    ],
  },
  {
    slug: "pdf-merge",
    name: "Merge PDF",
    shortDescription:
      "Combine multiple PDF files into one document.",
    helpText:
      "Select multiple PDF files and merge them in your chosen order.",
    category: "pdf",
    icon: FileText,
    status: "live",
    keywords: [
      "pdf",
      "merge",
      "combine",
      "join",
    ],
    popular: true,
  },
  {
    slug: "pdf-split",
    name: "Split PDF",
    shortDescription:
      "Extract selected pages from a PDF.",
    helpText:
      "Upload a PDF and choose which pages to extract.",
    category: "pdf",
    icon: Scissors,
    status: "live",
    keywords: [
      "pdf",
      "split",
      "pages",
      "extract",
    ],
  },
  {
    slug: "pdf-compressor",
    name: "Compress PDF",
    shortDescription:
      "Reduce the size of a PDF document.",
    helpText:
      "Compress PDF content in your browser.",
    category: "pdf",
    icon: FileText,
    status: "live",
    keywords: [
      "pdf",
      "compress",
      "size",
      "optimize",
    ],
  },
  {
    slug: "global-radio",
    name: "Global Radio",
    shortDescription:
      "Listen to live radio stations from around the world.",
    helpText:
      "Search and play live internet radio stations.",
    category: "media",
    icon: Radio,
    status: "live",
    keywords: [
      "radio",
      "live",
      "stations",
      "music",
      "world",
    ],
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    shortDescription:
      "Create QR codes for links, text and more.",
    helpText:
      "Enter content and generate a downloadable QR code.",
    category: "social",
    icon: QrCode,
    status: "live",
    keywords: [
      "qr",
      "qrcode",
      "code",
      "link",
      "generator",
    ],
    popular: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription:
      "Count words, characters and reading time.",
    helpText:
      "Paste text to see word count, character count and estimated reading time.",
    category: "text",
    icon: Type,
    status: "live",
    keywords: [
      "word",
      "count",
      "characters",
      "reading time",
    ],
    popular: true,
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner",
    shortDescription:
      "Clean spaces, line breaks and unwanted formatting.",
    helpText:
      "Paste text and remove unnecessary whitespace and formatting.",
    category: "text",
    icon: SprayCan,
    status: "live",
    keywords: [
      "clean",
      "text",
      "whitespace",
      "format",
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription:
      "Pretty-print, validate and minify JSON.",
    helpText:
      "Format JSON for easier reading or minify it for compact output.",
    category: "text",
    icon: Braces,
    status: "live",
    keywords: [
      "json",
      "format",
      "validate",
      "minify",
      "pretty print",
    ],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    shortDescription:
      "Convert between world currencies.",
    helpText:
      "Convert values between supported currencies using current exchange rates.",
    category: "converters",
    icon: CircleDollarSign,
    status: "live",
    keywords: [
      "currency",
      "money",
      "exchange",
      "convert",
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortDescription:
      "Convert between common measurement units.",
    helpText:
      "Convert length, weight, temperature and other common units.",
    category: "converters",
    icon: Ruler,
    status: "live",
    keywords: [
      "unit",
      "convert",
      "length",
      "weight",
      "temperature",
    ],
    popular: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Create strong, random passwords.",
    helpText:
      "Generate secure passwords with customizable length and character sets.",
    category: "privacy",
    icon: KeyRound,
    status: "live",
    keywords: [
      "password",
      "generator",
      "security",
      "random",
    ],
    popular: true,
  },
  {
    slug: "video-compressor",
    name: "Video Compressor",
    shortDescription:
      "Reduce video file size directly in your browser.",
    helpText:
      "Compress MP4 videos using browser-based processing.",
    category: "media",
    icon: Video,
    status: "live",
    keywords: [
      "video",
      "compress",
      "shrink",
      "size",
    ],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    shortDescription:
      "Convert audio between common formats.",
    helpText:
      "Convert audio files between MP3, WAV, OGG and M4A.",
    category: "media",
    icon: AudioLines,
    status: "live",
    keywords: [
      "audio",
      "convert",
      "mp3",
      "wav",
      "format",
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription:
      "Useful calculators for everyday calculations.",
    helpText:
      "Access a collection of practical calculators.",
    category: "calculators",
    icon: Calculator,
    status: "live",
    keywords: [
      "calculator",
      "math",
      "calculate",
      "percentage",
    ],
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    shortDescription:
      "Write, rewrite, summarize and improve text with AI.",
    helpText:
      "Use AI for common writing and text-generation tasks.",
    category: "ai",
    icon: Sparkles,
    status: "live",
    keywords: [
      "ai",
      "write",
      "rewrite",
      "summarize",
      "email",
      "caption",
    ],
  },
  {
    slug: "speed-test",
    name: "Internet Speed Test",
    shortDescription:
      "Measure your download speed, upload speed and latency.",
    helpText:
      "Run a browser-based connection test to measure download, upload and latency.",
    category: "internet",
    icon: Activity,
    status: "live",
    keywords: [
      "internet",
      "speed",
      "speed test",
      "download",
      "upload",
      "ping",
      "latency",
    ],
  },
  {
    slug: "my-ip",
    name: "What's My IP",
    shortDescription:
      "Find your public IP address.",
    helpText:
      "See the public IP address used by your internet connection.",
    category: "internet",
    icon: Wifi,
    status: "live",
    keywords: [
      "ip",
      "ip address",
      "public ip",
      "network",
      "internet",
    ],
  },
  {
    slug: "website-status",
    name: "Website Status Checker",
    shortDescription:
      "Check whether a website is reachable and responding.",
    helpText:
      "Check a website's HTTP status, response time, and final URL after redirects.",
    category: "internet",
    icon: Globe2,
    status: "live",
    keywords: [
      "website",
      "status",
      "website checker",
      "site checker",
      "http status",
      "uptime",
      "online",
      "offline",
      "response time",
    ],
  },
  {
    slug: "file-inspector",
    name: "File Inspector",
    shortDescription:
      "Inspect file details, type, size, and metadata directly in your browser.",
    helpText:
      "Inspect a file's name, extension, MIME type, size, and last modified date without uploading it.",
    category: "privacy",
    icon: FileSearch,
    status: "live",
    keywords: [
      "file",
      "file inspector",
      "file information",
      "metadata",
      "mime type",
      "file type",
      "file size",
      "extension",
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    shortDescription:
      "Generate SHA-256, SHA-384, and SHA-512 hashes from text or files.",
    helpText:
      "Generate cryptographic hashes locally in your browser without uploading your data.",
    category: "privacy",
    icon: Hash,
    status: "live",
    keywords: [
      "hash",
      "hash generator",
      "sha256",
      "sha-256",
      "sha384",
      "sha-384",
      "sha512",
      "sha-512",
      "checksum",
      "file hash",
      "text hash",
    ],
  },
  {
    slug: "url-inspector",
    name: "URL Inspector",
    shortDescription:
      "Break down URLs into their individual components.",
    helpText:
      "Inspect a URL's protocol, hostname, port, path, query parameters and fragment.",
    category: "internet",
    icon: Link2,
    status: "live",
    keywords: [
      "url",
      "url inspector",
      "url parser",
      "link",
      "domain",
      "hostname",
      "query",
      "parameters",
      "path",
      "protocol",
    ],
  },
];

export function popularTools() {
  return tools.filter((tool) => tool.popular);
}

export function categoryCounts() {
  return tools.reduce(
    (counts, tool) => {
      counts[tool.category] =
        (counts[tool.category] || 0) + 1;

      return counts;
    },
    {} as Record<ToolCategory, number>,
  );
}

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function toolsByCategory(category: ToolCategory) {
  return tools.filter(
    (tool) => tool.category === category,
  );
}

export function searchTools(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return tools.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.shortDescription,
      tool.helpText,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}