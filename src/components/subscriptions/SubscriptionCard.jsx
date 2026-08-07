"use client";

import {
  Calendar,
  CheckCircle2,
  Edit2,
  Play,
  Pause,
  Repeat,
  Trash2,
  Wallet,
  Zap,
} from "lucide-react";

export default function SubscriptionCard({
  item,
  onPayNow,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const isExpense = item.type === "expense";
  const isActive = item.status === "active";
  const amount = Number(item.amount) || 0;

  const formatRupiah = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const frequencyLabel = {
    monthly: "Bulanan",
    weekly: "Mingguan",
    yearly: "Tahunan",
  }[item.frequency] || "Bulanan";

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-slate-900/50 border transition-all duration-300 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between ${
        isActive
          ? "border-white/10 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]"
          : "border-white/5 opacity-60 hover:opacity-100"
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base border shrink-0 ${
                isExpense
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <Repeat className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {item.name || "Tanpa Nama"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                  {item.category || "Langganan"}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  {frequencyLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggleStatus(item)}
              title={isActive ? "Jeda Langganan" : "Aktifkan Langganan"}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isActive ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => onEdit(item)}
              title="Edit Data"
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Hapus Data"
              className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount & Wallet */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Nominal Tagihan</span>
            <span className={`text-lg font-bold ${isExpense ? "text-white" : "text-emerald-400"}`}>
              {isExpense ? "-" : "+"}{formatRupiah(amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              <span>Dompet: <strong className="text-slate-300">{item.walletName || "BCA Utama"}</strong></span>
            </div>
          </div>
        </div>

        {/* Next Due Date */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4 px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Jatuh Tempo Berikutnya: <strong className="text-violet-300">{item.nextDueDate || "Belum diatur"}</strong></span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-white/10">
        <button
          onClick={() => onPayNow(item)}
          disabled={!isActive}
          className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isActive
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md active:scale-95"
              : "bg-white/5 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Bayar Sekarang (Catat Kas)</span>
        </button>
      </div>
    </div>
  );
}
