"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Share2,
  Clock,
  CheckCircle2,
  Plus
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sampleReports = [
    {
      id: "VOC-2026-W39",
      title: "Weekly Voice of Customer (VoC) Intelligence Brief",
      period: "Sep 22 - Sep 29, 2026",
      sentimentScore: "78% Positive",
      totalFeedback: "1,240 records",
      topTheme: "UI Responsiveness & Performance",
      status: "Ready",
      generatedBy: "AI Automated Engine",
    },
    {
      id: "VOC-2026-M09",
      title: "Monthly Product Quality & Sentiment Diagnostic",
      period: "Sep 01 - Sep 29, 2026",
      sentimentScore: "72% Positive",
      totalFeedback: "5,410 records",
      topTheme: "Billing Tiers & Mobile Stability",
      status: "Ready",
      generatedBy: "Sheikh Siam",
    },
    {
      id: "VOC-2026-Q3",
      title: "Q3 Executive Stakeholder Feedback Analysis",
      period: "Jul 01 - Sep 29, 2026",
      sentimentScore: "74% Positive",
      totalFeedback: "14,820 records",
      topTheme: "Enterprise RBAC Adoption",
      status: "Ready",
      generatedBy: "AI Automated Engine",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Voice of Customer
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                VoC Reports & Insights
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Automated executive summaries and sentiment diagnostics ready for export.
              </p>
            </div>

            <button
              onClick={() => alert("Generating automated AI VoC report...")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Generate AI Report</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase text-zinc-500">Reports Generated</span>
              <p className="mt-2 text-2xl font-bold text-white">48</p>
              <p className="text-[11px] text-zinc-400 mt-1">+12 this month</p>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase text-zinc-500">Avg Sentiment Score</span>
              <p className="mt-2 text-2xl font-bold text-emerald-400">74.6%</p>
              <p className="text-[11px] text-zinc-400 mt-1">Consistent positive trajectory</p>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase text-zinc-500">Feedback Analyzed</span>
              <p className="mt-2 text-2xl font-bold text-white">21,470</p>
              <p className="text-[11px] text-zinc-400 mt-1">Multi-channel ingestion</p>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {sampleReports.map((report) => (
              <div
                key={report.id}
                className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm transition-all hover:border-red-500/40 hover:bg-zinc-900/70"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-red-600/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                        {report.id}
                      </span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar size={12} /> {report.period}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Primary Theme: <span className="text-zinc-200">{report.topTheme}</span> • Volume:{" "}
                      <span className="text-zinc-200">{report.totalFeedback}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
                      {report.sentimentScore}
                    </span>
                    <button
                      onClick={() => alert(`Downloading PDF for ${report.id}`)}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-red-500/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
