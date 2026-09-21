"use client";

import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchTools } from "@/lib/tools";
import { StatusDot } from "./StatusDot";

interface SearchBoxProps {
  placeholder?: string;
  size?: "hero" | "compact";
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchBox({
  placeholder = "Search for a tool…",
  size = "compact",
  autoFocus = false,
  onNavigate,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => searchTools(query).slice(0, 6), [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToTool(slug: string) {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(`/tools/${slug}`);
  }

  function goToSearchPage() {
    if (!query.trim()) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        goToTool(results[activeIndex].slug);
      } else {
        goToSearchPage();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = size === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-[8px] border border-border-strong bg-paper-raised transition-colors focus-within:border-ink ${
          isHero ? "px-4 py-3.5" : "px-3 py-2"
        }`}
      >
        <Search
          className={`shrink-0 text-ink-faint ${isHero ? "h-5 w-5" : "h-4 w-4"}`}
          strokeWidth={1.75}
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-ink placeholder:text-ink-faint outline-none ${
            isHero ? "text-base" : "text-sm"
          }`}
        />
        {query && (
          <kbd className="hidden shrink-0 select-none rounded-[4px] border border-border px-1.5 py-0.5 font-data text-[0.65rem] text-ink-faint sm:block">
            Enter
          </kbd>
        )}
      </div>

      {open && query.trim() && (
        <div
          id={listId}
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[8px] border border-border-strong bg-paper-raised shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {results.length > 0 ? (
            <ul>
              {results.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.slug}>
                    <button
                      type="button"
                      onClick={() => goToTool(tool.slug)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 ${
                        activeIndex === i ? "bg-brass-tint" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{tool.name}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {tool.shortDescription}
                        </span>
                      </span>
                      <StatusDot status={tool.status} />
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={goToSearchPage}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs text-ink-muted hover:text-ink"
                >
                  See all results for “{query.trim()}”
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-ink-muted">
              No tools match “{query.trim()}” yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
