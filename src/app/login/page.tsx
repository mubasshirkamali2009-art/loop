"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  TrendingUp, 
  BarChart2, 
  CheckCircle2 
} from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Invalid credentials. Please verify your email and password.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Google sign-in failed. Please check your credentials.");
      }
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Red Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-red-600/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] bg-red-900/10 blur-[150px] rounded-full" />

      {/* Grid Pattern overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Brand & Value Proposition Showcase */}
        <div className="hidden lg:col-span-6 lg:flex lg:flex-col lg:justify-center pr-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md mb-6 w-fit">
            <Sparkles size={14} className="text-red-400 animate-pulse" />
            <span>AI-Powered Feedback Intelligence</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-tight">
            Turn customer noise into <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">decisive action</span>.
          </h1>

          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            LOOP automatically aggregates customer feedback, conducts neural sentiment analysis, identifies recurring pain points, and drafts Voice of Customer reports.
          </p>

          {/* AI Metrics Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <TrendingUp size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Real-Time</span>
              </div>
              <p className="text-xl font-bold text-white">Sentiment AI</p>
              <p className="text-xs text-zinc-500 mt-1">Instant emotion & intent extraction</p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <BarChart2 size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Multi-Tenant</span>
              </div>
              <p className="text-xl font-bold text-white">RBAC Isolation</p>
              <p className="text-xs text-zinc-500 mt-1">Enterprise organizational security</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-red-500" />
              <span>Theme Clustering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-red-500" />
              <span>AI Chat Query</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-red-500" />
              <span>Automated Reports</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Red & Black Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-900/60 p-7 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all hover:border-red-500/40">
            {/* Top red accent glow line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            {/* Header */}
            <div className="text-center sm:text-left mb-6">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-zinc-900 font-bold text-white shadow-md shadow-red-950/60">
                  L
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Welcome back
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Log in to access your organization&apos;s feedback intelligence.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="analyst@organization.com"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-zinc-400">
                  Keep me logged in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-zinc-900/90 px-3 text-zinc-500">Or continue with</span>
              </div>
            </div>

            {/* Easy Login: Google Only (GitHub removed as requested) */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 text-xs font-semibold text-zinc-200 hover:border-red-500/40 hover:bg-zinc-900 transition-all cursor-pointer"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-red-400" />
                    <span>Connecting Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.56 0 2.97.55 4.09 1.45l3.07-3.07C17.29 1.67 14.83 1 12 1 7.42 1 3.55 3.63 1.67 7.43l3.66 2.84C6.21 7.29 8.87 5 12 5z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.66 2.84c2.14-1.98 3.76-4.9 3.76-8.66z" />
                      <path fill="#FBBC05" d="M5.33 14.73c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L1.67 7.71C.61 9.82 0 12.18 0 14.64s.61 4.82 1.67 6.93l3.66-2.84z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.66-2.84c-1.08.72-2.45 1.16-4.27 1.16-3.13 0-5.79-2.29-6.67-5.27L1.67 16.98C3.55 20.78 7.42 23 12 23z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Register Switch */}
            <div className="mt-6 text-center text-xs text-zinc-400">
              Don&apos;t have an organization account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
