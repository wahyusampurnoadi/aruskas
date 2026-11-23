"use client";

import { useMemo } from "react";
import {
  Activity,
  Lock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
} from "lucide-react";
import { usePro } from "@/app/hooks/usePro";

const BAR_TRACK = "relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--track)]";

export default function FinancialHealthCard({
  income = 0,
  expense = 0,
  totalSavings = 0,
  monthlyDebt = 0,
  onUpgrade,
}) {
  const { isPro } = usePro();

  const metrics = useMemo(() => {
    const hasData = income > 0 || expense > 0;

    if (!hasData) {
      return {
        hasData: false,
        savingsRatio: "-",
        debtRatio: "-",
        emergencyMonths: "-",
        score: "-",
        status: { label: "Belum ada transaksi", color: "text-subtle", bg: "" },
      };
    }

    const rawSavingsRatio = ((income - expense) / income) * 100;
    const rawDebtRatio = (monthlyDebt / income) * 100;
    const rawEmergencyMonths =
      expense > 0 ? totalSavings / expense : totalSavings > 0 ? 6 : 0;

    let score = 0;
    if (rawSavingsRatio >= 20) score += 40;
    else if (rawSavingsRatio > 0) score += (rawSavingsRatio / 20) * 40;

    if (rawDebtRatio <= 30) score += 35;
    else if (rawDebtRatio < 50) score += ((50 - rawDebtRatio) / 20) * 35;

    if (rawEmergencyMonths >= 6) score += 25;
    else if (rawEmergencyMonths > 0) score += (rawEmergencyMonths / 6) * 25;

    const finalScore = Math.min(100, Math.max(0, Math.round(score)));

    let status = { label: "Kritis", color: "text-rose-500", bg: "bg-rose-500/10" };
    if (finalScore >= 80) {
      status = { label: "Sangat sehat", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    } else if (finalScore >= 60) {
      status = { label: "Cukup sehat", color: "text-accent", bg: "bg-accent/10" };
    } else if (finalScore >= 40) {
      status = { label: "Perlu perhatian", color: "text-amber-500", bg: "bg-amber-500/10" };
    }

    // Bar dua arah: nilai positif ke kanan, negatif ke kiri dari tengah
    const bipolar = (value, maxScale) => {
      if (value === 0) return { left: "50%", width: "0%" };
      const pct = Math.min(50, (Math.abs(value) / maxScale) * 50);
      return value > 0
        ? { left: "50%", width: `${pct}%` }
        : { left: `${50 - pct}%`, width: `${pct}%` };
    };

    return {
      hasData: true,
      savingsRatio: `${rawSavingsRatio.toFixed(1)}%`,
      debtRatio: `${rawDebtRatio.toFixed(1)}%`,
      emergencyMonths: `${rawEmergencyMonths.toFixed(1)} bln`,
      rawSavingsRatio,
      rawDebtRatio,
      rawEmergencyMonths,
      savingsStyle: bipolar(rawSavingsRatio, 50),
      debtStyle: { left: "0%", width: `${Math.min(100, rawDebtRatio)}%` },
      emergencyStyle: bipolar(rawEmergencyMonths, 6),
      score: finalScore,
      status,
    };
  }, [income, expense, totalSavings, monthlyDebt]);

  const savingsTone = !metrics.hasData
    ? "text-subtle"
    : metrics.rawSavingsRatio < 0
    ? "text-rose-500"
    : metrics.rawSavingsRatio >= 20
    ? "text-emerald-500"
    : "text-amber-500";

  const debtTone = !metrics.hasData
    ? "text-subtle"
    : metrics.rawDebtRatio <= 30
    ? "text-emerald-500"
    : "text-rose-500";

  const emergencyTone = !metrics.hasData
    ? "text-subtle"
    : metrics.rawEmergencyMonths >= 3
    ? "text-emerald-500"
    : "text-amber-500";

  const insight = !metrics.hasData
    ? {
        icon: FileQuestion,
        tone: "text-subtle",
        text: "Belum ada transaksi pada periode ini. Catat pemasukan dan pengeluaran untuk melihat analisis skor kesehatan.",
      }
    : metrics.score >= 70
    ? {
        icon: CheckCircle2,
        tone: "text-emerald-500",
        text:
          metrics.score >= 80
            ? "Keuangan Anda sangat sehat. Alokasikan surplus ke investasi jangka panjang."
            : "Kondisi stabil. Kurangi pengeluaran sekunder agar rasio tabungan mendekati 20%.",
      }
    : {
        icon: AlertTriangle,
        tone: "text-amber-500",
        text: "Beban utang atau alokasi tabungan berada di luar batas aman. Prioritaskan pelunasan utang berbunga tinggi.",
      };

  const InsightIcon = insight.icon;

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="chip flex h-10 w-10 items-center justify-center rounded-xl text-accent">
            <Activity size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-main">Financial health</h2>
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-900">
                Pro
              </span>
            </div>
            <p className="mt-0.5 text-xs text-subtle">Rasio kesehatan keuangan Anda</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col">
        {/* Overlay untuk non-Pro */}
        {!isPro && (
          <div className="glass-strong absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
              <Lock size={22} />
            </div>
            <h3 className="mb-1 text-base font-bold text-main">Fitur khusus akun Pro</h3>
            <p className="mb-5 max-w-sm text-xs leading-relaxed text-muted">
              Buka analisis rasio tabungan, beban utang, dan rekomendasi otomatis untuk menjaga stabilitas keuangan.
            </p>
            <button
              onClick={onUpgrade}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              <Sparkles size={14} />
              Upgrade ke Pro
            </button>
          </div>
        )}

        <div
          className={`grid flex-1 grid-cols-1 gap-5 sm:grid-cols-12 ${
            !isPro ? "pointer-events-none select-none blur-sm" : ""
          }`}
        >
          {/* Skor */}
          <div className="tile flex flex-col items-center justify-center rounded-2xl p-6 text-center sm:col-span-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-subtle">
              Skor kesehatan
            </span>
            <div className="my-3 flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tight text-gradient">
                {metrics.score}
              </span>
              {metrics.hasData && <span className="text-sm font-bold text-subtle">/100</span>}
            </div>
            <span
              className={`chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${metrics.status.color}`}
            >
              {metrics.hasData ? <ShieldCheck size={13} /> : <FileQuestion size={13} />}
              {metrics.status.label}
            </span>
          </div>

          {/* Metrik */}
          <div className="flex flex-col gap-3 sm:col-span-7">
            <div className="tile rounded-2xl p-4">
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-main">
                  Rasio tabungan
                  <HelpCircle size={12} className="text-subtle" />
                </span>
                <span className={`font-bold ${savingsTone}`}>
                  {metrics.savingsRatio}{" "}
                  <span className="font-normal text-subtle">(ideal ≥ 20%)</span>
                </span>
              </div>
              <div className={BAR_TRACK}>
                <div className="absolute left-1/2 top-0 bottom-0 z-10 w-px bg-[var(--text-subtle)]" />
                {metrics.hasData && (
                  <div
                    className={`absolute h-full rounded-full transition-all duration-500 ${
                      metrics.rawSavingsRatio < 0 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={metrics.savingsStyle}
                  />
                )}
              </div>
            </div>

            <div className="tile rounded-2xl p-4">
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-main">
                  Rasio beban utang
                  <HelpCircle size={12} className="text-subtle" />
                </span>
                <span className={`font-bold ${debtTone}`}>
                  {metrics.debtRatio}{" "}
                  <span className="font-normal text-subtle">(ideal ≤ 30%)</span>
                </span>
              </div>
              <div className={BAR_TRACK}>
                {metrics.hasData && (
                  <div
                    className={`absolute h-full rounded-full transition-all duration-500 ${
                      metrics.rawDebtRatio <= 30 ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                    style={metrics.debtStyle}
                  />
                )}
              </div>
            </div>

            <div className="tile rounded-2xl p-4">
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-main">
                  Dana darurat
                  <HelpCircle size={12} className="text-subtle" />
                </span>
                <span className={`font-bold ${emergencyTone}`}>
                  {metrics.emergencyMonths}{" "}
                  <span className="font-normal text-subtle">(ideal ≥ 3–6 bln)</span>
                </span>
              </div>
              <div className={BAR_TRACK}>
                <div className="absolute left-1/2 top-0 bottom-0 z-10 w-px bg-[var(--text-subtle)]" />
                {metrics.hasData && (
                  <div
                    className={`absolute h-full rounded-full transition-all duration-500 ${
                      metrics.rawEmergencyMonths < 0 ? "bg-rose-500" : "bg-accent"
                    }`}
                    style={metrics.emergencyStyle}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insight */}
        {isPro && (
          <div className="tile mt-5 flex items-start gap-3 rounded-2xl p-4 text-xs">
            <InsightIcon size={16} className={`mt-0.5 shrink-0 ${insight.tone}`} />
            <span className="leading-relaxed text-muted">{insight.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}