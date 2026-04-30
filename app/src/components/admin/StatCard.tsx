import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: React.ElementType;
  color: "gold" | "teal" | "emerald" | "copper";
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isPositive = change >= 0;

  const colorClasses = {
    gold: {
      bg: "bg-gold/15",
      icon: "text-gold",
    },
    teal: {
      bg: "bg-emerald-light/15",
      icon: "text-emerald-light",
    },
    emerald: {
      bg: "bg-emerald/20",
      icon: "text-emerald-light",
    },
    copper: {
      bg: "bg-copper/15",
      icon: "text-copper",
    },
  };

  // Animate count-up for numeric values
  useEffect(() => {
    const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return;
    const duration = 1500;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(num, increment * step);
      setDisplayValue(Math.floor(current));
      if (step >= steps) {
        setDisplayValue(num);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formattedValue = typeof value === "string" && (value.startsWith("$") || value.startsWith("₨"))
    ? `₨${displayValue.toLocaleString()}`
    : displayValue.toLocaleString();

  return (
    <div className="bg-[#ffffff08] backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5 lg:p-6 hover:border-gold/20 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-white/50 font-medium mb-1.5 sm:mb-2 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-outfit font-bold text-white truncate">
            {typeof value === "string" && !/^\d/.test(value) ? formattedValue : displayValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded",
                isPositive
                  ? "text-emerald-light bg-emerald/20"
                  : "text-red-400 bg-red-500/10"
              )}
            >
              {isPositive ? (
                <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              ) : (
                <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              )}
              {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span className="text-[10px] sm:text-xs text-white/40 truncate">{changeLabel}</span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center shrink-0 ml-3",
            colorClasses[color].bg
          )}
        >
          <Icon className={cn("w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5", colorClasses[color].icon)} />
        </div>
      </div>
    </div>
  );
}
