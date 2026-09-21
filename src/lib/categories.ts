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
    accent: "#6C6FC4",
  },
  {
    slug: "images",
    name: "Images",
    description: "Resize, compress and convert pictures.",
    icon: ImageIcon,
    accent: "#C08A3E",
  },
  {
    slug: "pdf",
    name: "PDF & Documents",
    description: "Merge, split and shrink PDF files.",
    icon: FileText,
    accent: "#B0533F",
  },
  {
    slug: "internet",
    name: "Internet",
    description: "Tools for links, codes and the open web.",
    icon: Globe,
    accent: "#3E8FB0",
  },
  {
    slug: "text",
    name: "Text",
    description: "Clean up, count and format plain text.",
    icon: PenLine,
    accent: "#4F8B5B",
  },
  {
    slug: "converters",
    name: "Converters",
    description: "Switch between units, formats and currencies.",
    icon: RefreshCw,
    accent: "#8A7BC0",
  },
  {
    slug: "privacy",
    name: "Privacy & Security",
    description: "Keep accounts and files safer.",
    icon: ShieldCheck,
    accent: "#3E6E8E",
  },
  {
    slug: "social",
    name: "Social & Sharing",
    description: "Prepare content for sharing anywhere.",
    icon: Share2,
    accent: "#C4667E",
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Quick math for everyday decisions.",
    icon: Calculator,
    accent: "#6E8C4A",
  },
  {
    slug: "ai",
    name: "AI Tools",
    description: "Small, focused tools powered by AI.",
    icon: Sparkles,
    accent: "#A0522D",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryToolCount(
  slug: CategorySlug,
  counts: Record<string, number>
): number {
  return counts[slug] ?? 0;
}
