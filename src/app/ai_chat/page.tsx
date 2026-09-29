"use client";

import { useState } from "react";
import {
  BotMessageSquare,
  Sparkles,
  Send,
  User,
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ArrowRight
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AiChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string; time: string; sources?: string[] }>
  >([
    {
      sender: "ai",
      text: "Hello! I am LOOP AI, your customer feedback intelligence assistant. Ask me anything about sentiment trends, recurring customer pain points, or request a summary of specific product feedback.",
      time: "Just now",
      sources: ["Tenant: Acme Corp", "2,490 Records Indexed"],
    },
  ]);

  const presetQuestions = [
    "What are customers complaining about most this week?",
    "Summarize sentiment regarding checkout and payment workflows",
    "Which features have the highest positive satisfaction ratings?",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate intelligent AI response
    setTimeout(() => {
      let aiReply = "Based on our neural analysis of recent customer feedback records:";
      let sources = ["42 Feedback records", "Sentiment Engine v2"];

      if (query.toLowerCase().includes("complain") || query.toLowerCase().includes("week")) {
        aiReply =
          "Over the past 7 days, the most prominent negative complaints center on: \n\n1. **Export Latency (38% of complaints)**: Users reporting PDF/CSV timeouts on large queries (>2,000 rows).\n2. **Seat-based pricing confusion (24%)**: Sub-teams requesting smaller tier intervals.\n\nNegative sentiment on these topics rose by 3.2% compared to last week.";
        sources = ["Zendesk Tickets", "In-App Feedback"];
      } else if (query.toLowerCase().includes("checkout") || query.toLowerCase().includes("payment")) {
        aiReply =
          "Sentiment around the payment and checkout flows is currently **72% Positive**. Customers frequently praise the streamlined 1-click renewal, while 8% of neutral feedback suggests adding local currency support.";
        sources = ["Stripe Intercom", "Email Surveys"];
      } else {
        aiReply =
          "According to aggregated feedback records, user satisfaction is highest on **UI responsiveness (94% positive)** and **automated AI insight summaries (92% positive)**. Customers highlighted the time saved in preparing weekly executive Voice of Customer reports.";
        sources = ["Live Stream", "Theme Extraction Engine"];
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sources,
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-zinc-800/80 bg-zinc-950/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-zinc-900 text-white shadow-md shadow-red-950/60 ring-1 ring-red-500/40">
              <BotMessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">AI Feedback Assistant</h1>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                  Gemini & Claude Core
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Natural-language Q&A trained on your organization&apos;s isolated feedback records.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                  <Sparkles size={15} />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 max-w-xl text-xs sm:text-sm leading-relaxed backdrop-blur-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950/40"
                    : "border border-zinc-800/80 bg-zinc-900/60 text-zinc-200 shadow-md"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sources && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-400">
                    <span className="font-semibold text-red-400">Sources:</span>
                    {msg.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-400 border border-zinc-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <span className="block mt-1 text-[10px] text-zinc-400/80 text-right">
                  {msg.time}
                </span>
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
                <span className="animate-pulse">Synthesizing customer feedback insights...</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset suggestions & Input area */}
        <div className="border-t border-zinc-800/80 bg-zinc-950/90 p-4 max-w-4xl mx-auto w-full space-y-3">
          {/* Quick chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium">Suggestions:</span>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-400 hover:border-red-500/30 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about customer sentiment, trends, or specific issues..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 pl-4 pr-12 py-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 rounded-xl bg-red-600 p-2 text-white hover:bg-red-500 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
