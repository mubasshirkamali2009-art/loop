"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  Share2,
  TrendingUp,
  BarChart3,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SentimentChart from "@/components/charts/SentimentChart";
import ThemeChart from "@/components/charts/ThemeChart";
import TrendChart from "@/components/charts/TrendChart";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const report = {
    id: resolvedParams.id,
    title: "Voice of Customer (VoC) Intelligence & Diagnostics Brief",
    period: "Sep 22 - Sep 29, 2026",
    status: "Published",
    totalFeedback: 1240,
    positiveRate: 78,
    topTheme: "UI Responsiveness & Performance",
    executiveSummary:
      "Across 1,240 ingested feedback entries, customer satisfaction is trending positively at 78%. Key delight factors include our new real-time analytics dashboards and AI clustering speed. The primary friction points identified center around CSV/PDF export timeouts during high-load intervals.",
    keyActionItems: [
      "Optimize background workers for CSV and PDF bulk report exports.",
      "Expand sub-team granular billing configurations for Enterprise customers.",
      "Continue promoting positive UI themes in upcoming release communications.",
    ],
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Back link */}
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to all reports
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-red-600/20 px-2 py-0.5 text-xs font-bold text-red-400 border border-red-500/30">
                  {report.id}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  {report.status}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">{report.title}</h1>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Calendar size={13} /> {report.period} • {report.totalFeedback.toLocaleString()} feedback items analyzed
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert(`Exporting ${report.id} PDF...`)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <Sparkles size={15} /> Executive AI Summary
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Breakdown */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-sm font-bold text-white">Sentiment Distribution</h2>
              <SentimentChart positive={78} neutral={14} negative={8} />
            </div>

            {/* Recurring Themes */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-sm font-bold text-white">Top Identified Themes</h2>
              <ThemeChart />
            </div>
          </div>

          {/* Sentiment Trend */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white">7-Day Sentiment Velocity</h2>
            <TrendChart />
          </div>

          {/* Recommended Action Items */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-3">
            <h2 className="text-sm font-bold text-white">Recommended Strategic Next Steps</h2>
            <div className="space-y-2">
              {report.keyActionItems.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3 text-xs text-zinc-300"
                >
                  <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
