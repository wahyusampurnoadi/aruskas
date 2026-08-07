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
  Repeat,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();
  const [showMobileNav, setShowMobileNav] = useState(true);

  // Daftar Menu Utama
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
      name: "Pengaturan",
      mobileName: "Setelan",
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
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar User */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm border border-white/20 shadow-inner shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              (
                user?.displayName?.charAt(0) ||
                user?.email?.charAt(0) ||
                "U"
              ).toUpperCase()
            )}
          </div>

          {/* Nama & Email */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate leading-tight">
              {user?.displayName || "Pengguna"}
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {user?.email || "user@gmail.com"}
            </p>
          </div>
        </div>

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
          p-6
          justify-between
          z-50
          select-none
        "
      >
        <div>
          {/* BRANDING HEADER WITH CUSTOM LOGO */}
          <div className="flex items-center gap-3 px-2 py-2 mb-8">
            {/* CONTAINER LOGO */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
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

          {/* NAVIGASI MENU */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-3">
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
                    px-4 py-3 rounded-2xl
                    font-medium text-sm
                    transition-all duration-200 group
                    ${
                      active
                        ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }
                  `}
                >
                  {/* Indikator Menu Aktif */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
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
        </div>

        {/* PROFILE CARD & LOGOUT DESKTOP */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Avatar Circle */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-base border border-white/20 shadow-inner shrink-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (
                    user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"
                  ).toUpperCase()
                )}
              </div>

              {/* Detail Info User */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.displayName || "Pengguna"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "user@gmail.com"}
                </p>
              </div>
            </div>

            {/* Tombol Logout */}
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

      {/* ========================= */}
      {/* MOBILE LIQUID GLASS NAV */}
      {/* ========================= */}
      <div
        className={`lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-[440px] transition-all duration-500 ${
          showMobileNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden bg-[#070d19]/90 backdrop-blur-3xl border border-white/15 rounded-[26px] px-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
          {/* Ambient Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-1">
            {menus.map((menu) => {
              const active = pathname === menu.href;
              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`
                    flex-1 flex flex-col items-center justify-center
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
                    {menu.mobileName || menu.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}