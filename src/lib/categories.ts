import {
  Clapperboard,
  Image as ImageIcon,
  FileText,
  Globe,
  PenLine,
  RefreshCw,
  ShieldCheck,
  Share2,
  Calculator,
  Sparkles,
} from "lucide-react";
import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "media",
    name: "Media",
    description: "Compress, convert and play audio and video.",
    icon: Clapperboard,
    accent: "#8B5CF6",
  },
  {
    slug: "images",
    name: "Images",
    description: "Resize, compress and convert pictures.",
    icon: ImageIcon,
    accent: "#EC4899",
  },
  {
    slug: "pdf",
    name: "PDF & Documents",
    description: "Merge, split and shrink PDF files.",
    icon: FileText,
    accent: "#F43F5E",
  },
  {
    slug: "internet",
    name: "Internet",
    description: "Tools for links, codes and the open web.",
    icon: Globe,
    accent: "#06B6D4",
  },
  {
    slug: "text",
    name: "Text",
    description: "Clean up, count and format plain text.",
    icon: PenLine,
    accent: "#22C55E",
  },
  {
    slug: "converters",
    name: "Converters",
    description: "Switch between units, formats and currencies.",
    icon: RefreshCw,
    accent: "#3B82F6",
  },
  {
    slug: "privacy",
    name: "Privacy & Security",
    description: "Keep accounts and files safer.",
    icon: ShieldCheck,
    accent: "#14B8A6",
  },
  {
    slug: "social",
    name: "Social & Sharing",
    description: "Prepare content for sharing anywhere.",
    icon: Share2,
    accent: "#F97316",
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Quick math for everyday decisions.",
    icon: Calculator,
    accent: "#EAB308",
  },
  {
    slug: "ai",
    name: "AI Tools",
    description: "Small, focused tools powered by AI.",
    icon: Sparkles,
    accent: "#A855F7",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryToolCount(
  slug: CategorySlug,
  counts: Record<string, number>,
): number {
  return counts[slug] ?? 0;
}