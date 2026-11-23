"use client";

import { useEffect, useState } from "react";
import { Edit3, Check, X, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TIPS = [
  "\"Jangan menabung apa yang tersisa setelah dibelanjakan, tapi belanjakan apa yang tersisa setelah ditabung.\" — Warren Buffett",
  "\"Bukan berapa banyak uang yang kamu hasilkan, tapi berapa banyak uang yang kamu simpan.\" — Robert Kiyosaki",
  "\"Seseorang bisa duduk di bawah pohon yang rindang hari ini karena ada yang menanamnya jauh hari sebelumnya.\" — Warren Buffett",
  "\"Kekayaan tidak terdiri dari memiliki banyak barang, tetapi memiliki sedikit keinginan.\" — Epictetus",
  "\"Aturan No. 1: Jangan pernah kehilangan uang. Aturan No. 2: Jangan pernah lupa aturan No. 1.\" — Warren Buffett",
  "\"Beli barang yang kamu butuhkan, bukan yang kamu inginkan. Jika membeli hal tak perlu, kelak kamu harus menjual hal yang dibutuhkan.\" — Benjamin Franklin",
];

const formatNumber = (value) => {
  const onlyDigits = String(value).replace(/\D/g, "");
  if (!onlyDigits) return "";
  return Number(onlyDigits).toLocaleString("id-ID");
};

const getCurrencySymbol = (curr) => {
  switch (curr) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "Rp";
  }
};

export default function BudgetTracker({ totalExpense = 0, currency = "IDR" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(800000);
  const [budgetInput, setBudgetInput] = useState("800.000");
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monthly_budget");
      const initialBudget = saved ? Number(saved) : 800000;
      setBudget(initialBudget);
      setBudgetInput(formatNumber(String(initialBudget)));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const openEditMode = () => {
    setBudgetInput(formatNumber(String(budget || 0)));
    setIsEditing(true);
  };

  const handleBudgetInputChange = (e) => {
    setBudgetInput(formatNumber(e.target.value));
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
  const percentage = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;
  const isOverBudget = totalExpense > budget;

  const barColor =
    percentage >= 90 ? "bg-rose-500" : percentage >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <section className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6">
      {!isEditing ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle">
              Batas pengeluaran
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-main">
              {formatCurrency(budget, currency)}
            </p>
            <button
              onClick={openEditMode}
              className="btn-ghost mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
            >
              <Edit3 className="h-3 w-3" />
              Ubah batas
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-subtle">Sisa belanja</p>
            <p
              className={`mt-2 text-xl font-bold ${
                isOverBudget ? "text-rose-500" : "text-emerald-500"
              }`}
            >
              {formatCurrency(remaining, currency)}
            </p>
          </div>
        </div>
      ) : (
        <div className="tile rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Atur batas pengeluaran
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSaveBudget}
                className="btn-primary inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                <Check className="h-3.5 w-3.5" /> Simpan
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn-ghost inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                <X className="h-3.5 w-3.5" /> Batal
              </button>
            </div>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-subtle">
              {getCurrencySymbol(currency)}
            </span>
            <input
              type="text"
              value={budgetInput}
              onChange={handleBudgetInputChange}
              placeholder="0"
              autoFocus
              className="input-glass w-full rounded-xl py-2.5 pl-12 pr-3 text-base font-bold"
            />
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-subtle">
            Terpakai: <strong className="font-semibold text-main">{percentage.toFixed(1)}%</strong>
          </span>
          {isOverBudget ? (
            <span className="chip rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-rose-500">
              Melewati batas
            </span>
          ) : percentage >= 70 ? (
            <span className="chip rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-amber-500">
              Perlu hemat
            </span>
          ) : (
            <span className="chip rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500">
              Masih aman
            </span>
          )}
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--track)]">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Tips (menempel di bawah agar sejajar) */}
      <div className="tile mt-auto flex items-start gap-3 rounded-2xl p-4 pt-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Lightbulb className="h-4 w-4" />
        </div>
        <p className="min-w-0 flex-1 text-xs italic leading-relaxed text-muted">
          {TIPS[tipIndex]}
        </p>
      </div>
    </section>
  );
}