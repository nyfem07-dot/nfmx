import Link from "next/link";
import type { Tool } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { StatusDot } from "./StatusDot";

export function ToolCard({
  tool,
  compact = false,
}: {
  tool: Tool;
  compact?: boolean;
}) {
  const Icon = tool.icon;
  const category = getCategory(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex flex-col gap-5 overflow-hidden rounded-[14px] border border-border bg-card p-5.5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_14px_45px_rgba(40,60,150,0.18)] ${
        compact ? "min-w-[250px] shrink-0" : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-primary/20 bg-primary/10 text-primary transition-all duration-200 group-hover:border-primary/35 group-hover:bg-primary/15 group-hover:text-primary">
          <Icon className="h-[21px] w-[21px]" strokeWidth={1.9} />
        </span>

        <StatusDot status={tool.status} />
      </div>

      <div>
        <h3 className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
          {tool.name}
        </h3>

        <p className="mt-2 text-[0.92rem] leading-[1.6] text-ink-muted">
          {tool.shortDescription}
        </p>
      </div>

      {category && (
        <span className="mt-auto text-[0.78rem] font-medium tracking-wide text-ink-faint">
          {category.name}
        </span>
      )}
    </Link>
  );
}