"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Pencil, MessageCircle, PlusCircle, Trash2, User } from "lucide-react";
import { generateWhatsAppReminderLink } from "@/lib/debts";

const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

export default function DebtCard({ item, onPay, onEdit, onDelete }) {
  const isPiutang = item.type === "piutang";
  const total = Number(item.amount) || 0;
  const paid = Number(item.paidAmount) || 0;
  const remaining = Math.max(0, total - paid);

  const percentPaid = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const isPaidOff = remaining === 0;

  const today = new Date().toISOString().split("T")[0];
  const isOverdue = item.dueDate && item.dueDate < today && !isPaidOff;

  const waLink = generateWhatsAppReminderLink(item.personName, item.type, remaining, item.dueDate);

  const barClass = isPaidOff
    ? "bg-linear-to-r from-emerald-400 to-teal-500"
    : isPiutang
    ? "bg-linear-to-r from-emerald-500 to-teal-400"
    : "bg-linear-to-r from-rose-500 to-amber-500";

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 transition duration-300 hover:-translate-y-1 sm:p-6"
    >
      {/* Garis aksen sesuai jenis */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          isPiutang ? "bg-linear-to-r from-emerald-400 to-teal-500" : "bg-linear-to-r from-rose-400 to-amber-500"
        }`}
      />

      {/* Header kartu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isPiutang ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
            }`}
          >
            <User className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-main">{item.personName || "Tanpa nama"}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isPiutang
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-500"
                    : "border-rose-500/25 bg-rose-500/10 text-rose-500"
                }`}
              >
                {isPiutang ? "Piutang" : "Hutang"}
              </span>
              {isOverdue && (
                <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                  Jatuh tempo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Aksi: selalu terlihat */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onEdit(item)}
            title="Edit data"
            aria-label="Edit data"
            className="btn-icon inline-flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Hapus data"
            aria-label="Hapus data"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Ringkasan angka */}
      <div className="tile mt-5 space-y-3 rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Sisa tagihan</span>
          <span className="font-bold text-main">{formatRupiah(remaining)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Total pinjaman</span>
          <span className="font-semibold text-muted">{formatRupiah(total)}</span>
        </div>

        <div className="pt-1">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-subtle">Terbayar: {formatRupiah(paid)}</span>
            <span className="font-bold text-accent">{percentPaid}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--track)]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barClass}`}
              style={{ width: `${percentPaid}%` }}
            />
          </div>
        </div>
      </div>

      {/* Jatuh tempo & catatan */}
      <div className="mt-4 min-h-[44px] space-y-1.5 px-1">
        {item.dueDate && (
          <div className="flex items-center gap-2 text-xs text-subtle">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              Jatuh tempo: <strong className="font-semibold text-main">{item.dueDate}</strong>
            </span>
          </div>
        )}
        {item.notes && (
          <p className="line-clamp-2 text-xs italic leading-relaxed text-subtle">"{item.notes}"</p>
        )}
      </div>

      {/* Footer aksi (selalu di bawah) */}
      <div className="mt-auto flex items-center gap-2 border-t border-[var(--line)] pt-4">
        {!isPaidOff ? (
          <>
            <button
              onClick={() => onPay(item)}
              className="btn-primary flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              Bayar / cicil
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Kirim pengingat WhatsApp"
              aria-label="Kirim pengingat WhatsApp"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 transition hover:bg-emerald-500/25"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 py-2.5 text-xs font-semibold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Lunas sepenuhnya
          </div>
        )}
      </div>
    </motion.article>
  );
}