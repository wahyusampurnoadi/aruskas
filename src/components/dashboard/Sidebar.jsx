"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  HandCoins,
  Calculator,
  Repeat,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserProfileBadge from "@/components/premium/UserProfileBadge";

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Daftar Semua Menu Utama (Untuk Tampilan Desktop)
  const menus = [
    {
      name: "Dashboard",
      mobileName: "Beranda",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Dompet",
      mobileName: "Dompet",
      href: "/wallets",
      icon: Wallet,
    },
    {
      name: "Hutang Piutang",
      mobileName: "Hutang",
      href: "/debts",
      icon: HandCoins,
    },
    {
      name: "Langganan",
      mobileName: "Rutin",
      href: "/subscriptions",
      icon: Repeat,
    },
    {
      name: "Wishlist",
      mobileName: "Target",
      href: "/wishlist",
      icon: Target,
    },
    {
      name: "Simulasi",
      mobileName: "Simulasi",
      href: "/calculator",
      icon: Calculator,
    },
    {
      name: "Pengaturan",
      mobileName: "Setelan",
      href: "/settings",
      icon: Settings,
    },
  ];

  // 3 Menu Utama yang selalu tampil di Bottom Bar Mobile
  const mobileMainNavs = [
    {
      name: "Beranda",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Dompet",
      href: "/wallets",
      icon: Wallet,
    },
    {
      name: "Simulasi",
      href: "/calculator",
      icon: Calculator,
    },
  ];

  // Menu Sekunder yang dimasukkan ke modal "Lainnya" di Mobile
  const mobileSecondaryNavs = [
    {
      name: "Hutang Piutang",
      href: "/debts",
      icon: HandCoins,
    },
    {
      name: "Langganan",
      href: "/subscriptions",
      icon: Repeat,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Target,
    },
    {
      name: "Pengaturan",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Handler Konfirmasi Logout dengan SweetAlert2
  const handleConfirmLogout = () => {
    Swal.fire({
      title: "Keluar dari Akun?",
      text: "Kamu harus masuk kembali untuk mengakses data keuanganmu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#0f172a",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl",
        title: "text-white font-bold",
        htmlContainer: "text-slate-300",
        confirmButton: "rounded-xl font-bold px-5 py-2.5",
        cancelButton: "rounded-xl font-bold px-5 py-2.5",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  // Efek Auto-hide Navigasi Mobile Saat Scroll
  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      setShowMobileNav(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowMobileNav(false);
      }, 3000);
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
      {/* ========================= */}
      {/* MOBILE TOP HEADER PROFILE */}
      {/* ========================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-[#070d19]/80 backdrop-blur-2xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <UserProfileBadge />

        {/* Tombol Logout Mobile */}
        <button
          onClick={handleConfirmLogout}
          title="Keluar Akun"
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ml-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Keluar</span>
        </button>
      </header>

      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}
      <aside
        className="
          hidden lg:flex
          flex-col
          fixed
          left-0
          top-0
          h-screen
          w-[280px]
          bg-[#070d19]/80
          backdrop-blur-2xl
          border-r
          border-white/10
          p-4
          z-50
          select-none
        "
      >
        {/* BRANDING HEADER (FIXED DI ATAS) */}
        <div className="flex items-center gap-3 px-3 py-3 mb-2 shrink-0">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Image
              src="/logo-aruskas.png"
              alt="Logo ArusKas"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">
              Arus<span className="text-cyan-400">Kas</span>
            </h1>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Financial App
            </span>
          </div>
        </div>

        {/* NAVIGASI MENU DESKTOP */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 px-2 py-3 my-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <p className="px-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            Menu Utama
          </p>

          {menus.map((menu) => {
            const active = pathname === menu.href;
            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`
                  relative flex items-center justify-between
                  px-4 py-2.5 rounded-2xl
                  font-medium text-sm
                  transition-all duration-200 group
                  ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/40 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#22d3ee]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active
                        ? "text-cyan-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{menu.name}</span>
                </div>

                {active && <ChevronRight className="w-4 h-4 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* PROFILE CARD & LOGOUT DESKTOP */}
        <div className="pt-2 px-2 pb-2 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3">
            {/* Panggil komponen UserProfileBadge agar modular */}
            <UserProfileBadge />

            <button
              onClick={handleConfirmLogout}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================= */}
      {/* MOBILE DRAWER / BOTTOM SHEET "LAINNYA"  */}
      {/* ======================================= */}
      {isMoreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex justify-end flex-col"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="bg-[#070d19] border-t border-white/15 rounded-t-[28px] p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white">Menu Lainnya</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {mobileSecondaryNavs.map((menu) => {
                const active = pathname === menu.href;
                const Icon = menu.icon;

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
                      active
                        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                        : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-cyan-400" : "text-slate-400"}
                    />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* MOBILE BOTTOM NAV BAR (4 ITEM) */}
      {/* ========================= */}
      <div
        className={`lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-[440px] transition-all duration-500 ${
          showMobileNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden bg-[#070d19]/90 backdrop-blur-3xl border border-white/15 rounded-[26px] px-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="relative grid grid-cols-4 items-center gap-1">
            {/* 3 Menu Utama */}
            {mobileMainNavs.map((menu) => {
              const active = pathname === menu.href;
              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`
                    flex flex-col items-center justify-center
                    py-1.5 px-0.5 rounded-2xl
                    transition-all duration-300 select-none
                    ${
                      active
                        ? "bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      active ? "scale-110 text-cyan-400" : ""
                    }`}
                  />
                  <span
                    className={`text-[9px] sm:text-[10px] font-semibold tracking-tight whitespace-nowrap mt-1 ${
                      active ? "text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    {menu.name}
                  </span>
                </Link>
              );
            })}

            {/* Tombol Trigger Modal "Lainnya" */}
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`
                flex flex-col items-center justify-center
                py-1.5 px-0.5 rounded-2xl
                transition-all duration-300 select-none cursor-pointer
                ${
                  isMoreOpen
                    ? "bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }
              `}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight whitespace-nowrap mt-1 text-slate-400">
                Lainnya
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}