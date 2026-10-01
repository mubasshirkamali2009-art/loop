"use client";

import { useState } from "react";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import { fetchFromApi } from "@/lib/api";

export default function OrgOnboarding({ onDone }: { onDone: () => void }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await fetchFromApi("/api/organization/onboard", {
                method: "POST",
                body: JSON.stringify({ name }),
            });
            onDone();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create the organization.");
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-zinc-800/90 bg-zinc-900/60 p-7 backdrop-blur-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Building2 size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Name your organization</h2>
            <p className="mt-1 mb-5 text-xs text-zinc-400">
                Your feedback, reports and team will live in this workspace, separate from every other organization.
            </p>

            {error && (
                <p className="mb-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-semibold text-red-300">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-sm font-bold text-white ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 disabled:opacity-60 transition-all cursor-pointer"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    <span>{loading ? "Creating..." : "Create workspace"}</span>
                </button>
            </form>
        </div>
    );
}