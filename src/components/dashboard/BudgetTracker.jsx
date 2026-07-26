"use client";

import { useEffect, useState } from "react";
import { Edit3, Check, X, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BudgetTracker({ totalExpense = 0, currency = "IDR" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(800000);
  const [budgetInput, setBudgetInput] = useState("800.000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monthly_budget");
      const initialBudget = saved ? Number(saved) : 800000;
      setBudget(initialBudget);
      setBudgetInput(formatNumber(String(initialBudget)));
    }
  }, []);

  const formatNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (!onlyDigits) return "";
    return Number(onlyDigits).toLocaleString("id-ID");
  };

  const openEditMode = () => {
    setBudgetInput(formatNumber(String(budget || 0)));
    setIsEditing(true);
  };

  const handleBudgetInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setBudgetInput(raw ? Number(raw).toLocaleString("id-ID") : "");
  };

  const handleSaveBudget = () => {
    const numericBudget = Number(budgetInput.replace(/\D/g, "")) || 0;
    setBudget(numericBudget);

    if (typeof window !== "undefined") {
      localStorage.setItem("monthly_budget", String(numericBudget));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setBudgetInput(formatNumber(String(budget || 0)));
    setIsEditing(false);
  };

  const remaining = Math.max(budget - totalExpense, 0);
  const percentage =
    budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;
  const isOverBudget = totalExpense > budget;

  const tips = [
    "Simpan minimal 20% pendapatanmu untuk tabungan.",
    "Dana darurat idealnya 3–6 kali pengeluaran bulanan.",
    "Catat setiap pengeluaran kecil agar tidak bocor.",
    "Hindari membeli barang hanya karena diskon.",
    "Prioritaskan kebutuhan dibanding keinginan.",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  // Helper untuk mendapatkan simbol mata uang pada input form edit
  const getCurrencySymbol = (curr) => {
    switch (curr) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return "Rp";
    }
  };

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-5 sm:p-6 shadow-2xl transition-all duration-500">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* HEADER & EDIT MODE */}
        {!isEditing ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Batas Pengeluaran
                </p>
                <button
                  onClick={openEditMode}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Ubah Batas</span>
                </button>
              </div>
              <div className="mt-1 text-white text-2xl sm:text-3xl font-black">
                {formatCurrency(budget, currency)}
              </div>
            </div>

            {/* SISA BATAS BELANJA */}
            <div className="sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
              <p className="text-xs font-medium text-slate-400">Sisa Batas Belanja</p>
              <div className={`text-xl sm:text-2xl font-bold ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                {formatCurrency(remaining, currency)}
              </div>
            </div>
          </div>
        ) : (
          /* MODE EDIT RINGKAS */
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Atur Batas Pengeluaran
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBudget}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-400 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" /> Simpan
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" /> Batal
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="text"
                value={budgetInput}
                onChange={handleBudgetInputChange}
                placeholder="0"
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-3 text-base font-bold text-white outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>
        )}

        {/* PROGRESS BAR & STATS */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Terpakai: <strong className="text-white font-semibold">{percentage.toFixed(1)}%</strong>
            </span>
            {isOverBudget ? (
              <span className="rounded-full bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
                Melewati Batas
              </span>
            ) : percentage >= 70 ? (
              <span className="rounded-full bg-amber-500/15 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                Perlu Hemat
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                Masih Aman
              </span>
            )}
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                percentage >= 90
                  ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                  : percentage >= 70
                  ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                  : "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* TIPS RINGKAS (FOOTER - RAPI DI MOBILE) */}
        <div className="mt-5 flex items-start sm:items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-xs backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/20 mt-0.5 sm:mt-0">
            <Lightbulb className="h-4 w-4" />
          </div>
          <p className="min-w-0 flex-1 text-slate-300 italic leading-relaxed line-clamp-2 sm:line-clamp-none">
            &ldquo;{tips[tipIndex]}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}