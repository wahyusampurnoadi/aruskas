"use client";

import { Target, TrendingUp, BarChart3 } from "lucide-react";

const getFontSizeClass = (text) => {
  const length = text ? text.length : 0;
  if (length > 18) return "text-lg sm:text-xl";
  if (length > 14) return "text-xl sm:text-2xl";
  if (length > 10) return "text-2xl sm:text-3xl";
  return "text-3xl sm:text-4xl";
};

function SummaryRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-3 last:border-b-0">
      <span className="shrink-0 text-xs font-medium text-muted">{label}</span>
      <span className={`whitespace-nowrap text-right text-sm font-bold ${tone}`}>{value}</span>
    </div>
  );
}

export default function Result({
  mode,
  targetAmount,
  currentSavings,
  remainingTarget,
  estimatedMonthsNeeded,
  requiredMonthlySavings,
  formatRp,
}) {
  const formattedRequiredMonthly = formatRp(requiredMonthlySavings);
  const isTarget = mode === "target";

  return (
    <section className="glass-strong relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-8">
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <div className="flex items-center gap-3">
            <div className="chip flex h-10 w-10 items-center justify-center rounded-xl text-accent">
              <Target size={18} />
            </div>
            <h2 className="text-base font-bold text-main">Hasil estimasi</h2>
          </div>
          <BarChart3 size={18} className="text-subtle" />
        </div>

        {/* Hero hasil */}
        <div className="tile mt-6 rounded-2xl p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle">
            {isTarget ? "Estimasi waktu tercapai" : "Tabungan rutin / bulan"}
          </p>

          {isTarget ? (
            <div className="mt-3">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black tracking-tight text-gradient sm:text-6xl">
                  {estimatedMonthsNeeded}
                </span>
                <span className="text-lg font-bold text-accent">Bulan</span>
              </div>
              <span className="chip mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-muted">
                ≈ {(estimatedMonthsNeeded / 12).toFixed(1)} tahun
              </span>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center">
              <div
                className={`whitespace-nowrap font-black tracking-tight text-gradient transition-all duration-200 ${getFontSizeClass(
                  formattedRequiredMonthly
                )}`}
              >
                {formattedRequiredMonthly}
              </div>
              <span className="mt-1 text-xs font-semibold text-subtle">/ bulan</span>
            </div>
          )}
        </div>

        {/* Rincian */}
        <div className="mt-6">
          <SummaryRow label="Total target dana" value={formatRp(targetAmount)} tone="text-main" />
          <SummaryRow label="Terkumpul sekarang" value={formatRp(currentSavings)} tone="text-emerald-500" />
          <SummaryRow label="Sisa kekurangan" value={formatRp(remainingTarget)} tone="text-rose-500" />
        </div>

        {/* Insight */}
        <div className="tile mt-auto flex items-start gap-3 rounded-2xl p-4 pt-4 text-xs">
          <TrendingUp size={16} className="mt-0.5 shrink-0 text-accent" />
          <span className="leading-relaxed text-muted">
            {isTarget
              ? "Menambah alokasi bulanan sebesar 10% dapat mempercepat target hingga beberapa bulan lebih awal."
              : "Konsistensi menabung di awal bulan membantu memastikan target Anda tercapai tepat waktu."}
          </span>
        </div>
      </div>
    </section>
  );
}