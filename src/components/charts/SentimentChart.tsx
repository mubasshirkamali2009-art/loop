"use client";

import { useMemo } from "react";

interface SentimentChartProps {
  positive?: number;
  neutral?: number;
  negative?: number;
}

export default function SentimentChart({
  positive = 65,
  neutral = 20,
  negative = 15,
}: SentimentChartProps) {
  const total = useMemo(() => {
    const sum = positive + neutral + negative;
    return sum === 0 ? 1 : sum;
  }, [positive, neutral, negative]);

  const pPct = Math.round((positive / total) * 100);
  const nPct = Math.round((neutral / total) * 100);
  const negPct = 100 - pPct - nPct;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-800 p-0.5">
        <div
          style={{ width: `${pPct}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-500"
          title={`Positive: ${pPct}%`}
        />
        <div
          style={{ width: `${nPct}%` }}
          className="h-full bg-zinc-500 transition-all duration-500"
          title={`Neutral: ${nPct}%`}
        />
        <div
          style={{ width: `${negPct}%` }}
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-full transition-all duration-500"
          title={`Negative: ${negPct}%`}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5">
          <p className="text-zinc-400 text-[11px] font-medium">Positive</p>
          <p className="text-base font-bold text-emerald-400 mt-0.5">{pPct}%</p>
        </div>
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/40 p-2.5">
          <p className="text-zinc-400 text-[11px] font-medium">Neutral</p>
          <p className="text-base font-bold text-zinc-300 mt-0.5">{nPct}%</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-2.5">
          <p className="text-zinc-400 text-[11px] font-medium">Negative</p>
          <p className="text-base font-bold text-red-400 mt-0.5">{negPct}%</p>
        </div>
      </div>
    </div>
  );
}
