"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BotMessageSquare,
  Sparkles,
  Send,
  User,
  MessageSquare,
  ClipboardList,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import OrgOnboarding from "@/components/OrgOnboarding";
import { fetchFromApi } from "@/lib/api";

type Sentiment = "positive" | "neutral" | "negative";
type ChatMsg = {
  sender: "ai" | "user";
  text: string;
  time: string;
  sources?: string[];
  error?: boolean;
  failedQuery?: string;
};
type Analysis = { text: string; sentiment: Sentiment; themes: string[]; summary: string };
type Membership = { organizationName: string; role: string } | null;
type Stats = {
  total: number;
  sentiment: Record<Sentiment, number>;
  topThemes: { theme: string; count: number }[];
};

const MAX_REVIEWS = 100;
const CHUNK = 20;

const SENTIMENT_STYLE: Record<Sentiment, string> = {
  positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  neutral: "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
  negative: "bg-red-500/10 text-red-400 border-red-500/30",
};

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** **bold** ও নতুন লাইন সঠিকভাবে দেখায় */
/** একটাই লম্বা লাইনে অনেক review পেস্ট করলে বাক্য ধরে আলাদা লাইনে ভাগ করে */
function toLines(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 3) return lines.join("\n");
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((p) => p.length > 3)
    .join("\n");
}

function RichText({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-line">
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}

export default function AiChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "analyze">("chat");

  // লোড অবস্থা
  const [boot, setBoot] = useState<"loading" | "ready" | "needs_org" | "error">("loading");
  const [bootError, setBootError] = useState("");
  const [membership, setMembership] = useState<Membership>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Review analysis
  const [reviewsText, setReviewsText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Analysis[] | null>(null);
  const [analyzeError, setAnalyzeError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [progress, setProgress] = useState("");

  const reviewLines = reviewsText.split("\n").map((l) => l.trim()).filter(Boolean);
  const canWrite = !!membership && membership.role !== "viewer";

  async function loadContext() {
    try {
      const me = await fetchFromApi("/api/me");
      if (!me.membership) {
        setBoot("needs_org");
        return;
      }
      setMembership(me.membership);
      setStats(await fetchFromApi("/api/analytics"));

      // Load persisted chat history from MongoDB
      try {
        const histData = await fetchFromApi("/api/ai/query");
        if (histData?.history && Array.isArray(histData.history) && histData.history.length > 0) {
          const restoredMsgs: ChatMsg[] = [];
          for (const item of histData.history) {
            if (item.question) {
              restoredMsgs.push({
                sender: "user",
                text: item.question,
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier",
              });
            }
            if (item.answer) {
              restoredMsgs.push({
                sender: "ai",
                text: item.answer,
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Earlier",
                sources: item.basedOn ? [`${item.basedOn} verified records`] : undefined,
              });
            }
          }
          if (restoredMsgs.length > 0) {
            setMessages(restoredMsgs);
          }
        }
      } catch (histErr) {
        console.warn("Could not load previous chat history:", histErr);
      }

      setBoot("ready");
    } catch (e) {
      setBootError(e instanceof Error ? e.message : "Could not reach the server.");
      setBoot("error");
    }
  }

  function retry() {
    setBoot("loading");
    loadContext();
  }

  useEffect(() => {
    loadContext();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ডেটা অনুযায়ী পরিবর্তনশীল suggestion
  const topTheme = stats?.topThemes?.[0]?.theme;
  const suggestions = [
    "What are customers complaining about most?",
    topTheme ? `What are customers saying about ${topTheme}?` : "Summarize overall customer sentiment",
    "Which themes get the most positive feedback?",
  ];

  async function handleSend(textToSend?: string, isRetry = false) {
    const query = (textToSend ?? input).trim();
    if (!query || isTyping) return;

    const history = messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text }));
    if (!isRetry) {
      setMessages((prev) => [...prev, { sender: "user", text: query, time: now() }]);
      setInput("");
    }
    setIsTyping(true);

    try {
      const data = await fetchFromApi("/api/ai/query", {
        method: "POST",
        body: JSON.stringify({ question: query, history }),
      });
      const sources: string[] = [];
      if (data.basedOn) sources.push(`${data.basedOn} recent records`);
      if (data.total) sources.push(`${data.total} analyzed in total`);
      setMessages((prev) => [...prev, { sender: "ai", text: data.answer, time: now(), sources }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: e instanceof Error ? e.message : "Something went wrong.",
          time: now(),
          error: true,
          failedQuery: query,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function retryQuery(failedQuery?: string) {
    if (!failedQuery) return;
    // Remove the failed AI message before retrying
    setMessages((prev) => prev.filter((m) => m.failedQuery !== failedQuery));
    handleSend(failedQuery, true);
  }

  async function analyzeReviews() {
    setAnalyzeError("");
    setResults(null);
    setSavedCount(null);
    setAnalyzing(true);
    const all: Analysis[] = [];
    try {
      // ২০টা করে ভাগ করে পাঠায়, তাই একবারে ১০০টা পর্যন্ত review চলে
      for (let i = 0; i < reviewLines.length; i += CHUNK) {
        setProgress(`${Math.min(i + CHUNK, reviewLines.length)}/${reviewLines.length}`);
        const part: Analysis[] = await fetchFromApi("/api/ai/analyze-batch", {
          method: "POST",
          body: JSON.stringify({ texts: reviewLines.slice(i, i + CHUNK) }),
        });
        all.push(...part);
      }
    } catch (e) {
      setAnalyzeError(
        (e instanceof Error ? e.message : "Analysis failed.") +
        (all.length ? ` Showing the ${all.length} reviews analyzed so far.` : "")
      );
    } finally {
      if (all.length) setResults(all);
      setProgress("");
      setAnalyzing(false);
    }
  }

  function moveToAnalyze() {
    setReviewsText(toLines(input));
    setInput("");
    setTab("analyze");
  }

  async function saveAll() {
    if (!results) return;
    setSaving(true);
    setAnalyzeError("");
    try {
      const data = await fetchFromApi("/api/feedback/bulk", {
        method: "POST",
        body: JSON.stringify({ items: results }),
      });
      setSavedCount(data.inserted);
      fetchFromApi("/api/analytics").then(setStats).catch(() => { });
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Could not save the reviews.");
    } finally {
      setSaving(false);
    }
  }

  const counts = results
    ? results.reduce(
      (acc, r) => ({ ...acc, [r.sentiment]: acc[r.sentiment] + 1 }),
      { positive: 0, neutral: 0, negative: 0 } as Record<Sentiment, number>
    )
    : null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-800/80 bg-zinc-950/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-zinc-900 text-white shadow-md shadow-red-950/60 ring-1 ring-red-500/40">
              <BotMessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">AI Feedback Assistant</h1>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                  Powered by Gemini
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {membership
                  ? `${membership.organizationName} · ${stats?.total ?? 0} feedback records`
                  : "Ask questions and analyze reviews with your organization's data."}
              </p>
            </div>
          </div>

          {boot === "ready" && (
            <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
              <button
                onClick={() => setTab("chat")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors ${tab === "chat" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
              >
                <MessageSquare size={13} /> Ask AI
              </button>
              <button
                onClick={() => setTab("analyze")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors ${tab === "analyze" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
                  }`}
              >
                <ClipboardList size={13} /> Analyze reviews
              </button>
            </div>
          )}
        </div>

        {/* Loading / error / onboarding */}
        {boot === "loading" && (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-zinc-400">
            <Loader2 size={18} className="animate-spin text-red-400" /> Loading your workspace...
          </div>
        )}

        {boot === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle size={28} className="text-red-400" />
            <p className="max-w-sm text-sm text-zinc-300">{bootError}</p>
            <div className="flex gap-2">
              <button
                onClick={retry}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-red-500/40"
              >
                <RefreshCw size={13} /> Try again
              </button>
              <Link
                href="/login"
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Log in
              </Link>
            </div>
          </div>
        )}

        {boot === "needs_org" && (
          <div className="flex-1 overflow-y-auto p-4">
            <OrgOnboarding onDone={retry} />
          </div>
        )}

        {/* ================= CHAT TAB ================= */}
        {boot === "ready" && tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
              {/* Welcome */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                  <Sparkles size={15} />
                </div>
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-200">
                  {stats && stats.total > 0 ? (
                    <>
                      Hello! I&apos;m LOOP AI. I can see <strong className="text-white">{stats.total}</strong> feedback
                      records for {membership?.organizationName}. Ask me about sentiment, recurring problems or any
                      theme.
                    </>
                  ) : (
                    <>
                      Hello! I&apos;m LOOP AI. You have no feedback yet. Open the <strong className="text-white">Analyze
                        reviews</strong> tab to paste some reviews, then come back and ask me about them.
                    </>
                  )}
                </div>
              </div>

              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "ai" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                      <Sparkles size={15} />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 max-w-xl text-xs sm:text-sm leading-relaxed backdrop-blur-sm ${msg.sender === "user"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950/40"
                        : msg.error
                          ? "border border-red-500/30 bg-red-950/30 text-red-300"
                          : "border border-zinc-800/80 bg-zinc-900/60 text-zinc-200 shadow-md"
                      }`}
                  >
                    <RichText text={msg.text} />

                    {msg.error && msg.failedQuery && (
                      <div className="mt-3 flex items-center justify-between border-t border-red-500/20 pt-2">
                        <span className="text-[10px] text-red-400">Request failed</span>
                        <button
                          onClick={() => retryQuery(msg.failedQuery)}
                          className="flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-[11px] font-bold text-red-300 hover:bg-red-900/60 hover:text-white transition-all cursor-pointer"
                        >
                          <RefreshCw size={12} />
                          <span>Retry</span>
                        </button>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-400">
                        <span className="font-semibold text-red-400">Based on:</span>
                        {msg.sources.map((s, idx) => (
                          <span key={idx} className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-400 border border-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="block mt-1 text-[10px] text-zinc-400/80 text-right">{msg.time}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                      <User size={15} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                    <Sparkles size={15} className="animate-spin" />
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-400">
                    <span className="animate-pulse">Reading your feedback...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-zinc-800/80 bg-zinc-950/90 p-4 max-w-4xl mx-auto w-full space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-zinc-500 font-medium">Suggestions:</span>
                {suggestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isTyping}
                    className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-400 hover:border-red-500/30 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {input.length > 400 && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-[11px] text-red-200">
                  <span>Looks like you pasted many reviews. Send for a quick summary, or get a result for each review.</span>
                  <button
                    onClick={moveToAnalyze}
                    className="rounded-lg bg-red-600 px-2.5 py-1 font-semibold text-white hover:bg-red-500"
                  >
                    Analyze one by one
                  </button>
                </div>
              )}

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about customer sentiment, trends, or specific issues..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 pl-4 pr-12 py-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send"
                  className="absolute right-2 rounded-xl bg-red-600 p-2 text-white hover:bg-red-500 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= ANALYZE TAB ================= */}
        {boot === "ready" && tab === "analyze" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto w-full max-w-4xl space-y-5">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Paste reviews (one per line)
                  </label>
                  <div className="flex items-center gap-3">
                    {reviewsText.length > 200 && reviewLines.length <= 3 && (
                      <button
                        onClick={() => setReviewsText(toLines(reviewsText))}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/20"
                      >
                        Split into separate reviews
                      </button>
                    )}
                    <span className={`text-[11px] ${reviewLines.length > MAX_REVIEWS ? "text-red-400" : "text-zinc-500"}`}>
                      {reviewLines.length}/{MAX_REVIEWS}
                    </span>
                  </div>
                </div>
                <textarea
                  value={reviewsText}
                  onChange={(e) => setReviewsText(e.target.value)}
                  rows={6}
                  placeholder={"The delivery was two days late and support never replied.\nLove the new app design, so easy to use!\nThe product is okay, nothing special."}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  onClick={analyzeReviews}
                  disabled={analyzing || reviewLines.length === 0 || reviewLines.length > MAX_REVIEWS}
                  className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {analyzing ? `Analyzing ${progress}...` : "Analyze with AI"}
                </button>
              </div>

              {analyzeError && (
                <p className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-semibold text-red-300">
                  {analyzeError}
                </p>
              )}

              {results && counts && (
                <>
                  {/* Summary bar */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-sm font-bold text-white">{results.length} reviews analyzed</h2>
                      {savedCount !== null ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 size={14} /> Saved {savedCount} to your feedback ·{" "}
                          <Link href="/feedback" className="underline hover:text-emerald-300">
                            View
                          </Link>
                        </span>
                      ) : (
                        canWrite && (
                          <button
                            onClick={saveAll}
                            disabled={saving}
                            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-red-500/40 disabled:opacity-60 cursor-pointer"
                          >
                            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                            Save all to feedback
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div className="bg-emerald-500" style={{ width: `${(counts.positive / results.length) * 100}%` }} />
                      <div className="bg-zinc-500" style={{ width: `${(counts.neutral / results.length) * 100}%` }} />
                      <div className="bg-red-500" style={{ width: `${(counts.negative / results.length) * 100}%` }} />
                    </div>
                    <div className="mt-2 flex gap-4 text-[11px] text-zinc-400">
                      <span><span className="text-emerald-400">●</span> {counts.positive} positive</span>
                      <span><span className="text-zinc-400">●</span> {counts.neutral} neutral</span>
                      <span><span className="text-red-400">●</span> {counts.negative} negative</span>
                    </div>
                  </div>

                  {/* Per review */}
                  <div className="space-y-3">
                    {results.map((r, i) => (
                      <div key={i} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                        <p className="text-sm text-zinc-200">&ldquo;{r.text}&rdquo;</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${SENTIMENT_STYLE[r.sentiment]}`}>
                            {r.sentiment}
                          </span>
                          {r.themes.map((t) => (
                            <span key={t} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300">
                              {t}
                            </span>
                          ))}
                        </div>
                        {r.summary && <p className="mt-2 text-xs text-zinc-400">{r.summary}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}