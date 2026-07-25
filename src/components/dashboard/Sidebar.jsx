"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({
  user,
  onLogout,
}) {
  const pathname = usePathname();
  const [showMobileNav, setShowMobileNav] = useState(true);

  const menus = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: <Target size={20} />,
    },
  ];

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
          bg-black/30
          backdrop-blur-xl
          border-r
          border-white/10
          z-50
        "
      >
        {/* LOGO */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-3xl font-bold text-white">
            Arus<span className="text-blue-500">Kas</span>
          </h1>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-2xl
                transition-all duration-300

                ${pathname === menu.href
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="font-medium">{menu.name}</span>
            </Link>
          ))}
        </nav>

        {/* PROFILE */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-14 h-14
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-blue-700
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-xl
                "
              >
                {(
                  user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold truncate">
                  {user?.displayName || "User"}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="
                mt-4
                w-full
                py-3
                rounded-2xl
                bg-red-500/10
                border border-red-500/20
                text-red-400
                font-medium
                hover:bg-red-500/20
                transition-all
              "
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ========================= */}
      {/* MOBILE LIQUID GLASS NAV */}
      {/* ========================= */}
      <div
        className={`lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-[88%] max-w-[320px] transition-all duration-500 ${showMobileNav ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}`}>
        <div
          className="relative overflow-hidden bg-white/[0.06] backdrop-blur-3xl border border-white/10 rounded-[32px] px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">

          {/* Glow Background */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-around">
            {menus.map((menu) => {
              const active = pathname === menu.href;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`
              flex
              flex-col
              items-center
              justify-center

              gap-1

              px-4
              py-2

              rounded-2xl

              transition-all
              duration-300

              ${active
                      ? `
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/20
                    text-white
                    shadow-[0_0_25px_rgba(59,130,246,.35)]
                  `
                      : `
                    text-gray-400
                  `
                    }
            `}
                >
                  <span
                    className={`
                text-lg
                transition-all

                ${active
                        ? "scale-110"
                        : ""
                      }
              `}
                  >
                    {menu.icon}
                  </span>

                  <span
                    className={`
                text-[10px]
                font-medium
                whitespace-nowrap

                ${active
                        ? "text-white"
                        : "text-gray-400"
                      }
              `}
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