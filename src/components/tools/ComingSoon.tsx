import { Construction, Bell } from "lucide-react";
import type { Tool } from "@/lib/types";
import { Workspace } from "./shared";

export function ComingSoon({ tool }: { tool: Tool }) {
  return (
    <Workspace>
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border text-ink-faint">
          <Construction className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{tool.name} isn&apos;t built yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">{tool.helpText}</p>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
          <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
          It&apos;s on the roadmap — check the tools list for what&apos;s live today.
        </p>
      </div>
    </Workspace>
  );
}
