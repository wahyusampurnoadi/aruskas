"use client";

import { X, HandCoins, User, Calendar, FileText } from "lucide-react";

export default function DebtModal({
  isOpen,
  title,
  submitLabel,
  formData,
  setFormData,
  onSubmit,
  onClose,
  formatRupiahInput,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 left-0 right-0 z-[9999] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm lg:left-[280px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="glass-strong relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] p-6 [scrollbar-gutter:stable] sm:rounded-[28px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="chip flex h-10 w-10 items-center justify-center rounded-2xl text-accent">
              <HandCoins className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-main">{title}</h2>
              <p className="text-xs text-subtle">Pencatatan pinjaman atau hutang</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn-icon inline-flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Jenis catatan */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Jenis catatan</label>
            <div className="tile grid grid-cols-2 gap-1 rounded-2xl p-1">
              {[
                { key: "piutang", label: "Piutang (saya pinjamkan)", active: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30" },
                { key: "hutang", label: "Hutang (saya utang)", active: "bg-rose-500/15 text-rose-500 border border-rose-500/30" },
              ].map((opt) => {
                const active = formData.type === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: opt.key })}
                    className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      active ? opt.active : "text-subtle hover:text-main"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Nama orang / pihak terkait</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                required
                placeholder="Contoh: Budi, Toko Komputer, atau Andi"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                className="input-glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Total nominal pinjaman (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder="0"
              value={formatRupiahInput(formData.amount)}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-glass w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Nominal yang sudah terbayar (awal)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0 (jika belum pernah dicicil)"
              value={formatRupiahInput(formData.paidAmount)}
              onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              className="input-glass w-full rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Tanggal jatuh tempo (opsional)</label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Catatan / keterangan</label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-subtle" />
              <textarea
                rows={2}
                placeholder="Contoh: pinjam untuk urusan katering event..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-glass w-full resize-none rounded-xl py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost rounded-xl py-3 text-sm font-semibold">
              Batal
            </button>
            <button type="submit" className="btn-primary rounded-xl py-3 text-sm font-semibold">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}