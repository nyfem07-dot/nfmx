import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryTile({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  const Icon = category.icon;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex items-start gap-4 overflow-hidden rounded-[14px] border border-border bg-card p-5.5 transition-all duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_14px_40px_rgba(20,30,70,0.18)]"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] border transition-all duration-200"
        style={{
          color: category.accent,
          borderColor: `${category.accent}35`,
          backgroundColor: `${category.accent}12`,
        }}
      >
        <Icon className="h-[21px] w-[21px]" strokeWidth={1.9} />
      </span>

      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: category.accent }}
            aria-hidden
          />

          <span className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
            {category.name}
          </span>
        </span>

        <span className="mt-2 block text-[0.92rem] leading-[1.6] text-ink-muted">
          {category.description}
        </span>

        <span className="mt-3 block font-data text-[0.78rem] font-medium tracking-wide text-ink-faint">
          {count === 0
            ? "Coming soon"
            : `${count} tool${count === 1 ? "" : "s"}`}
        </span>
      </span>
    </Link>
  );
}