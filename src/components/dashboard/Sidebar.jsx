"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  Target,
  Wallet,
  Settings,
  LogOut,
  HandCoins,
  Calculator,
  Repeat,
  MoreHorizontal,
  X,
  Sun,
  Moon,
} from "lucide-react";
import UserProfileBadge from "@/components/premium/UserProfileBadge";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

const MENUS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dompet", href: "/wallets", icon: Wallet },
  { name: "Hutang Piutang", href: "/debts", icon: HandCoins },
  { name: "Langganan", href: "/subscriptions", icon: Repeat },
  { name: "Wishlist", href: "/wishlist", icon: Target },
  { name: "Simulasi", href: "/calculator", icon: Calculator },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

const MOBILE_MAIN_NAVS = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dompet", href: "/wallets", icon: Wallet },
  { name: "Simulasi", href: "/calculator", icon: Calculator },
];

const MOBILE_SECONDARY_NAVS = [
  { name: "Hutang Piutang", href: "/debts", icon: HandCoins },
  { name: "Langganan", href: "/subscriptions", icon: Repeat },
  { name: "Wishlist", href: "/wishlist", icon: Target },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

// Switch tema berlabel untuk sidebar desktop
function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Ganti mode terang dan gelap"
      className="theme-switch relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-main transition"
    >
      <span className="flex items-center gap-2">
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
        {isDark ? "Mode gelap" : "Mode terang"}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
          isDark ? "bg-cyan-500/80" : "bg-slate-300"
        }`}
      >
        <span
          className={`theme-switch-thumb inline-block h-4 w-4 rounded-full ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showMobileNav, setShowMobileNav] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (href) => pathname === href;

  const handleConfirmLogout = () => {
    Swal.fire({
      title: "Keluar dari akun?",
      text: "Kamu harus masuk kembali untuk mengakses data keuanganmu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: isDark ? "#334155" : "#94a3b8",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#f1f5f9" : "#0f172a",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl font-bold px-5 py-2.5",
        cancelButton: "rounded-xl font-bold px-5 py-2.5",
      },
    }).then((result) => {
      if (result.isConfirmed) onLogout();
    });
  };

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setShowMobileNav(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowMobileNav(false), 3000);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="glass-strong sticky top-3 z-40 mx-3 mt-3 flex items-center justify-between rounded-2xl px-3.5 py-2.5 lg:hidden">
        <UserProfileBadge />
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleConfirmLogout}
            title="Keluar"
            aria-label="Keluar akun"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-500 transition active:scale-95"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="glass-strong fixed left-3 top-3 z-50 hidden h-[calc(100dvh-1.5rem)] w-[240px] select-none flex-col rounded-3xl p-4 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <Image
            src="/logo-aruskas.png"
            alt="Logo ArusKas"
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-main">
            Arus<span className="text-accent">Kas</span>
          </span>
        </Link>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {MENUS.map((menu) => {
            const active = isActive(menu.href);
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active ? "nav-active" : "nav-item border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2.5 pt-4">
          <ThemeSwitch />

          <div className="tile rounded-2xl p-3">
            <UserProfileBadge />
          </div>

          <button
            type="button"
            onClick={handleConfirmLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-subtle transition hover:text-rose-500"
          >
            <LogOut className="h-4 w-4" />
            Keluar akun
          </button>
        </div>
      </aside>

      {/* MODAL "LAINNYA" (MOBILE) */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col justify-end bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="glass-strong rounded-t-3xl p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-main">Menu lainnya</span>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                aria-label="Tutup menu"
                className="btn-icon inline-flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOBILE_SECONDARY_NAVS.map((menu) => {
                const active = isActive(menu.href);
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-semibold ${
                      active ? "nav-active" : "tile"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div
        className={`fixed inset-x-0 bottom-3 z-[999] mx-auto w-[92%] max-w-[420px] transition-all duration-500 lg:hidden ${
          showMobileNav ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <div className="glass-strong grid grid-cols-4 gap-1 rounded-2xl p-1.5">
          {MOBILE_MAIN_NAVS.map((menu) => {
            const active = isActive(menu.href);
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-300 ${
                  active ? "nav-active" : "nav-item border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap text-[10px] font-semibold">{menu.name}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-300 ${
              isMoreOpen ? "nav-active" : "nav-item border border-transparent"
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="whitespace-nowrap text-[10px] font-semibold">Lainnya</span>
          </button>
        </div>
      </div>
    </>
  );
}