"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950/90 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo & Brand description */}
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 group-hover:scale-105 transition-transform">
                <span className="text-base tracking-tighter">L</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                LOOP<span className="text-red-500">.ai</span>
              </span>
            </Link>
            <p className="mt-1.5 text-xs text-zinc-500 max-w-sm text-center sm:text-left">
              AI-powered Customer Feedback Intelligence Platform. Turning feedback into business growth.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <Link href="/" className="transition-colors hover:text-red-400">
              Home
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-red-400">
              Dashboard Hub
            </Link>
            <Link href="/ai_chat" className="transition-colors hover:text-red-400">
              AI Insights
            </Link>
            <Link href="/login" className="transition-colors hover:text-red-400">
              Sign In
            </Link>
          </div>

          {/* System Status / Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-950/30 px-3 py-1 text-xs font-medium text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              <span>AI Engine Active</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} LOOP Intelligence Platform. Zidio Development.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" /> Multi-Tenant Secured
            </span>
            <span>•</span>
            <span className="text-zinc-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
