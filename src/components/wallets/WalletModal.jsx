"use client";

import { X } from "lucide-react";

export default function WalletModal({
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
        className="glass-strong relative w-full max-w-md rounded-t-[28px] p-6 sm:rounded-[28px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-main">{title}</h3>
            <p className="mt-0.5 text-xs text-subtle">Lengkapi data dompet atau aset</p>
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
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Nama dompet / aset</label>
            <input
              type="text"
              placeholder="Contoh: BCA Utama, Bibit, Rumah BSD"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input-glass w-full rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Tipe / kategori</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-glass w-full cursor-pointer rounded-xl px-4 py-3 text-sm"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Cash">Cash / tunai</option>
              <option value="Saham">Saham</option>
              <option value="Crypto">Crypto</option>
              <option value="Deposito">Deposito</option>
              <option value="Obligasi">Obligasi</option>
              <option value="Reksadana">Reksadana</option>
              <option value="Properti">Properti</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Nomor rekening / keterangan</label>
            <input
              type="text"
              placeholder="Opsional (no. rekening, RDN, sub-rekening)"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="input-glass w-full rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Saldo / nilai aset (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formData.balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: formatRupiahInput(e.target.value),
                })
              }
              required
              className="input-glass w-full rounded-xl px-4 py-3 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost rounded-xl py-3 text-sm font-semibold"
            >
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