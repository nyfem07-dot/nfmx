import type { ToolStatus } from "@/lib/types";

export function StatusDot({ status }: { status: ToolStatus }) {
  const isLive = status === "live";
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-data text-ink-muted">
      <span
        className={`h-[6px] w-[6px] rounded-full ${
          isLive ? "bg-brass" : "bg-ink-faint"
        }`}
        aria-hidden
      />
      {isLive ? "Live" : "Coming soon"}
    </span>
  );
}
