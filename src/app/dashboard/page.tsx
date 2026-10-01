"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFromApi } from "@/lib/api";
import {
  MessageSquareQuote,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  PlusCircle,
  Layers,
  BarChart3,
  BotMessageSquare,
  Search,
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  Download,
  Calendar,
  MoreVertical,
  Menu,
  FileText,
  UserPlus,
  Send,
  Loader2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/Kpicard";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "feedback" | "reports" | "organization">("overview");

  // Dynamic database states
  const [dynOrg, setDynOrg] = useState({
    name: "Zidio Development",
    plan: "Enterprise Tier",
    tenantIsolation: "PostgreSQL & MongoDB Multi-Tenant",
    seatsTotal: 20,
    quotaUsed: 84200,
    quotaTotal: 100000,
  });
  const [dynStats, setDynStats] = useState({
    total: 2490,
    sentiment: { positive: 1788, neutral: 423, negative: 279 },
    topThemes: [
      { theme: "Dashboard Speed & UI", count: 412 },
      { theme: "AI Sentiment Accuracy", count: 320 },
      { theme: "Billing & Tier Options", count: 185 },
      { theme: "Report Export Latency", count: 94 },
    ],
  });
  const [dynFeedback, setDynFeedback] = useState<
    Array<{
      id: string;
      customer: string;
      org: string;
      channel: string;
      sentiment: string;
      score: number;
      theme: string;
      content: string;
      date: string;
    }>
  >([]);
  const [dynMembers, setDynMembers] = useState<
    Array<{
      id?: string;
      name: string;
      email: string;
      role: string;
      status: string;
      joined: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  // Feedback tab states
  const [sentimentFilter, setSentimentFilter] = useState<"ALL" | "POSITIVE" | "NEUTRAL" | "NEGATIVE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load Org info
        const orgRes = await fetchFromApi("/api/organization").catch(() => null);
        if (orgRes?.organization) {
          setDynOrg(orgRes.organization);
        }
        if (orgRes?.members?.length) {
          setDynMembers(orgRes.members);
        }

        // Load Analytics
        const analyticsRes = await fetchFromApi("/api/analytics").catch(() => null);
        if (analyticsRes && typeof analyticsRes.total === "number") {
          setDynStats(analyticsRes);
        }

        // Load Feedback records
        const fbRes = await fetchFromApi("/api/feedback").catch(() => null);
        if (fbRes?.items?.length) {
          setDynFeedback(fbRes.items);
        }
      } catch (err) {
        console.warn("Dashboard dynamic load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Sample Feedback Data
  const sampleFeedback = [
    {
      id: "FB-101",
      customer: "Elena Rostova",
      org: "CloudTech Inc",
      channel: "In-App Widget",
      sentiment: "POSITIVE",
      score: 96,
      theme: "AI Summaries",
      content:
        "The automated VoC report generated yesterday highlighted our onboarding drop-off within seconds. Outstanding platform!",
      date: "10 mins ago",
    },
    {
      id: "FB-102",
      customer: "David Chen",
      org: "Nexus Media",
      channel: "Zendesk",
      sentiment: "NEGATIVE",
      score: 22,
      theme: "Export Latency",
      content:
        "Exporting sentiment trends to CSV took almost 45 seconds for a dataset of 3,000 feedback records.",
      date: "35 mins ago",
    },
    {
      id: "FB-103",
      customer: "Sarah Jenkins",
      org: "Apex Global",
      channel: "Intercom",
      sentiment: "NEUTRAL",
      score: 55,
      theme: "Pricing Model",
      content:
        "Would appreciate additional seat tiers between the standard team plan and enterprise custom tier.",
      date: "1 hour ago",
    },
    {
      id: "FB-104",
      customer: "Carlos Santana",
      org: "FinPulse",
      channel: "Email Survey",
      sentiment: "POSITIVE",
      score: 91,
      theme: "UI Experience",
      content:
        "The new Red and Black UI theme is gorgeous and much easier on the eyes during late-night analysis sessions.",
      date: "2 hours ago",
    },
  ];

  const activeFeedbackList = dynFeedback.length > 0 ? dynFeedback : sampleFeedback;

  const filteredFeedback = activeFeedbackList.filter((item) => {
    const matchesSentiment = sentimentFilter === "ALL" || item.sentiment === sentimentFilter;
    const matchesSearch =
      (item.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.theme || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  // Sample Reports Data
  const sampleReports = [
    {
      id: "VOC-2026-W39",
      title: "Weekly Voice of Customer (VoC) Intelligence Brief",
      period: "Sep 22 - Sep 29, 2026",
      sentimentScore: "78% Positive",
      totalFeedback: "1,240 records",
      topTheme: "UI Responsiveness & Performance",
      status: "Ready",
    },
    {
      id: "VOC-2026-M09",
      title: "Monthly Product Quality & Sentiment Diagnostic",
      period: "Sep 01 - Sep 29, 2026",
      sentimentScore: "72% Positive",
      totalFeedback: "5,410 records",
      topTheme: "Billing Tiers & Mobile Stability",
      status: "Ready",
    },
    {
      id: "VOC-2026-Q3",
      title: "Q3 Executive Stakeholder Feedback Analysis",
      period: "Jul 01 - Sep 29, 2026",
      sentimentScore: "74% Positive",
      totalFeedback: "14,820 records",
      topTheme: "Enterprise RBAC Adoption",
      status: "Ready",
    },
  ];

  // Sample Team Members Data
  const teamMembers = [
    {
      name: "Sheikh Siam",
      email: "siam@zidio.dev",
      role: "Super Admin",
      status: "Active",
      joined: "Sep 2026",
    },
    {
      name: "Elena Rostova",
      email: "elena@acme.com",
      role: "Org Admin",
      status: "Active",
      joined: "Sep 2026",
    },
    {
      name: "Marcus Vance",
      email: "marcus@acme.com",
      role: "Lead Analyst",
      status: "Active",
      joined: "Sep 2026",
    },
    {
      name: "Sarah Lin",
      email: "sarah@acme.com",
      role: "Viewer",
      status: "Invited",
      joined: "Pending",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === "ai_chat") return;
          setActiveTab(tab as "overview" | "feedback" | "reports" | "organization");
        }}
      />

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          {/* Top Bar with Mobile Menu Toggle & Title */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mt-1 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 hover:text-white lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    LOOP Intelligence Center
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "feedback" && "Customer Feedback Stream"}
                  {activeTab === "reports" && "Voice of Customer (VoC) Reports"}
                  {activeTab === "organization" && "Organization & Multi-Tenant RBAC"}
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Unified analytics, feedback records, reports, and tenant settings in one dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/ai_chat"
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
              >
                <Sparkles size={14} className="text-red-400" />
                <span>AI Insights Q&A</span>
              </Link>
              <Link
                href="/ai_chat"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all"
              >
                <PlusCircle size={14} />
                <span>Submit Feedback</span>
              </Link>
            </div>
          </div>

          {/* Responsive Dashboard Section Tabs */}
          <div className="flex overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-1.5 backdrop-blur-md scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "feedback", label: "Feedback Stream", icon: MessageSquareQuote, count: "2,490" },
              { id: "reports", label: "VoC Reports", icon: BarChart3, count: "48" },
              { id: "organization", label: "Organization & RBAC", icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-red-600 text-white shadow-md shadow-red-950/50 ring-1 ring-red-500/40"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isCurrent
                          ? "bg-red-900/60 text-white"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                  title="Total Feedback"
                  value={dynStats.total.toLocaleString()}
                  change="+14.2%"
                  changeType="increase"
                  subtitle={`${dynOrg.name} feedback`}
                  icon={MessageSquareQuote}
                  badge="DATABASE LIVE"
                />
                <KpiCard
                  title="Positive Sentiment"
                  value={`${dynStats.total > 0 ? Math.round(((dynStats.sentiment.positive || 0) / dynStats.total) * 100) : 72}%`}
                  change="+3.6%"
                  changeType="increase"
                  subtitle={`${(dynStats.sentiment.positive || 0).toLocaleString()} positive ratings`}
                  icon={TrendingUp}
                  badge="HEALTHY"
                />
                <KpiCard
                  title="Critical Issues"
                  value={`${dynStats.total > 0 ? Math.round(((dynStats.sentiment.negative || 0) / dynStats.total) * 100) : 11}%`}
                  change="-2.1%"
                  changeType="decrease"
                  subtitle={`${(dynStats.sentiment.negative || 0).toLocaleString()} negative items`}
                  icon={AlertTriangle}
                  badge="ATTENTION"
                />
                <KpiCard
                  title="Active Seats"
                  value={`${dynMembers.length || 4} / ${dynOrg.seatsTotal}`}
                  change="Active"
                  changeType="increase"
                  subtitle={`${dynOrg.name} Team`}
                  icon={Clock}
                  badge="TENANT RBAC"
                />
              </div>

              {/* Sentiment Spectrum & Themes */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm lg:col-span-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-red-400" />
                      <h3 className="text-sm font-bold text-white">Sentiment Spectrum Breakdown</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">Total {dynStats.total.toLocaleString()} items</span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {(() => {
                      const total = dynStats.total || 1;
                      const posPct = Math.round(((dynStats.sentiment.positive || 0) / total) * 100);
                      const neuPct = Math.round(((dynStats.sentiment.neutral || 0) / total) * 100);
                      const negPct = Math.max(0, 100 - posPct - neuPct);
                      return (
                        <>
                          <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${posPct}%` }} />
                            <div className="h-full bg-amber-500 transition-all" style={{ width: `${neuPct}%` }} />
                            <div className="h-full bg-red-500 transition-all" style={{ width: `${negPct}%` }} />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5">
                              <p className="text-xs text-emerald-400 font-semibold">Positive</p>
                              <p className="text-base font-extrabold text-white mt-0.5">{posPct}%</p>
                              <p className="text-[10px] text-zinc-500">{(dynStats.sentiment.positive || 0).toLocaleString()} items</p>
                            </div>
                            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5">
                              <p className="text-xs text-amber-400 font-semibold">Neutral</p>
                              <p className="text-base font-extrabold text-white mt-0.5">{neuPct}%</p>
                              <p className="text-[10px] text-zinc-500">{(dynStats.sentiment.neutral || 0).toLocaleString()} items</p>
                            </div>
                            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-2.5">
                              <p className="text-xs text-red-400 font-semibold">Negative</p>
                              <p className="text-base font-extrabold text-white mt-0.5">{negPct}%</p>
                              <p className="text-[10px] text-zinc-500">{(dynStats.sentiment.negative || 0).toLocaleString()} items</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm lg:col-span-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <Layers size={18} className="text-red-400" />
                      <h3 className="text-sm font-bold text-white">AI Recurring Themes</h3>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                      Clustered by AI
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {(dynStats.topThemes && dynStats.topThemes.length > 0 ? dynStats.topThemes : [
                      { theme: "Dashboard Speed & UI", count: 412 },
                      { theme: "AI Sentiment Accuracy", count: 320 },
                      { theme: "Billing & Tier Options", count: 185 },
                      { theme: "Report Export Latency", count: 94 },
                    ]).slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-2.5 transition-colors hover:border-red-500/30"
                      >
                        <div>
                          <p className="text-xs font-bold text-zinc-200">{item.theme}</p>
                          <p className="text-[10px] text-zinc-500">{item.count} occurrences detected</p>
                        </div>
                        <span className="text-xs font-semibold text-red-400">
                          {item.count} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Jump Banner into other sub-sections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left hover:border-red-500/40 hover:bg-zinc-900/70 transition-all cursor-pointer"
                >
                  <MessageSquareQuote size={20} className="text-red-400 mb-2" />
                  <p className="text-xs font-bold text-white">Review Feedback Stream</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Search, filter, and inspect verbatim user feedback.</p>
                </button>

                <button
                  onClick={() => setActiveTab("reports")}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left hover:border-red-500/40 hover:bg-zinc-900/70 transition-all cursor-pointer"
                >
                  <FileText size={20} className="text-red-400 mb-2" />
                  <p className="text-xs font-bold text-white">Export VoC Reports</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Download executive summaries and sentiment diagnostics.</p>
                </button>

                <button
                  onClick={() => setActiveTab("organization")}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left hover:border-red-500/40 hover:bg-zinc-900/70 transition-all cursor-pointer"
                >
                  <Building2 size={20} className="text-red-400 mb-2" />
                  <p className="text-xs font-bold text-white">Manage Organization & RBAC</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Tenant isolation settings, roles, and member permissions.</p>
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: FEEDBACK STREAM ================= */}
          {activeTab === "feedback" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by customer, theme, or comment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/70 p-1 text-xs">
                  {(["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSentimentFilter(filter)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        sentimentFilter === filter
                          ? "bg-red-600 text-white font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-4 backdrop-blur-sm transition-all hover:border-red-500/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.customer}</span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                          {item.org}
                        </span>
                        <span className="text-[10px] text-zinc-500">• {item.channel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                          {item.theme}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                            item.sentiment === "POSITIVE"
                              ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-400"
                              : item.sentiment === "NEGATIVE"
                              ? "border-red-500/30 bg-red-950/30 text-red-400"
                              : "border-amber-500/30 bg-amber-950/30 text-amber-400"
                          }`}
                        >
                          {item.sentiment} ({item.score}%)
                        </span>
                        <span className="text-[10px] text-zinc-500">{item.date}</span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      &quot;{item.content}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: VOC REPORTS ================= */}
          {activeTab === "reports" && (
            <div className="space-y-6">
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

              <div className="space-y-3">
                {sampleReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm transition-all hover:border-red-500/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-red-600/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                            {report.id}
                          </span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Calendar size={12} /> {report.period}
                          </span>
                        </div>
                        <Link href={`/reports/${report.id}`}>
                          <h3 className="text-sm font-bold text-white mt-1.5 hover:text-red-400 transition-colors hover:underline">
                            {report.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Theme: {report.topTheme} • Volume: {report.totalFeedback}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          {report.sentimentScore}
                        </span>
                        <button
                          onClick={() => alert(`Exporting ${report.id}`)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-red-500/40 transition-colors"
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
          )}

          {/* ================= TAB 4: ORGANIZATION & RBAC ================= */}
          {activeTab === "organization" && (
            <div className="space-y-6">
              {/* Tenant info */}
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-zinc-900 font-extrabold text-white text-xl shadow-lg shadow-red-950/60 ring-1 ring-red-500/50">
                      {dynOrg.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{dynOrg.name}</h2>
                      <p className="text-xs text-zinc-400">Primary Tenant • {dynOrg.tenantIsolation}</p>
                    </div>
                  </div>

                  <span className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-400 w-fit">
                    {dynOrg.plan}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                      Tenant Isolation
                    </span>
                    <p className="mt-1 font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-red-500" /> {dynOrg.tenantIsolation}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                      Total Team Seats
                    </span>
                    <p className="mt-1 font-bold text-white">{(dynMembers.length || teamMembers.length)} / {dynOrg.seatsTotal} Active Seats</p>
                  </div>

                  <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                      AI Quota Allocation
                    </span>
                    <p className="mt-1 font-bold text-white">{(dynOrg.quotaUsed || 84200).toLocaleString()} / {(dynOrg.quotaTotal || 100000).toLocaleString()} Tokens</p>
                  </div>
                </div>
              </div>

              {/* Team list */}
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Assigned Organization Roles</h3>
                  <button
                    onClick={() => alert("Invite dialog")}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                  >
                    <UserPlus size={14} />
                    <span>Invite</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase text-zinc-400">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {(dynMembers.length > 0 ? dynMembers : teamMembers).map((m, idx) => (
                        <tr key={idx} className="group hover:bg-zinc-800/20">
                          <td className="py-3 font-medium text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 font-bold">
                                {m.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{m.name}</p>
                                <p className="text-[11px] text-zinc-400">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="rounded-md border border-red-500/20 bg-red-950/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                              {m.role}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                m.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-400">{m.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
