"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools";
import { categories } from "@/lib/categories";
import { ToolCard } from "./ToolCard";

export function ToolsDirectory({
  initialQuery = "",
  initialPopular = false,
}: {
  initialQuery?: string;
  initialPopular?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [onlyPopular] = useState(initialPopular);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (activeCategory && t.category !== activeCategory) return false;
      if (onlyPopular && !t.popular) return false;
      if (!q) return true;
      const haystack = [t.name, t.shortDescription, t.category, ...t.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeCategory, onlyPopular]);

  const live = filtered.filter((t) => t.status === "live");
  const soon = filtered.filter((t) => t.status === "soon");

  return (
    <div>
      <div className="flex items-center gap-3 rounded-[8px] border border-border-strong bg-paper-raised px-3 py-2.5 focus-within:border-ink">
        <Search className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
            activeCategory === null
              ? "border-ink bg-ink text-paper"
              : "border-border text-ink-muted hover:border-border-strong"
          }`}
        >
          All categories
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
              activeCategory === c.slug
                ? "border-ink bg-ink text-paper"
                : "border-border text-ink-muted hover:border-border-strong"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted">
          No tools match your search. Try a different word, or browse by category above.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
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
    </div>
  );
}
