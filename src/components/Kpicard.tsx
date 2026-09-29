"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon: Icon,
  badge,
}: KpiCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:bg-zinc-900/70 hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.2)]">
      {/* Subtle background red glow on hover */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-600/5 blur-2xl group-hover:bg-red-600/15 transition-all duration-500" />

      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400 transition-colors group-hover:border-red-500/30 group-hover:text-red-400">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="relative mt-4 flex items-baseline justify-between">
        <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          {value}
        </p>

        {change && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              changeType === "increase"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : changeType === "decrease"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {changeType === "increase" && <TrendingUp size={12} />}
            {changeType === "decrease" && <TrendingDown size={12} />}
            {changeType === "neutral" && <Minus size={12} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="relative mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-3 text-xs">
          {subtitle && <span className="text-zinc-500">{subtitle}</span>}
          {badge && (
            <span className="rounded-md bg-red-950/40 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
