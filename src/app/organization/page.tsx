"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  Shield,
  Key,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function OrganizationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Tenant Management
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Organization & RBAC
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage your organization profile, team members, and role-based permissions.
              </p>
            </div>

            <button
              onClick={() => alert("Invite team member modal")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all cursor-pointer"
            >
              <UserPlus size={15} />
              <span>Invite Member</span>
            </button>
          </div>

          {/* Org details card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-zinc-900 font-extrabold text-white text-xl shadow-lg shadow-red-950/60 ring-1 ring-red-500/50">
                  Z
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Zidio Development</h2>
                  <p className="text-xs text-zinc-400">Employee ID: ZIDIOqktTek • Primary Tenant</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-400">
                  Enterprise Tier
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                  Tenant Isolation
                </span>
                <p className="mt-1 font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-red-500" /> PostgreSQL Multi-Tenant
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                  Total Team Seats
                </span>
                <p className="mt-1 font-bold text-white">4 / 20 Active Seats</p>
              </div>

              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">
                  AI Quota Allocation
                </span>
                <p className="mt-1 font-bold text-white">84,200 / 100,000 Tokens</p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4">Role-Based Access Control (RBAC)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] font-semibold uppercase text-zinc-400">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {teamMembers.map((m, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-800/20">
                      <td className="py-3.5 font-medium text-white">
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
                      <td className="py-3.5">
                        <span className="rounded-md border border-red-500/20 bg-red-950/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5">
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
                      <td className="py-3.5 text-zinc-400">{m.joined}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-zinc-500 hover:text-white p-1">
                          <MoreVertical size={14} />
                        </button>
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
