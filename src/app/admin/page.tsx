"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Server,
  Users,
  Database,
  Cpu,
  Key,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const systemStats = [
    { label: "MongoDB Status", value: "Connected", healthy: true },
    { label: "Gemini Model", value: "gemini-3.5-flash", healthy: true },
    { label: "Active Tenants", value: "12", healthy: true },
    { label: "Pending Jobs", value: "0", healthy: true },
  ];

  const auditLogs = [
    { time: "21:14:10", action: "Tenant created: 'Acme Corp'", actor: "system", status: "OK" },
    { time: "21:10:05", action: "Gemini Batch Analysis (20 items)", actor: "user_siam", status: "OK" },
    { time: "20:45:22", action: "Session Refresh", actor: "user_elena", status: "OK" },
    { time: "20:15:00", action: "Database Backup Snapshot", actor: "cron", status: "OK" },
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
                  System Administration
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Global Admin Console
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Monitor system health, database connections, AI model latency, and audit logs.
              </p>
            </div>

            <button
              onClick={() => alert("System health check refreshed.")}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Refresh Health</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {stat.label}
                  </span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <p className="mt-3 text-xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Audit Logs */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-red-500" /> Platform Security & Activity Audit
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase text-zinc-400">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Event Action</th>
                    <th className="pb-3">Triggered By</th>
                    <th className="pb-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/20">
                      <td className="py-3 font-mono text-zinc-400">{log.time}</td>
                      <td className="py-3 font-medium text-white">{log.action}</td>
                      <td className="py-3 text-zinc-400">{log.actor}</td>
                      <td className="py-3 text-right">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
