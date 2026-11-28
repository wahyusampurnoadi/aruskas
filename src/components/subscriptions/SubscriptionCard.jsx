"use client";

import { Calendar, Edit2, Play, Pause, Repeat, Trash2, Wallet, Zap } from "lucide-react";

const FREQUENCY_LABEL = {
  monthly: "Bulanan",
  weekly: "Mingguan",
  yearly: "Tahunan",
};

export default function SubscriptionCard({ item, onPayNow, onToggleStatus, onEdit, onDelete }) {
  const isExpense = item.type === "expense";
  const isActive = item.status === "active";
  const amount = Number(item.amount) || 0;

  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;
  const frequencyLabel = FREQUENCY_LABEL[item.frequency] || "Bulanan";

  return (
    <article
      className={`glass group relative flex flex-col justify-between overflow-hidden rounded-[24px] p-5 transition-all duration-300 sm:p-6 ${
        isActive ? "hover:-translate-y-0.5" : "opacity-60 hover:opacity-100"
      }`}
    >
      {/* Garis aksen tipis di atas */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] ${
          isExpense ? "bg-linear-to-r from-violet-400 to-indigo-500" : "bg-linear-to-r from-emerald-400 to-teal-500"
        }`}
      />

      <div>
        {/* Header kartu */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isExpense ? "bg-violet-500/15 text-violet-500" : "bg-emerald-500/15 text-emerald-500"
              }`}
            >
              <Repeat className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-main">{item.name || "Tanpa nama"}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="chip rounded-md px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {item.category || "Langganan"}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    isExpense ? "bg-violet-500/10 text-violet-500" : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {frequencyLabel}
                </span>
                {!isActive && (
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                    Dijeda
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => onToggleStatus(item)}
              title={isActive ? "Jeda langganan" : "Aktifkan langganan"}
              aria-label={isActive ? "Jeda langganan" : "Aktifkan langganan"}
              className="btn-icon inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
            >
              {isActive ? <Pause className="h-3.5 w-3.5 text-amber-500" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              title="Edit data"
              aria-label="Edit data"
              className="btn-icon inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              title="Hapus data"
              aria-label="Hapus data"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-subtle transition hover:bg-rose-500/10 hover:text-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Nominal & dompet */}
        <div className="tile space-y-3 rounded-2xl p-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-[11px] font-medium text-subtle">Nominal tagihan</span>
            <span
              className={`whitespace-nowrap text-right text-xl font-bold tracking-tight tabular-nums ${
                isExpense ? "text-main" : "text-emerald-500"
              }`}
            >
              {isExpense ? "−" : "+"} {formatRupiah(amount)}
            </span>
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--line)] pt-3 text-xs text-subtle">
            <Wallet className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Dompet: <span className="font-semibold text-main">{item.walletName || "BCA Utama"}</span>
            </span>
          </div>
        </div>

        {/* Jatuh tempo */}
        <div className="mt-4 flex items-center gap-2 px-1 text-xs text-subtle">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            Jatuh tempo berikutnya:{" "}
            <span className="font-semibold text-accent">{item.nextDueDate || "Belum diatur"}</span>
          </span>
        </div>
      </div>

      {/* Tombol bayar */}
      <div className="mt-5 border-t border-[var(--line)] pt-4">
        <button
          type="button"
          onClick={() => onPayNow(item)}
          disabled={!isActive}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            isActive
              ? "btn-primary active:scale-95"
              : "cursor-not-allowed bg-[var(--track)] text-subtle"
          }`}
        >
          <Zap className="h-4 w-4 fill-current" />
          <span>Bayar sekarang (catat kas)</span>
        </button>
      </div>
    </article>
  );
}