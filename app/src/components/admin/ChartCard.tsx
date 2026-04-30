import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  height?: string;
  action?: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  className,
  height,
  action,
}: ChartCardProps) {
  // Use responsive height: default to 200px mobile, 300px desktop
  const chartHeight = height || "h-[200px] sm:h-[250px] lg:h-[300px]";

  return (
    <div
      className={cn(
        "bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5 hover:border-gold/15 transition-all duration-300 w-full",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0 ml-3">{action}</div>}
      </div>
      <div className={cn("w-full", chartHeight)}>{children}</div>
    </div>
  );
}
