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
  const total = execPercent + userPercent + devPercent || 1;
  const ePct = Math.round((execPercent / total) * 100);
  const uPct = Math.round((userPercent / total) * 100);
  const dPct = Math.round((devPercent / total) * 100);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f0] dark:bg-[#1a1a1a]">
        <div
          style={{ width: `${ePct}%` }}
          className="bg-[#bd5200] transition-all duration-300"
          title={`Executive / Leadership: ${ePct}%`}
        />
        <div
          style={{ width: `${uPct}%` }}
          className="bg-[#00876c] transition-all duration-300"
          title={`End-User / Customer: ${uPct}%`}
        />
        <div
          style={{ width: `${dPct}%` }}
          className="bg-[#0070f3] transition-all duration-300"
          title={`Developer / Engineering: ${dPct}%`}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between items-center text-[11px] font-mono text-[#666666] dark:text-[#888888]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#bd5200] inline-block" />
            Exec {ePct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00876c] inline-block" />
            User {uPct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0070f3] inline-block" />
            Dev {dPct}%
          </span>
        </div>
      )}
    </div>
  );
}
