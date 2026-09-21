import Link from "next/link";
import { Logo } from "./Logo";
import { categories } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-ink-muted">
              Everyday internet tools, kept in one honest, fast, ad-free place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
            <div>
              <h3 className="text-xs font-medium text-ink-muted">Browse</h3>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <Link href="/tools" className="text-sm text-ink-muted hover:text-ink">
                    All tools
                  </Link>
                </li>
                <li>
                  <Link href="/category" className="text-sm text-ink-muted hover:text-ink">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/tools?popular=1" className="text-sm text-ink-muted hover:text-ink">
                    Popular tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium text-ink-muted">Categories</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {categories.slice(0, 4).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/category/${c.slug}`}
                      className="text-sm text-ink-muted hover:text-ink"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Toolbox. Built for the browser.</p>
          <p>Most tools run entirely on your device — files aren&apos;t uploaded anywhere.</p>
        </div>
      </div>
    </footer>
  );
}
