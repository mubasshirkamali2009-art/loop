"use client";

interface ThemeItem {
  theme: string;
  count: number;
}

interface ThemeChartProps {
  themes?: ThemeItem[];
}

export default function ThemeChart({
  themes = [
    { theme: "UI & Usability", count: 42 },
    { theme: "Performance", count: 28 },
    { theme: "Pricing & Billing", count: 18 },
    { theme: "Integrations", count: 12 },
  ],
}: ThemeChartProps) {
  const max = Math.max(...themes.map((t) => t.count), 1);

  return (
    <div className="space-y-3 w-full">
      {themes.map((item, idx) => {
        const pct = Math.round((item.count / max) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-zinc-300">{item.theme}</span>
              <span className="font-semibold text-red-400">{item.count} items</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
              <div
                style={{ width: `${pct}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
