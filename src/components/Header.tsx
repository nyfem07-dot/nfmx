"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/category", label: "Categories" },
  { href: "/tools?popular=1", label: "Popular" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">
          <SearchBox size="compact" />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-border text-ink-muted hover:border-border-strong hover:text-ink md:hidden"
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-border text-ink-muted hover:border-border-strong hover:text-ink md:hidden"
          >
            {mobileOpen ? (
              <X className="h-[17px] w-[17px]" strokeWidth={1.75} />
            ) : (
              <Menu className="h-[17px] w-[17px]" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-5 py-3 md:hidden">
          <SearchBox size="compact" autoFocus onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col border-t border-border px-5 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-border py-3 text-sm text-ink-muted last:border-b-0 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
