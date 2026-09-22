import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { HeroMosaic } from "@/components/HeroMosaic";
import { ToolCard } from "@/components/ToolCard";
import { CategoryTile } from "@/components/CategoryTile";
import { categories } from "@/lib/categories";
import { categoryCounts, tools } from "@/lib/tools";

const homepagePopularSlugs = [
  "compress-image",
  "image-converter",
  "color-palette",
  "pdf-merge",
  "qr-generator",
  "word-counter",
  "unit-converter",
  "password-generator",
];

export default function Home() {
  const popular = homepagePopularSlugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool) => tool !== undefined);

  const counts = categoryCounts();
  const liveCount = tools.filter((t) => t.status === "live").length;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="grid gap-14 sm:grid-cols-2 sm:items-center sm:gap-10">
          <div>
            <h1 className="font-display text-[2.8rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.6rem]">
              Everything useful, in one place.
            </h1>

            <p className="mt-5 max-w-lg text-[1.1rem] leading-[1.7] text-ink-muted">
              NFMX is a growing set of small, focused tools for images,
              PDFs, text and more — no sign-up, no clutter, and most of it
              runs right in your browser.
            </p>

            <div className="mt-8 max-w-lg">
              <SearchBox size="hero" />
            </div>

            <p className="mt-4 text-sm font-medium text-ink-faint">
              {liveCount} tools ready to use now · {tools.length - liveCount}{" "}
              more on the way
            </p>
          </div>

          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            <HeroMosaic />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[1.65rem] font-semibold tracking-tight text-ink sm:text-[1.8rem]">
              Popular tools
            </h2>

            <Link
              href="/tools"
              className="flex shrink-0 items-center gap-1.5 text-[0.95rem] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              All tools
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </Link>
          </div>

          <div className="no-scrollbar mt-7 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-[1.65rem] font-semibold tracking-tight text-ink sm:text-[1.8rem]">
            Browse by category
          </h2>

          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
            Ten categories, one growing toolkit. Tools are being added
            category by category — start wherever you need help today.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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