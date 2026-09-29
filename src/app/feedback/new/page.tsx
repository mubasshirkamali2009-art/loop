"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Mail,
  Tag,
  Share2,
  CheckCircle2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function NewFeedbackPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [channel, setChannel] = useState("In-App");
  const [category, setCategory] = useState("Product Usability");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Real-time sentiment detector simulation based on text
  const detectSentiment = (text: string) => {
    const lower = text.toLowerCase();
    if (!text.trim()) return null;
    if (lower.includes("great") || lower.includes("love") || lower.includes("awesome") || lower.includes("fast") || lower.includes("good")) {
      return { sentiment: "POSITIVE", score: "94%", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" };
    }
    if (lower.includes("bad") || lower.includes("bug") || lower.includes("slow") || lower.includes("fail") || lower.includes("error") || lower.includes("hate")) {
      return { sentiment: "NEGATIVE", score: "22%", color: "text-red-400 border-red-500/30 bg-red-950/20" };
    }
    return { sentiment: "NEUTRAL", score: "54%", color: "text-amber-400 border-amber-500/30 bg-amber-950/20" };
  };

  const currentSentiment = detectSentiment(feedbackText);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/feedback");
      }, 1500);
    }, 800);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Feedback Stream</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                New Ingestion
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Submit Customer Feedback
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Add new unstructured feedback manually. The AI engine will parse sentiment, tone, and themes automatically.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-emerald-500/30 bg-zinc-900/60 p-8 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Feedback Ingested Successfully!</h2>
              <p className="mt-1 text-xs text-zinc-400">
                AI sentiment classification completed. Redirecting to feedback stream...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-800/90 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Customer Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="maya@enterprise.com"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Feedback Channel
                  </label>
                  <div className="relative">
                    <Share2 size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="In-App">In-App Widget</option>
                      <option value="Zendesk">Zendesk Ticket</option>
                      <option value="Intercom">Intercom Chat</option>
                      <option value="Email">Email Survey</option>
                      <option value="Social">Social / Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Estimated Category
                  </label>
                  <div className="relative">
                    <Tag size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Product Usability">Product Usability</option>
                      <option value="Performance & Speed">Performance & Speed</option>
                      <option value="Billing & Pricing">Billing & Pricing</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Feedback Message
                  </label>
                  {currentSentiment && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${currentSentiment.color}`}>
                      <Sparkles size={11} />
                      AI Live Sentiment: {currentSentiment.sentiment} ({currentSentiment.score})
                    </span>
                  )}
                </div>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Paste or write customer verbatim feedback here..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Link
                  href="/feedback"
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? "Ingesting..." : "Ingest & Run AI Analysis"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
