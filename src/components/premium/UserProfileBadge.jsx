"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePro } from "@/app/hooks/usePro";

export default function UserProfileBadge() {
  const { user } = useAuth();
  const { isPro } = usePro();

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm border border-white/20 shadow-inner shrink-0">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user?.displayName || "User Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          (user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-white truncate leading-tight">
            {user?.displayName || "Pengguna"}
          </p>

          <span
            className={`px-1.5 py-0.5 text-[8px] font-black rounded tracking-wider uppercase shrink-0 ${
              isPro
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.2)]"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            {isPro ? "PRO" : "FREE"}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 truncate mt-0.5">
          {user?.email || "user@gmail.com"}
        </p>
      </div>
    </div>
  );
}