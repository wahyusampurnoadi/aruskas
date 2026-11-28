"use client";

import { X, Repeat, Calendar, Wallet, Tag } from "lucide-react";

const LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle";
const FIELD = "input-glass w-full rounded-xl px-4 py-2.5 text-sm";

export default function SubscriptionModal({
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
      className="fixed inset-y-0 left-0 right-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 lg:left-[280px]"
      onClick={onClose}
    >
      <div
        className="glass-strong relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] p-5 [scrollbar-gutter:stable] sm:max-w-lg sm:rounded-[28px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-500">
              <Repeat className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-main">{title}</h2>
              <p className="text-xs text-subtle">Pengaturan transaksi berulang & langganan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Tipe transaksi */}
          <div>
            <label className={LABEL}>Tipe transaksi</label>
            <div className="tile grid grid-cols-2 gap-1 rounded-2xl p-1">
              {[
                { key: "expense", label: "Pengeluaran rutin" },
                { key: "income", label: "Pemasukan rutin" },
              ].map((opt) => {
                const active = formData.type === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: opt.key })}
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      active ? "btn-primary" : "text-muted hover:text-main"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className={LABEL}>Nama langganan / layanan</label>
            <input
              type="text"
              required
              placeholder="misal: Netflix, Wifi Biznet, Gaji bulanan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={FIELD}
            />
          </div>

          {/* Nominal */}
          <div>
            <label className={LABEL}>Nominal (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder="0"
              value={formatRupiahInput(formData.amount)}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`${FIELD} font-semibold`}
            />
          </div>

          {/* Frekuensi & kategori */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Frekuensi</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className={FIELD}
              >
                <option value="monthly">Bulanan</option>
                <option value="weekly">Mingguan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>

            <div>
              <label className={LABEL}>Kategori</label>
              <div className="relative">
                <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  type="text"
                  placeholder="Langganan, Wifi, Hiburan"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`${FIELD} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Dompet & jatuh tempo */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Dompet terkait</label>
              <div className="relative">
                <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <select
                  value={formData.walletName}
                  onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
                  className={`${FIELD} pl-10`}
                >
                  <option value="BCA Utama">BCA Utama</option>
                  <option value="GoPay / E-Wallet">GoPay / E-Wallet</option>
                  <option value="Dompet Tunai">Dompet Tunai</option>
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL}>Jatuh tempo berikutnya</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  type="date"
                  required
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  className={`${FIELD} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Aksi */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--line)] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost cursor-pointer rounded-xl px-5 py-2.5 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary cursor-pointer rounded-xl px-6 py-2.5 text-xs font-semibold active:scale-95"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}