import * as React from "react";
import { cn } from "@/lib/utils";

export interface AudienceMeterProps {
  execPercent?: number;
  userPercent?: number;
  devPercent?: number;
  className?: string;
  showLabels?: boolean;
}

export function AudienceMeter({
  execPercent = 25,
  userPercent = 50,
  devPercent = 25,
  className,
  showLabels = true,
}: AudienceMeterProps) {
  const total = execPercent + userPercent + devPercent;
  const ePct = Math.round((execPercent / total) * 100);
  const uPct = Math.round((userPercent / total) * 100);
  const dPct = Math.round((devPercent / total) * 100);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted border border-border/50">
        <div
          style={{ width: `${ePct}%` }}
          className="bg-amber-500 transition-all duration-500"
          title={`Leadership / Executive: ${ePct}%`}
        />
        <div
          style={{ width: `${uPct}%` }}
          className="bg-emerald-500 transition-all duration-500"
          title={`End-User / Customer: ${uPct}%`}
        />
        <div
          style={{ width: `${dPct}%` }}
          className="bg-indigo-500 transition-all duration-500"
          title={`Developer / Technical: ${dPct}%`}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between items-center text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
            Exec ({ePct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            User ({uPct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
            Dev ({dPct}%)
          </span>
        </div>
      )}
    </div>
  );
}
