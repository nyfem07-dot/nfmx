import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTool, tools } from "@/lib/tools";
import { ToolShell } from "@/components/ToolShell";
import { ToolImplementation } from "@/components/ToolRegistry";

const siteUrl = "https://nfmx.vercel.app";

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

  const title = `${tool.name} — Free Online Tool | NFMX`;
  const description = tool.shortDescription;

  return {
    title,
    description,

    keywords: [
      tool.name,
      `${tool.name} online`,
      `${tool.name} free`,
      "NFMX",
      "free online tools",
      ...(tool.keywords ?? []),
    ],

    alternates: {
      canonical: `/tools/${tool.slug}`,
    },

    openGraph: {
      type: "website",
      url: `${siteUrl}/tools/${tool.slug}`,
      siteName: "NFMX",
      title,
      description,
    },

    twitter: {
      card: "summary",
      title,
      description,
    },

    robots: {
      index: tool.status === "live",
      follow: true,
      googleBot: {
        index: tool.status === "live",
        follow: true,
      },
    },
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

  const toolUrl = `${siteUrl}/tools/${tool.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: toolUrl,
    description: tool.shortDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "NFMX",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ToolShell tool={tool}>
        <ToolImplementation tool={tool} />
      </ToolShell>
    </>
  );
}