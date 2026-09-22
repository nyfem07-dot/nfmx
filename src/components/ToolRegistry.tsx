import type { Tool } from "@/lib/types";
import { CompressImage } from "./tools/CompressImage";
import { ImageConverter } from "./tools/ImageConverter";
import { ResizeImage } from "./tools/ResizeImage";
import { PdfMerge } from "./tools/PdfMerge";
import { PdfSplit } from "./tools/PdfSplit";
import { PdfCompressor } from "./tools/PdfCompressor";
import { QrGenerator } from "./tools/QrGenerator";
import { WordCounter } from "./tools/WordCounter";
import { TextCleaner } from "./tools/TextCleaner";
import { JsonFormatter } from "./tools/JsonFormatter";
import { UnitConverter } from "./tools/UnitConverter";
import { PasswordGenerator } from "./tools/PasswordGenerator";
import { ComingSoon } from "./tools/ComingSoon";
import { CalculatorTools } from "./tools/calculators/CalculatorTools";
import { AiTools } from "./tools/ai/AiTools";
import { CurrencyConverter } from "./tools/CurrencyConverter";
import { GlobalRadio } from "./tools/GlobalRadio";
import { RemoveBackground } from "./tools/RemoveBackground";
import { VideoCompressorTools } from "./tools/video-compressor/VideoCompressorTools";
import { AudioConverterTools } from "./tools/audio-converter/AudioConverterTools";
import SpeedTestTools from "./tools/speed-test/SpeedTestTools";
import MyIpTools from "./tools/my-ip/MyIpTools";
import WebsiteStatusTools from "./tools/website-status/WebsiteStatusTools";
import FileInspectorTools from "./tools/file-inspector/FileInspectorTools";
import HashGeneratorTools from "./tools/hash-generator/HashGeneratorTools";
import UrlInspectorTools from "./tools/url-inspector/UrlInspectorTools";
import ColorPaletteTools from "./tools/color-palette/ColorPaletteTools";
import ScreenshotBeautifierTools from "./tools/screenshot-beautifier/ScreenshotBeautifierTools";
const registry: Record<string, React.ComponentType> = {
  "calculators": CalculatorTools,
  "ai-tools": AiTools,
  "compress-image": CompressImage,
  "image-converter": ImageConverter,
  "resize-image": ResizeImage,
  "pdf-merge": PdfMerge,
  "pdf-split": PdfSplit,
  "pdf-compressor": PdfCompressor,
  "qr-generator": QrGenerator,
  "word-counter": WordCounter,
  "text-cleaner": TextCleaner,
  "json-formatter": JsonFormatter,
  "unit-converter": UnitConverter,
  "password-generator": PasswordGenerator,
"currency-converter": CurrencyConverter,
"global-radio": GlobalRadio,
"remove-background": RemoveBackground,
"video-compressor": VideoCompressorTools,
"audio-converter": AudioConverterTools,
"speed-test": SpeedTestTools,
"my-ip": MyIpTools,
"website-status": WebsiteStatusTools,
"file-inspector": FileInspectorTools,
"hash-generator": HashGeneratorTools,
"url-inspector": UrlInspectorTools,
"color-palette": ColorPaletteTools,
"screenshot-beautifier": ScreenshotBeautifierTools,
};

export function ToolImplementation({ tool }: { tool: Tool }) {
  const Component = registry[tool.slug];
  if (!Component) return <ComingSoon tool={tool} />;
  return <Component />;
}



