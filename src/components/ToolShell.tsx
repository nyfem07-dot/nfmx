import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Tool } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { toolsByCategory } from "@/lib/tools";
import { StatusDot } from "./StatusDot";
import { ToolCard } from "./ToolCard";
import type { ReactNode } from "react";

function getSeoContent(tool: Tool) {
  const name = tool.name;
  const category = getCategory(tool.category);

  const cleanName = name
    .replace("What's My IP", "my IP")
    .replace(" / ", " or ");

  const intro = `${name} is a free online tool from NFMX for ${tool.shortDescription.toLowerCase()}`;

  const useCases: Record<string, string[]> = {
    images: [
      "quick image editing and preparation",
      "working with photos and graphics",
      "preparing images for websites and social media",
    ],
    pdf: [
      "working with PDF documents",
      "preparing files for sharing",
      "managing documents quickly in your browser",
    ],
    media: [
      "working with audio, video or online media",
      "preparing media files for sharing",
      "handling everyday media tasks without installing software",
    ],
    text: [
      "writing and editing text",
      "checking or transforming text",
      "working with documents, content and written data",
    ],
    internet: [
      "checking websites and internet information",
      "developer and technical workflows",
      "quick browser-based internet tasks",
    ],
    converters: [
      "converting information between formats",
      "developer and everyday file workflows",
      "quick browser-based conversions",
    ],
    privacy: [
      "checking files and security-related information",
      "developer and technical workflows",
      "processing information locally in your browser",
    ],
    social: [
      "creating social media content",
      "preparing graphics for online posts",
      "creating shareable visual content",
    ],
    calculators: [
      "quick calculations",
      "school, work and everyday tasks",
      "checking numbers without installing software",
    ],
    ai: [
      "writing and editing content",
      "summarizing and transforming text",
      "everyday productivity tasks",
    ],
  };

  const categoryUses = useCases[tool.category] ?? [
    "everyday digital tasks",
    "quick browser-based workflows",
    "working with files and information online",
  ];

  const primaryKeyword = cleanName.toLowerCase();

  return {
    intro,
    heading: `Use ${name} online`,
    paragraph: `${name} lets you ${tool.shortDescription.toLowerCase()} It is designed to be quick and straightforward, so you can complete the task directly in your browser without unnecessary setup.`,
    usesHeading: `What can you use ${name} for?`,
    uses: categoryUses,
    searchPhrase: `${primaryKeyword} online`,
    categoryName: category?.name ?? "online tools",
  };
}

export function ToolShell({
  tool,
  children,
}: {
  tool: Tool;
  children: ReactNode;
}) {
  const category = getCategory(tool.category);
  const Icon = tool.icon;

  const related = toolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3);

  const seo = getSeoContent(tool);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>

        {category && (
          <>
            <ChevronLeft
              className="h-3 w-3 rotate-180"
              strokeWidth={2}
            />

            <Link
              href={`/category/${category.slug}`}
              className="hover:text-ink"
            >
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

          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>{children}</div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-[8px] border border-border bg-paper-raised p-5">
            <h2 className="text-sm font-medium text-ink">
              How this works
            </h2>

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

      <section
        className="mt-14 border-t border-border pt-10"
        aria-labelledby="tool-guide-heading"
      >
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
            NFMX {seo.categoryName}
          </p>

          <h2
            id="tool-guide-heading"
            className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl"
          >
            {seo.heading}
          </h2>

          <p className="mt-4 text-[0.95rem] leading-7 text-ink-muted">
            {seo.paragraph}
          </p>

          <h3 className="mt-8 text-lg font-medium text-ink">
            {seo.usesHeading}
          </h3>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {seo.uses.map((use) => (
              <li
                key={use}
                className="rounded-[8px] border border-border bg-paper-raised p-4 text-sm leading-6 text-ink-muted"
              >
                {use}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-[8px] border border-border bg-paper-raised p-5">
            <h3 className="text-base font-medium text-ink">
              Why use NFMX?
            </h3>

            <p className="mt-2 text-sm leading-6 text-ink-muted">
              NFMX brings useful {seo.categoryName.toLowerCase()} tools
              together in one place. Open the tool you need, complete the
              task in your browser, and move on without unnecessary setup.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="text-xs text-ink-muted">
              Search for:
            </span>

            <span className="text-xs text-ink-muted">
              {seo.searchPhrase}
            </span>

            <span className="text-xs text-ink-muted">
              · {tool.name.toLowerCase()}
            </span>

            <span className="text-xs text-ink-muted">
              · free {seo.categoryName.toLowerCase()} tool
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

