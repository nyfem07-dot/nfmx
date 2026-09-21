import Link from "next/link";
import type { Tool } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { StatusDot } from "./StatusDot";

export function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  const Icon = tool.icon;
  const category = getCategory(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex flex-col gap-3 rounded-[8px] border border-border bg-paper-raised p-4 transition-colors hover:border-border-strong ${
        compact ? "min-w-[220px] shrink-0" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-border text-ink-muted transition-colors group-hover:border-border-strong group-hover:text-ink">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <StatusDot status={tool.status} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-ink">{tool.name}</h3>
        <p className="mt-1 text-[0.8rem] leading-snug text-ink-muted">
          {tool.shortDescription}
        </p>
      </div>
      {category && (
        <span className="mt-auto text-[0.7rem] text-ink-faint">{category.name}</span>
      )}
    </Link>
  );
}
