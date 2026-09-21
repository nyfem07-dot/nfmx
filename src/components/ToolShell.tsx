import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Tool } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { toolsByCategory } from "@/lib/tools";
import { StatusDot } from "./StatusDot";
import { ToolCard } from "./ToolCard";
import type { ReactNode } from "react";

export function ToolShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  const category = getCategory(tool.category);
  const Icon = tool.icon;
  const related = toolsByCategory(tool.category).filter((t) => t.slug !== tool.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>
        {category && (
          <>
            <ChevronLeft className="h-3 w-3 rotate-180" strokeWidth={2} />
            <Link href={`/category/${category.slug}`} className="hover:text-ink">
              {category.name}
            </Link>
          </>
        )}
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-border text-ink-muted">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-medium tracking-tight text-ink">
              {tool.name}
            </h1>
            <StatusDot status={tool.status} />
          </div>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">{tool.shortDescription}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>{children}</div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-[8px] border border-border bg-paper-raised p-5">
            <h2 className="text-sm font-medium text-ink">How this works</h2>
            <p className="mt-2 text-[0.83rem] leading-relaxed text-ink-muted">
              {tool.helpText}
            </p>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-ink">
                More in {category?.name}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {related.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
