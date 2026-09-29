"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  PlusCircle,
  BotMessageSquare,
  BarChart3,
  Building2,
  Sparkles,
  TrendingUp,
  X,
  Home
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  activeTab,
  onSelectTab,
}: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { id: "overview", name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { id: "feedback", name: "Feedback Stream", href: "/dashboard?tab=feedback", icon: MessageSquareQuote },
    { id: "reports", name: "VoC Reports", href: "/dashboard?tab=reports", icon: BarChart3 },
    { id: "organization", name: "Organization & RBAC", href: "/dashboard?tab=organization", icon: Building2 },
    { id: "ai_chat", name: "AI Insights Q&A", href: "/ai_chat", icon: BotMessageSquare, badge: "AI" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-zinc-800/80 bg-zinc-950/98 p-4 backdrop-blur-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col justify-between shrink-0`}
      >
        <div className="space-y-4">
          {/* Header on mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Dashboard Hub
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Back to Home Link */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800/70 bg-zinc-900/30 px-3 py-2 text-xs font-medium text-zinc-400 hover:border-red-500/30 hover:bg-zinc-900/70 hover:text-white transition-all"
          >
            <Home size={15} className="text-red-400" />
            <span>Return to Home</span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Dashboard Sections
            </p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab
                ? activeTab === item.id
                : pathname === item.href;

              return onSelectTab ? (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className={
                        isSelected
                          ? "text-red-400"
                          : "text-zinc-500 group-hover:text-red-400/80 transition-colors"
                      }
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="rounded-md bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                      {item.badge}
                    </span>
                  )}

                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  )}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className={
                        isSelected
                          ? "text-red-400"
                          : "text-zinc-500 group-hover:text-red-400/80 transition-colors"
                      }
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="rounded-md bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                      {item.badge}
                    </span>
                  )}

                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer AI Live Card */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/25 to-zinc-900/60 p-3.5 text-zinc-300">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Sentiment Live</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 leading-snug">
            Multi-tenant engine active. 2,490 records processed.
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp size={11} /> 74% Positive
            </span>
            <span className="text-zinc-500">v1.0 (PRO)</span>
          </div>
        </div>
      </aside>
    </>
  );
}
