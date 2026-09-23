import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://nfmx.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "NFMX — Free Online Tools",
    template: "%s | NFMX",
  },

  description:
    "NFMX is a fast collection of free online tools for images, PDFs, text, media, converters, internet utilities, developer tools and more.",

  applicationName: "NFMX",

  keywords: [
    "NFMX",
    "free online tools",
    "online tools",
    "image tools",
    "PDF tools",
    "text tools",
    "developer tools",
    "internet tools",
    "file tools",
    "converters",
  ],

  authors: [{ name: "NFMX" }],
  creator: "NFMX",
  publisher: "NFMX",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "NFMX",
    title: "NFMX — Free Online Tools",
    description:
      "Fast, focused online tools for images, PDFs, text, media, converters, internet utilities and more.",
  },

  twitter: {
    card: "summary_large_image",
    title: "NFMX — Free Online Tools",
    description:
      "Fast, focused online tools for images, PDFs, text, media, converters and more.",
  },

  manifest: "/manifest.json",

  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },

  appleWebApp: {
    capable: true,
    title: "NFMX",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
