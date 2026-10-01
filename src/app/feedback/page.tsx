"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquareQuote,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function FeedbackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const feedbackData = [
    {
      id: "FB-001",
      customer: "Alex Morgan",
      email: "alex@fintech.io",
      channel: "In-App",
      theme: "Performance",
      sentiment: "POSITIVE",
      score: 95,
      date: "Today, 14:22",
      text: "The real-time theme clustering is a game changer for our CX team. We spotted an issue within minutes of deployment.",
    },
    {
      id: "FB-002",
      customer: "Rachel Green",
      email: "rachel@retailhub.com",
      channel: "Zendesk",
      theme: "Billing",
      sentiment: "NEUTRAL",
      score: 50,
      date: "Today, 12:05",
      text: "Invoices should specify sub-team breakdown instead of a single total line item.",
    },
    {
      id: "FB-003",
      customer: "Liam O'Connor",
      email: "liam@techbridge.co",
      channel: "Intercom",
      theme: "Exports",
      sentiment: "NEGATIVE",
      score: 18,
      date: "Yesterday",
      text: "PDF report export failed twice on larger datasets. Please resolve.",
    },
    {
      id: "FB-004",
      customer: "Sophia Patel",
      email: "sophia@datastream.ai",
      channel: "Email",
      theme: "AI Insights",
      sentiment: "POSITIVE",
      score: 98,
      date: "Yesterday",
      text: "The Q&A assistant answers complex inquiries about user pain points flawlessly.",
    },
  ];

  const filtered = feedbackData.filter((item) => {
    const matchesSentiment = selectedSentiment === "ALL" || item.sentiment === selectedSentiment;
    const matchesSearch =
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.theme.toLowerCase().includes(search.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Feedback Records
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Customer Feedback Stream
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Explore, filter, and review analyzed customer feedback records across all channels.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/ai_chat"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Submit / Analyze Feedback</span>
              </Link>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by customer, theme, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/70 p-1 text-xs">
                {["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedSentiment(st)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      selectedSentiment === st
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records Table / List */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/feedback/${item.id}`}
                className="block group rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-5 backdrop-blur-sm transition-all hover:border-red-500/40 hover:bg-zinc-900/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-white">
                      {item.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.customer}</p>
                      <p className="text-[11px] text-zinc-500">{item.email} • {item.channel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                      {item.theme}
                    </span>
                    <span
                      className={`rounded-md px-2.5 py-1 text-[11px] font-bold border ${
                        item.sentiment === "POSITIVE"
                          ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-400"
                          : item.sentiment === "NEGATIVE"
                          ? "border-red-500/30 bg-red-950/30 text-red-400"
                          : "border-amber-500/30 bg-amber-950/30 text-amber-400"
                      }`}
                    >
                      {item.sentiment} ({item.score}%)
                    </span>
                    <span className="text-[11px] text-zinc-500">{item.date}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  &quot;{item.text}&quot;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
