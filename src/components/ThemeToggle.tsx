"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate, recommended by next-themes
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink cursor-pointer"
    >
      {mounted && isDark ? (
        <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[17px] w-[17px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
