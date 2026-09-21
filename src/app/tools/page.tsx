import type { Metadata } from "next";
import { ToolsDirectory } from "@/components/ToolsDirectory";

export const metadata: Metadata = {
  title: "All tools — Toolbox",
  description: "Browse every tool in Toolbox, or search to find the one you need.",
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; popular?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
        All tools
      </h1>
      <p className="mt-2 max-w-lg text-sm text-ink-muted">
        Search by name or task, or filter by category. New tools are added regularly.
      </p>
      <div className="mt-8">
        <ToolsDirectory initialQuery={params.q ?? ""} initialPopular={params.popular === "1"} />
      </div>
    </div>
  );
}
