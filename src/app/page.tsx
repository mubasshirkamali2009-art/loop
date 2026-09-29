"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquareQuote,
  ShieldCheck,
  BotMessageSquare,
  BarChart3,
  Layers,
  ChevronRight,
  Building2,
  CheckCircle2,
  FileText
} from "lucide-react";
import KpiCard from "@/components/Kpicard";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950">
      {/* Background Red Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-red-600/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[500px] w-[600px] bg-red-900/15 blur-[160px] rounded-full" />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="flex flex-col items-center text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-4 py-1.5 text-xs font-semibold text-red-400 backdrop-blur-md mb-8">
            <Sparkles size={14} className="text-red-400 animate-pulse" />
            <span>LOOP AI Intelligence v1.0 • Zidio Development</span>
            <ChevronRight size={14} className="text-red-400/70" />
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            Turn Unstructured Feedback Into{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              Decisive Business Action
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg sm:leading-relaxed">
            LOOP uses advanced AI sentiment analysis, automated theme detection, and interactive Q&A to help organizations uncover critical customer insights in seconds.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/70 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all hover:scale-105"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/feedback/new"
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-sm hover:border-red-500/40 hover:bg-zinc-900 hover:text-white transition-all"
            >
              <MessageSquareQuote size={16} className="text-red-400" />
              <span>Submit Feedback</span>
            </Link>

            <Link
              href="/ai_chat"
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-950/20 px-6 py-3.5 text-sm font-semibold text-red-400 backdrop-blur-sm hover:bg-red-950/40 transition-all"
            >
              <BotMessageSquare size={16} />
              <span>Ask AI Insights</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-red-500" />
              <span>Multi-Tenant RBAC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-red-500" />
              <span>Automated Sentiment Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-red-500" />
              <span>Voice of Customer (VoC) Reports</span>
            </div>
          </div>
        </div>

        {/* Live KPI Grid Showcase */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Feedback Volume"
            value="14,820"
            change="+18.4%"
            changeType="increase"
            subtitle="Analyzed this month"
            icon={MessageSquareQuote}
            badge="LIVE"
          />
          <KpiCard
            title="Positive Sentiment"
            value="74.2%"
            change="+4.1%"
            changeType="increase"
            subtitle="Overall customer mood"
            icon={TrendingUp}
            badge="OPTIMAL"
          />
          <KpiCard
            title="Active Themes Detected"
            value="38"
            change="+6 new"
            changeType="neutral"
            subtitle="Clustered by AI"
            icon={Layers}
            badge="AI NLP"
          />
          <KpiCard
            title="VoC Reports Generated"
            value="142"
            change="+28%"
            changeType="increase"
            subtitle="Executive summaries"
            icon={FileText}
            badge="AUTOMATED"
          />
        </div>

        {/* Interactive Platform Preview Panel */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-lg font-bold text-white">Live Feedback Stream & Sentiment Engine</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time ingestion and neural sentiment classification across channels.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-red-500/20 bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-400">
                Tenant: Acme Global
              </span>
            </div>
          </div>

          {/* Sample feedback feed */}
          <div className="mt-6 space-y-3">
            {[
              {
                author: "Sarah Lin (Enterprise Client)",
                source: "Zendesk",
                sentiment: "POSITIVE",
                sentimentScore: "94%",
                theme: "UI Performance",
                comment:
                  "The recent dashboard refresh has sped up our team review workflows by 3x. The AI sentiment breakdown is remarkably accurate!",
                time: "5 minutes ago",
                color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
              },
              {
                author: "Marcus Vance",
                source: "Email Survey",
                sentiment: "NEUTRAL",
                sentimentScore: "52%",
                theme: "Pricing Model",
                comment:
                  "Feature set is great, but would love to see more granular seat-based billing for smaller sub-teams.",
                time: "24 minutes ago",
                color: "text-amber-400 border-amber-500/30 bg-amber-950/20",
              },
              {
                author: "Devon Kelly",
                source: "Mobile In-App",
                sentiment: "NEGATIVE",
                sentimentScore: "18%",
                theme: "Export Bug",
                comment:
                  "PDF report export hung on page 4 when exporting reports with over 500 records. Please investigate.",
                time: "1 hour ago",
                color: "text-red-400 border-red-500/30 bg-red-950/20",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/50 p-4 transition-all hover:border-red-500/30 hover:bg-zinc-950/80"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">{item.author}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      via {item.source}
                    </span>
                    <span className="text-[11px] text-zinc-500">• {item.time}</span>
                  </div>
                  <p className="text-xs text-zinc-300 sm:text-sm">{item.comment}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
                    {item.theme}
                  </span>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${item.color}`}
                  >
                    {item.sentiment} ({item.sentimentScore})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineered for Enterprise Customer Intelligence
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              A comprehensive toolkit for product managers, CX leaders, and customer analysts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-red-500/40 hover:bg-zinc-900/70 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">AI Theme & Topic Clustering</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Automatically extracts high-frequency topics, customer concerns, and sentiment polarity across large feedback datasets.
              </p>
            </div>

            <div className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-red-500/40 hover:bg-zinc-900/70 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-105 transition-transform">
                <BotMessageSquare size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Natural Language AI Q&A</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Ask questions like &quot;What are customers complaining about regarding mobile checkouts?&quot; and receive instant data-backed answers.
              </p>
            </div>

            <div className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-red-500/40 hover:bg-zinc-900/70 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:scale-105 transition-transform">
                <BarChart3 size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Automated VoC Reports</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Generate Voice of Customer reports with sentiment distributions, key customer quotes, and recommendations ready for stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
