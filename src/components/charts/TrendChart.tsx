"use client";

interface TrendPoint {
  date: string;
  sentiment: number;
}

interface TrendChartProps {
  data?: TrendPoint[];
}

export default function TrendChart({
  data = [
    { date: "Mon", sentiment: 68 },
    { date: "Tue", sentiment: 72 },
    { date: "Wed", sentiment: 65 },
    { date: "Thu", sentiment: 80 },
    { date: "Fri", sentiment: 78 },
    { date: "Sat", sentiment: 84 },
    { date: "Sun", sentiment: 82 },
  ],
}: TrendChartProps) {
  const max = 100;
  const min = 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex h-40 items-end justify-between gap-2 pt-4 px-2">
        {data.map((point, idx) => {
          const heightPct = Math.max(10, Math.min(100, point.sentiment));
          return (
            <div key={idx} className="flex flex-1 flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {point.sentiment}%
              </span>
              <div className="w-full max-w-[32px] rounded-t-lg bg-zinc-800/80 group-hover:bg-red-500/20 p-0.5 transition-all">
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-red-600 to-red-400 transition-all duration-500 group-hover:from-red-500 group-hover:to-red-300"
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-500">{point.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
