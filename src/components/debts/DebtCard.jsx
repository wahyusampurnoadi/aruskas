"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  MessageCircle,
  PlusCircle,
  Trash2,
  User,
} from "lucide-react";
import { generateWhatsAppReminderLink } from "@/lib/debts";

export default function DebtCard({ item, onPay, onEdit, onDelete }) {
  const isPiutang = item.type === "piutang";
  const total = Number(item.amount) || 0;
  const paid = Number(item.paidAmount) || 0;
  const remaining = Math.max(0, total - paid);

  const percentPaid = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const isPaidOff = remaining === 0;

  const formatRupiah = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  // Check if overdue
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = item.dueDate && item.dueDate < today && !isPaidOff;

  const waLink = generateWhatsAppReminderLink(
    item.personName,
    item.type,
    remaining,
    item.dueDate
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 hover:border-white/20 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
      {/* Top Header Card */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base border shrink-0 ${
                isPiutang
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-400"
              }`}
            >
              <User className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {item.personName || "Tanpa Nama"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                    isPiutang
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {isPiutang ? "Piutang (Dipiutangkan)" : "Hutang (Saya Utang)"}
                </span>

                {isOverdue && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    Jatuh Tempo!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
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

        {/* Amount Stats */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sisa Tagihan</span>
            <span className="font-semibold text-white">{formatRupiah(remaining)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Pinjaman</span>
            <span>{formatRupiah(total)}</span>
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Terbayar: {formatRupiah(paid)}</span>
              <span className="font-bold text-cyan-400">{percentPaid}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isPaidOff
                    ? "bg-emerald-400"
                    : isPiutang
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-rose-500 to-amber-500"
                }`}
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Due Date & Notes */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4 px-1">
          {item.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Jatuh Tempo: <strong className="text-slate-300">{item.dueDate}</strong></span>
            </div>
          )}
          {item.notes && (
            <p className="text-[11px] text-slate-500 italic line-clamp-2">
              "{item.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
        {!isPaidOff ? (
          <button
            onClick={() => onPay(item)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Bayar / Cicil</span>
          </button>
        ) : (
          <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Lunas Sepenuhnya</span>
          </div>
        )}

        {!isPaidOff && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Kirim Pengingat WhatsApp"
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
