"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Sparkles,
  Tag,
  Building2,
  Mail,
  User,
  Share2,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // In production this can fetch from /api/feedback/[id] or fallback
  const feedback = {
    id: resolvedParams.id,
    customer: "Elena Rostova",
    email: "elena@cloudtech.io",
    org: "CloudTech Inc",
    channel: "In-App Widget",
    sentiment: "POSITIVE",
    score: 96,
    theme: "AI Summaries & Automation",
    date: "Sep 29, 2026 • 14:32 UTC",
    text: "The automated VoC report generated yesterday highlighted our onboarding drop-off within seconds. The executive team was able to pinpoint the signup flow latency and ship a hotfix within 2 hours. Truly transformative software.",
    aiSummary: "Customer highly praises automated VoC reporting speed and direct business impact on diagnosing onboarding drop-off.",
    metadata: {
      browser: "Chrome 128 / macOS",
      sessionId: "sess_91820afbc8172",
      responseTime: "180ms",
      tenantId: "org_cloudtech_prod",
    },
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Back link */}
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to all feedback
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-red-600/20 px-2 py-0.5 text-xs font-bold text-red-400 border border-red-500/30">
                  {feedback.id}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    feedback.sentiment === "POSITIVE"
                      ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-400"
                      : "border-red-500/30 bg-red-950/30 text-red-400"
                  }`}
                >
                  {feedback.sentiment} ({feedback.score}%)
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">Feedback Record Details</h1>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Calendar size={13} /> {feedback.date}
              </p>
            </div>

            <button
              onClick={() => alert("Copied feedback permalink to clipboard!")}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer w-fit"
            >
              <Share2 size={14} />
              <span>Share Permlink</span>
            </button>
          </div>

          {/* Feedback Content Box */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Customer Message
            </h2>
            <p className="text-base text-zinc-200 leading-relaxed italic bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/60">
              &quot;{feedback.text}&quot;
            </p>

            {/* AI Analysis Summary */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
                <Sparkles size={14} /> AI Synthesis
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {feedback.aiSummary}
              </p>
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Customer Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500 flex items-center gap-1.5"><User size={13} /> Customer:</span>
                  <span className="text-white font-semibold">{feedback.customer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Mail size={13} /> Email:</span>
                  <span className="text-zinc-300">{feedback.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Building2 size={13} /> Company:</span>
                  <span className="text-zinc-300">{feedback.org}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Tag size={13} /> Channel:</span>
                  <span className="text-zinc-300">{feedback.channel}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Technical Context
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Browser / OS:</span>
                  <span className="text-zinc-300">{feedback.metadata.browser}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Session ID:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">{feedback.metadata.sessionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Response Latency:</span>
                  <span className="text-emerald-400 font-semibold">{feedback.metadata.responseTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Tenant ID:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">{feedback.metadata.tenantId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
