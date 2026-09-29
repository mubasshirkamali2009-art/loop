"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  Home,
  LayoutDashboard,
  BotMessageSquare,
  Building2,
  User,
  LogIn,
  UserPlus
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface NavbarProps {
  onMenu?: () => void;
}

export default function Navbar({ onMenu }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const user = session?.user;
  const name = user?.name ?? "User";
  const email = user?.email ?? "";

  // Exactly 3 main navigation items as requested: Home, Dashboard, AI Insights
  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Insights", href: "/ai_chat", icon: BotMessageSquare, badge: "AI" },
  ];

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onMenu ? (
            <button
              onClick={onMenu}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          ) : (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* Logo with Red Glow indicator */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-md shadow-red-950/60 ring-1 ring-red-500/50 group-hover:scale-105 group-hover:ring-red-400 transition-all">
              <span className="font-black text-white text-base tracking-tight">L</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-red-400 transition-colors">
                LOOP<span className="text-red-500">.ai</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-red-400/80 -mt-1 hidden sm:block">
                Feedback Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Exactly 3 Navigation Links: Home, Dashboard, AI Insights */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-red-400" : "text-zinc-400"} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-md bg-red-600/20 px-1.5 py-0.2 text-[9px] font-bold text-red-400 border border-red-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Auth CTA Buttons / User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            /* Logged in state */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1.5 pr-2.5 sm:pr-3 text-left transition-colors hover:border-red-500/40 hover:bg-zinc-900 focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-zinc-900 text-xs font-bold text-white shadow-inner">
                  {name.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <p className="text-xs font-semibold text-zinc-100">{name}</p>
                  <p className="text-[11px] text-zinc-400 truncate max-w-[110px]">{email}</p>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl shadow-black/90 backdrop-blur-md z-50">
                  <div className="border-b border-zinc-800/80 px-3 py-2.5">
                    <p className="text-xs font-semibold text-white">{name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{email}</p>
                    <span className="mt-1.5 inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                      Active Tenant
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <LayoutDashboard size={14} className="text-zinc-400" />
                      Dashboard Hub
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <User size={14} className="text-zinc-400" />
                      Account Settings
                    </Link>
                  </div>
                  <div className="border-t border-zinc-800/80 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out state */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <LogIn size={14} className="text-red-400" />
                <span>Sign in</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 hover:from-red-500 hover:to-red-600 transition-all hover:scale-102"
              >
                <UserPlus size={14} />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Home, Dashboard, AI Insights) */}
      {mobileMenuOpen && !isAuthPage && (
        <div className="border-b border-zinc-800 bg-zinc-950/98 px-4 py-4 md:hidden backdrop-blur-xl">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-red-400" : "text-zinc-400"} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}