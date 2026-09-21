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
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.95rem] font-medium text-ink-muted transition-colors hover:text-ink"
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
            className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink md:hidden"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink md:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.9} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.9} />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-5 py-3 md:hidden">
          <SearchBox
            size="compact"
            autoFocus
            onNavigate={() => setSearchOpen(false)}
          />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col border-t border-border px-5 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-border py-3.5 text-[0.95rem] font-medium text-ink-muted last:border-b-0 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
