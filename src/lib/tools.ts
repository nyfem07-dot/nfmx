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
  Regex,
  Ruler,
  ScanLine,
  Scissors,
  Search,
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
    shortDescription: "Reduce image file size while keeping quality high.",
    helpText:
      "Upload an image, choose your preferred compression level, and download a smaller file.",
    category: "images",
    icon: Image,
    status: "live",
    keywords: ["compress", "image", "jpg", "jpeg", "png", "webp", "reduce"],
    popular: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert images between popular formats.",
    helpText:
      "Convert JPG, PNG, WebP and other supported image formats directly in your browser.",
    category: "images",
    icon: FileImage,
    status: "live",
    keywords: ["image", "converter", "jpg", "jpeg", "png", "webp", "convert"],
    popular: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    shortDescription: "Resize images to exact dimensions or percentages.",
    helpText:
      "Set custom width and height values or resize an image proportionally.",
    category: "images",
    icon: ScanLine,
    status: "live",
    keywords: ["resize", "image", "width", "height", "dimensions", "scale"],
  },
  {
    slug: "remove-background",
    name: "Remove Background",
    shortDescription: "Remove the background from an image automatically.",
    helpText:
      "Upload an image and let the browser process it into a transparent-background image.",
    category: "images",
    icon: Image,
    status: "live",
    keywords: ["remove", "background", "transparent", "image", "cutout"],
  },
  {
    slug: "color-palette",
    name: "Color Palette",
    shortDescription: "Extract and explore colors from an image.",
    helpText:
      "Upload an image to generate a useful color palette with copyable color values.",
    category: "images",
    icon: SprayCan,
    status: "live",
    keywords: ["color", "palette", "image", "hex", "colors", "extract"],
    popular: true,
  },
  {
    slug: "screenshot-beautifier",
    name: "Screenshot Beautifier",
    shortDescription: "Turn screenshots into polished presentation images.",
    helpText:
      "Upload a screenshot, customize its appearance, and export a cleaner presentation-ready image.",
    category: "images",
    icon: Image,
    status: "live",
    keywords: [
      "screenshot",
      "beautify",
      "presentation",
      "mockup",
      "image",
      "background",
    ],
  },
  {
    slug: "pdf-merge",
    name: "PDF Merge",
    shortDescription: "Combine multiple PDF files into one document.",
    helpText:
      "Upload multiple PDFs, arrange them in the order you want, and download one combined PDF.",
    category: "pdf",
    icon: FileText,
    status: "live",
    keywords: ["pdf", "merge", "combine", "join", "documents"],
    popular: true,
  },
  {
    slug: "pdf-split",
    name: "PDF Split",
    shortDescription: "Extract selected pages from a PDF.",
    helpText:
      "Upload a PDF and choose the pages you want to extract into a new document.",
    category: "pdf",
    icon: Scissors,
    status: "live",
    keywords: ["pdf", "split", "extract", "pages", "document"],
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    shortDescription: "Reduce the size of PDF files.",
    helpText:
      "Upload a PDF and process it into a smaller file for easier sharing and storage.",
    category: "pdf",
    icon: FileText,
    status: "live",
    keywords: ["pdf", "compress", "reduce", "size", "document"],
  },
  {
    slug: "global-radio",
    name: "Global Radio",
    shortDescription: "Listen to radio stations from around the world.",
    helpText:
      "Search global radio stations and play available live streams directly from your browser.",
    category: "media",
    icon: Radio,
    status: "live",
    keywords: ["radio", "live", "stations", "music", "world", "stream"],
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    shortDescription: "Create QR codes from text, links and other information.",
    helpText:
      "Enter your content, generate a QR code, and download the resulting image.",
    category: "internet",
    icon: QrCode,
    status: "live",
    keywords: ["qr", "qrcode", "generator", "code", "url"],
    popular: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences and paragraphs.",
    helpText:
      "Paste or type text to instantly see useful writing statistics.",
    category: "text",
    icon: Type,
    status: "live",
    keywords: ["word", "counter", "characters", "sentences", "text"],
    popular: true,
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner",
    shortDescription: "Clean and normalize messy text instantly.",
    helpText:
      "Remove extra spaces, clean line breaks, normalize text and prepare content for reuse.",
    category: "text",
    icon: Sparkles,
    status: "live",
    keywords: ["text", "clean", "spaces", "format", "normalize"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Format, validate and inspect JSON data.",
    helpText:
      "Paste JSON to format it neatly and identify invalid JSON quickly.",
    category: "converters",
    icon: Braces,
    status: "live",
    keywords: ["json", "formatter", "format", "validate", "developer"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    shortDescription: "Convert between currencies using current exchange rates.",
    helpText:
      "Choose two currencies, enter an amount, and see the converted value.",
    category: "converters",
    icon: CircleDollarSign,
    status: "live",
    keywords: ["currency", "converter", "exchange", "money", "rates"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortDescription: "Convert common units quickly and accurately.",
    helpText:
      "Convert length, weight, temperature, area, volume and other everyday units.",
    category: "converters",
    icon: Ruler,
    status: "live",
    keywords: ["unit", "converter", "length", "weight", "temperature"],
    popular: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription: "Generate strong random passwords.",
    helpText:
      "Choose password length and character types to create a strong password locally.",
    category: "privacy",
    icon: KeyRound,
    status: "live",
    keywords: ["password", "generator", "secure", "random", "security"],
    popular: true,
  },
  {
    slug: "video-compressor",
    name: "Video Compressor",
    shortDescription: "Compress videos directly in your browser.",
    helpText:
      "Upload a video, choose a compression level, and export a smaller MP4 file.",
    category: "media",
    icon: Video,
    status: "live",
    keywords: ["video", "compress", "mp4", "reduce", "size"],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    shortDescription: "Convert audio files between popular formats.",
    helpText:
      "Convert audio files to MP3, WAV, OGG or M4A directly in your browser.",
    category: "media",
    icon: AudioLines,
    status: "live",
    keywords: ["audio", "converter", "mp3", "wav", "ogg", "m4a"],
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription:
      "Use practical calculators for everyday and technical work.",
    helpText:
      "Calculate percentages, discounts, BMI, loan values and other useful quantities.",
    category: "calculators",
    icon: Calculator,
    status: "live",
    keywords: ["calculator", "math", "percentage", "loan", "bmi"],
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    shortDescription: "Rewrite, summarize and transform text with AI.",
    helpText:
      "Use AI-powered writing tools for summaries, rewriting, grammar fixes, emails and captions.",
    category: "ai",
    icon: Sparkles,
    status: "live",
    keywords: ["ai", "writing", "summarize", "rewrite", "grammar", "email"],
  },
  {
    slug: "speed-test",
    name: "Internet Speed Test",
    shortDescription:
      "Measure your download speed, upload speed and latency.",
    helpText:
      "Run a browser-based network test to measure download speed, upload speed and latency.",
    category: "internet",
    icon: Wifi,
    status: "live",
    keywords: [
      "speed",
      "internet",
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
    shortDescription: "Find your public IP address.",
    helpText:
      "Check the public IP address currently visible to the internet.",
    category: "internet",
    icon: Globe2,
    status: "live",
    keywords: ["ip", "public ip", "my ip", "network", "internet"],
  },
  {
    slug: "website-status",
    name: "Website Status Checker",
    shortDescription:
      "Check whether a website is reachable and responding.",
    helpText:
      "Enter a website URL to check its HTTP status, response time and availability.",
    category: "internet",
    icon: Activity,
    status: "live",
    keywords: [
      "website",
      "status",
      "checker",
      "down",
      "uptime",
      "http",
      "online",
    ],
  },
  {
    slug: "file-inspector",
    name: "File Inspector",
    shortDescription: "Inspect file type, size and metadata.",
    helpText:
      "Choose a file to inspect its name, type, size and browser-accessible metadata.",
    category: "privacy",
    icon: FileSearch,
    status: "live",
    keywords: ["file", "inspector", "metadata", "type", "size"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate SHA-256, SHA-384 and SHA-512 hashes.",
    helpText:
      "Hash text or files locally in your browser using standard SHA algorithms.",
    category: "privacy",
    icon: Hash,
    status: "live",
    keywords: ["hash", "sha256", "sha384", "sha512", "checksum", "security"],
  },
  {
    slug: "url-inspector",
    name: "URL Inspector",
    shortDescription: "Break down and inspect every part of a URL.",
    helpText:
      "Inspect the protocol, hostname, path, query parameters, fragment and other URL components.",
    category: "internet",
    icon: Link2,
    status: "live",
    keywords: ["url", "inspector", "parser", "query", "hostname", "protocol"],
  },
  {
    slug: "social-media-image-maker",
    name: "Social Media Image Maker",
    shortDescription: "Create polished images for social media posts.",
    helpText:
      "Create social media graphics with custom text, backgrounds and export sizes.",
    category: "social",
    icon: Image,
    status: "live",
    keywords: [
      "social media",
      "image",
      "instagram",
      "twitter",
      "facebook",
      "post",
      "graphic",
    ],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortDescription: "Crop images to custom dimensions and aspect ratios.",
    helpText:
      "Upload an image, choose a crop area and export the result in your preferred format.",
    category: "images",
    icon: ScanLine,
    status: "live",
    keywords: ["crop", "image", "resize", "aspect ratio", "photo"],
  },
  {
    slug: "image-watermark",
    name: "Image Watermark",
    shortDescription: "Add text watermarks to images.",
    helpText:
      "Upload an image, customize a watermark and export the finished image locally.",
    category: "images",
    icon: SprayCan,
    status: "live",
    keywords: ["watermark", "image", "logo", "text", "copyright"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    shortDescription: "Convert one or more images into a PDF.",
    helpText:
      "Upload images, arrange them and generate a downloadable PDF document.",
    category: "pdf",
    icon: FileImage,
    status: "live",
    keywords: ["image", "pdf", "convert", "jpg", "png", "document"],
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    shortDescription: "Convert PDF pages into image files.",
    helpText:
      "Upload a PDF and export its pages as PNG images directly in your browser.",
    category: "pdf",
    icon: FileImage,
    status: "live",
    keywords: ["pdf", "images", "png", "convert", "pages", "extract"],
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    shortDescription:
      "Create professional invoices and download them as PDF.",
    helpText:
      "Build an invoice with business details, customer information, line items, taxes, discounts and payment notes.",
    category: "calculators",
    icon: FileText,
    status: "live",
    keywords: [
      "invoice",
      "invoice generator",
      "billing",
      "receipt",
      "pdf",
      "business",
      "freelance",
    ],
  },
  {
    slug: "api-tester",
    name: "API Tester",
    shortDescription:
      "Send HTTP requests and inspect API responses directly in your browser.",
    helpText:
      "Test GET, POST, PUT, PATCH, and DELETE requests with custom headers and JSON bodies, then inspect response status, timing, headers, and formatted JSON.",
    category: "internet",
    icon: Braces,
    status: "live",
    keywords: [
      "api",
      "api tester",
      "rest api",
      "rest client",
      "http",
      "http client",
      "request",
      "response",
      "get",
      "post",
      "put",
      "patch",
      "delete",
      "json",
      "headers",
      "developer",
    ],
  },
  {
    slug: "event-finder",
    name: "Event Finder",
    shortDescription:
      "Find upcoming football matches, times, venues and event details.",
    helpText:
      "Browse upcoming football fixtures across major competitions, search teams and venues, and see kickoff times in your local timezone.",
    category: "internet",
    icon: Search,
    status: "live",
    keywords: [
      "football",
      "soccer",
      "event",
      "event finder",
      "football fixtures",
      "fixtures",
      "matches",
      "premier league",
      "la liga",
      "serie a",
      "bundesliga",
      "ligue 1",
      "champions league",
      "match time",
      "where to watch",
    ],
  },
  {
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    shortDescription:
      "Compare two texts and see exactly what changed.",
    helpText:
      "Compare original and updated text to identify added, removed and unchanged words.",
    category: "text",
    icon: FileText,
    status: "live",
    keywords: [
      "text",
      "diff",
      "difference",
      "compare",
      "comparison",
      "changes",
      "added",
      "removed",
      "code diff",
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode JSON Web Tokens and inspect their contents.",
    helpText:
      "Decode JWT headers, payloads and signatures locally in your browser and inspect common token timestamps.",
    category: "privacy",
    icon: KeyRound,
    status: "live",
    keywords: [
      "jwt",
      "jwt decoder",
      "json web token",
      "token",
      "decode jwt",
      "developer",
      "authentication",
      "authorization",
      "header",
      "payload",
      "signature",
      "exp",
      "iat",
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortDescription:
      "Test regular expressions and inspect matches instantly.",
    helpText:
      "Test regex patterns against text, highlight matches, inspect match positions and view capture groups directly in your browser.",
    category: "text",
    icon: Regex,
    status: "live",
    keywords: [
      "regex",
      "regex tester",
      "regular expression",
      "regexp",
      "pattern",
      "matches",
      "capture groups",
      "developer",
      "text",
      "search",
    ],
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    shortDescription:
      "Encode text to Base64 or decode Base64 back into readable text.",
    helpText:
      "Encode and decode Base64 strings locally in your browser, with support for URL-safe Base64.",
    category: "converters",
    icon: Braces,
    status: "live",
    keywords: [
      "base64",
      "base64 encoder",
      "base64 decoder",
      "encode",
      "decode",
      "converter",
      "url safe",
      "developer",
      "text",
    ],
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    shortDescription:
      "Write Markdown with a live preview and export your document.",
    helpText:
      "Write Markdown, preview the formatted result instantly, copy the source or download it as a Markdown file.",
    category: "text",
    icon: FileText,
    status: "live",
    keywords: [
      "markdown",
      "markdown editor",
      "md",
      "editor",
      "preview",
      "documentation",
      "developer",
      "writing",
      "text",
    ],
  },
];

export function categoryCounts() {
  return tools.reduce(
    (counts, tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
      return counts;
    },
    {} as Record<ToolCategory, number>,
  );
}

export function toolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
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
