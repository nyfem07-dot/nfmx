import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-28 text-center sm:px-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border text-ink-faint">
        <SearchX className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        That page doesn&apos;t exist. It may have moved, or the link might be off.
      </p>
      <Link
        href="/tools"
        className="mt-6 rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
      >
        Browse all tools
      </Link>
    </div>
  );
}
