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
import InvoiceGeneratorTools from "./tools/invoice-generator/InvoiceGeneratorTools";
import ApiTesterTools from "./tools/api-tester/ApiTesterTools";
import EventFinderTools from "./tools/event-finder/EventFinderTools";
import TextDiffCheckerTools from "./tools/text-diff-checker/TextDiffCheckerTools";
import JwtDecoderTools from "./tools/jwt-decoder/JwtDecoderTools";
import RegexTesterTools from "./tools/regex-tester/RegexTesterTools";
import Base64Tools from "./tools/base64/Base64Tools";
import MarkdownEditorTools from "./tools/markdown-editor/MarkdownEditorTools";
import ColorPaletteTools from "./tools/color-palette/ColorPaletteTools";
import ScreenshotBeautifierTools from "./tools/screenshot-beautifier/ScreenshotBeautifierTools";
import SocialMediaImageMakerTools from "./tools/social-media-image-maker/SocialMediaImageMakerTools";
import ImageCropperTools from "./tools/image-cropper/ImageCropperTools";
import ImageWatermarkTools from "./tools/image-watermark/ImageWatermarkTools";
import ImageToPdfTools from "./tools/image-to-pdf/ImageToPdfTools";
import PdfToImagesTools from "./tools/pdf-to-images/PdfToImagesTools";
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
  "invoice-generator": InvoiceGeneratorTools,
  "api-tester": ApiTesterTools,
  "event-finder": EventFinderTools,
  "text-diff-checker": TextDiffCheckerTools,
  "jwt-decoder": JwtDecoderTools,
  "regex-tester": RegexTesterTools,
  "base64": Base64Tools,
  "markdown-editor": MarkdownEditorTools,
"color-palette": ColorPaletteTools,
"screenshot-beautifier": ScreenshotBeautifierTools,
"social-media-image-maker": SocialMediaImageMakerTools,
"image-cropper": ImageCropperTools,
"image-watermark": ImageWatermarkTools,
"image-to-pdf": ImageToPdfTools,
"pdf-to-images": PdfToImagesTools,
};

export function ToolImplementation({ tool }: { tool: Tool }) {
  const Component = registry[tool.slug];
  if (!Component) return <ComingSoon tool={tool} />;
  return <Component />;
}











