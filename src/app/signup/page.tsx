"use client";
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Users,
  Image as ImageIcon,
  UploadCloud,
  Link2,
  CheckCircle2,
  X
} from "lucide-react";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Avatar / Logo image upload states
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle direct file upload to ImgBB via backend route handler
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "ImgBB upload failed.");
      }

      setImageUrl(data.url || data.display_url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        image: imageUrl || undefined,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to create account. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (typeof err === "object" && err !== null) {
        setErrorMessage(JSON.stringify(err));
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Red Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[700px] bg-red-600/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-[400px] w-[500px] bg-red-900/10 blur-[150px] rounded-full" />

      {/* Subtle Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Organization Benefits Showcase */}
        <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-center pr-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md mb-6 w-fit">
            <Sparkles size={14} className="text-red-400 animate-pulse" />
            <span>Multi-Tenant Intelligence</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Deploy LOOP for your{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              entire team
            </span>
            .
          </h1>

          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            Create an organization workspace in seconds. Automatically isolate customer feedback, assign role-based access, and connect your AI analysis engines.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Granular RBAC</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Super Admin, Org Admin, Manager, Analyst, and Viewer permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Tenant-Isolated Data</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Strict database-level logical separation for all feedback records.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
            <span>Powered by Gemini & Claude AI Analysis Layers</span>
          </div>
        </div>

        {/* Right Column: Glassmorphic Red & Black Signup Card */}
        <div className="lg:col-span-7 w-full max-w-lg mx-auto">
          <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all hover:border-red-500/40">
            {/* Top red accent glow line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="text-center sm:text-left mb-6">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-zinc-900 font-bold text-white shadow-md shadow-red-950/60">
                  L
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Get Started with LOOP
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Start turning customer feedback into growth opportunities.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Organization
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* ================= Profile / Logo Image Selector ================= */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-red-400" />
                    <span>Profile / Avatar Image</span>
                  </label>

                  {/* Switch between Upload or URL */}
                  <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-colors ${imageMode === "upload"
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      <UploadCloud size={12} />
                      <span>Upload (ImgBB)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-colors ${imageMode === "url"
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      <Link2 size={12} />
                      <span>Image Link</span>
                    </button>
                  </div>
                </div>

                {/* Option A: Direct File Upload to ImgBB */}
                {imageMode === "upload" ? (
                  <div>
                    <label className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-4 hover:border-red-500/50 hover:bg-zinc-900/70 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-xs text-red-400">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading image to ImgBB...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <UploadCloud size={20} className="text-red-400 mb-1" />
                          <span className="text-xs font-semibold text-zinc-300">
                            Click to select image file
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">
                            PNG, JPG, WEBP (Max 5MB) • Powered by ImgBB
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  /* Option B: Direct Image URL Input */
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                      <Link2 size={15} />
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://i.ibb.co/... or any image link"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Error message */}
                {uploadError && (
                  <p className="text-[11px] text-red-400 font-semibold">{uploadError}</p>
                )}

                {/* Image Live Preview */}
                {imageUrl && (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Avatar Preview"
                        className="h-9 w-9 rounded-lg object-cover border border-emerald-500/40"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Image Ready
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                          {imageUrl}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="rounded-lg p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Remove image"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-zinc-400">
                  I agree to the{" "}
                  <Link href="#" className="text-red-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-red-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Organization Account</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
