import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTool, tools } from "@/lib/tools";
import { ToolShell } from "@/components/ToolShell";
import { ToolImplementation } from "@/components/ToolRegistry";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return {};

  return {
    title: `${tool.name} — NFMX`,
    description: tool.shortDescription,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return (
    <ToolShell tool={tool}>
      <ToolImplementation tool={tool} />
    </ToolShell>
  );
}