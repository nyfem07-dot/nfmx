import type { LucideIcon } from "lucide-react";

export type CategorySlug =
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

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export type ToolStatus = "live" | "soon";

export interface Tool {
  slug: string;
  name: string;
  shortDescription: string;
  helpText: string;
  category: CategorySlug;
  icon: LucideIcon;
  status: ToolStatus;
  keywords: string[];
  popular?: boolean;
}
