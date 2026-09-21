import type { Metadata } from "next";
import { CategoryTile } from "@/components/CategoryTile";
import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Categories — Toolbox",
  description: "Browse Toolbox's ten tool categories.",
};

export default function CategoryIndexPage() {
  const counts = categoryCounts();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
        Categories
      </h1>
      <p className="mt-2 max-w-lg text-sm text-ink-muted">
        Every tool in Toolbox belongs to one of these ten groups.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile
            key={category.slug}
            category={category}
            count={counts[category.slug] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
