"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();
  const [showMobileNav, setShowMobileNav] = useState(true);

  // Daftar Menu Utama (Transaksi & Laporan dihapus, Pengaturan ditambahkan)
  const menus = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
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

        {/* PROFILE CARD & LOGOUT */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-base border border-white/20 shadow-inner">
                {(
                  user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"
                ).toUpperCase()}
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
              onClick={onLogout}
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
        className={`lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-[360px] transition-all duration-500 ${
          showMobileNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden bg-[#070d19]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] px-3 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          {/* Ambient Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="relative flex items-center justify-around">
            {menus.map((menu) => {
              const active = pathname === menu.href;
              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`
                    flex flex-col items-center justify-center
                    gap-1 px-3 py-2 rounded-2xl
                    transition-all duration-300
                    ${
                      active
                        ? "bg-white/10 backdrop-blur-xl border border-white/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                        : "text-slate-400 hover:text-slate-200"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      active ? "scale-110 text-cyan-400" : ""
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium whitespace-nowrap ${
                      active ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {menu.name}
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