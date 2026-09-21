import { Wrench } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-ink text-paper dark:bg-ink dark:text-paper">
        <Wrench className="h-4 w-4" strokeWidth={2.25} />
      </span>

      <span className="font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">
        NFMX
      </span>
    </span>
  );
}