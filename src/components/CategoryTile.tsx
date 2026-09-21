import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryTile({ category, count }: { category: Category; count: number }) {
  const Icon = category.icon;
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex items-start gap-3 rounded-[8px] border border-border bg-paper-raised p-4 transition-colors hover:border-border-strong"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-border text-ink-muted transition-colors group-hover:border-border-strong group-hover:text-ink"
        style={{ boxShadow: `inset 0 0 0 1px transparent` }}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span
            className="h-[7px] w-[7px] shrink-0 rounded-full"
            style={{ backgroundColor: category.accent }}
            aria-hidden
          />
          <span className="text-sm font-medium text-ink">{category.name}</span>
        </span>
        <span className="mt-1 block text-[0.8rem] leading-snug text-ink-muted">
          {category.description}
        </span>
        <span className="mt-2 block font-data text-[0.7rem] text-ink-faint">
          {count === 0 ? "Coming soon" : `${count} tool${count === 1 ? "" : "s"}`}
        </span>
      </span>
    </Link>
  );
}
