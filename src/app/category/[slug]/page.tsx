import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategory, categories } from "@/lib/categories";
import { toolsByCategory } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Toolbox`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const categoryTools = toolsByCategory(category.slug);
  const live = categoryTools.filter((t) => t.status === "live");
  const soon = categoryTools.filter((t) => t.status === "soon");
  const Icon = category.icon;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Link
        href="/category"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Categories
      </Link>

      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border text-ink-muted">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
            {category.name}
          </h1>
          <p className="text-sm text-ink-muted">{category.description}</p>
        </div>
      </div>

      {categoryTools.length === 0 ? (
        <p className="mt-10 max-w-md text-sm text-ink-muted">
          No tools have shipped in this category yet. It&apos;s on the roadmap —
          check back soon, or browse everything already available.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {live.length > 0 && (
            <div>
              <h2 className="font-display text-base font-medium text-ink">
                Ready to use <span className="font-data text-sm text-ink-faint">({live.length})</span>
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {live.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          )}
          {soon.length > 0 && (
            <div>
              <h2 className="font-display text-base font-medium text-ink">
                Coming soon <span className="font-data text-sm text-ink-faint">({soon.length})</span>
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {soon.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {categoryTools.length === 0 && (
        <Link
          href="/tools"
          className="mt-4 inline-flex items-center gap-1 text-sm text-brass hover:underline"
        >
          Browse all tools
        </Link>
      )}
    </div>
  );
}
