import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { HeroMosaic } from "@/components/HeroMosaic";
import { ToolCard } from "@/components/ToolCard";
import { CategoryTile } from "@/components/CategoryTile";
import { categories } from "@/lib/categories";
import { popularTools, categoryCounts, tools } from "@/lib/tools";

export default function Home() {
  const popular = popularTools();
  const counts = categoryCounts();
  const liveCount = tools.filter((t) => t.status === "live").length;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 sm:items-center sm:gap-8">
          <div>
            <h1 className="font-display text-[2.4rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-[3rem]">
              Everything useful, in one place.
            </h1>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-muted">
              Toolbox is a growing set of small, focused tools for images, PDFs,
              text and more — no sign-up, no clutter, and most of it runs right
              in your browser.
            </p>
            <div className="mt-7 max-w-md">
              <SearchBox size="hero" />
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              {liveCount} tools ready to use now · {tools.length - liveCount} more on the way
            </p>
          </div>

          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            <HeroMosaic />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-medium tracking-tight text-ink">
              Popular tools
            </h2>
            <Link
              href="/tools"
              className="flex shrink-0 items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
              All tools
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-xl font-medium tracking-tight text-ink">
            Browse by category
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink-muted">
            Ten categories, one growing toolkit. Tools are being added
            category by category — start wherever you need help today.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryTile
                key={category.slug}
                category={category}
                count={counts[category.slug] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
