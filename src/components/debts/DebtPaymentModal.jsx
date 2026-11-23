"use client";

import { useState } from "react";
import { X, Banknote, Wallet, CheckCircle } from "lucide-react";

const WALLET_OPTIONS = ["BCA Utama", "GoPay / E-Wallet", "Dompet Tunai"];

export default function DebtPaymentModal({
  isOpen,
  debtItem,
  onConfirmPayment,
  onClose,
  formatRupiahInput,
  parseRupiahInput,
}) {
  const [payAmount, setPayAmount] = useState("");
  const [recordTransaction, setRecordTransaction] = useState(true);
  const [walletName, setWalletName] = useState("BCA Utama");

  if (!isOpen || !debtItem) return null;

  const total = Number(debtItem.amount) || 0;
  const currentPaid = Number(debtItem.paidAmount) || 0;
  const remaining = Math.max(0, total - currentPaid);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseRupiahInput(payAmount);
    if (!amountNum || amountNum <= 0) return;

    onConfirmPayment({
      debtId: debtItem.id,
      amountPaid: amountNum,
      recordTransaction,
      walletName,
      debtItem,
    });

    setPayAmount("");
  };

  const isPiutang = debtItem.type === "piutang";

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
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
              <Banknote className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-main">Bayar / cicil pinjaman</h2>
              <p className="text-xs text-subtle">Pencatatan pembayaran {debtItem.personName}</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ringkasan tagihan */}
          <div className="tile grid grid-cols-2 gap-3 rounded-2xl p-4">
            <div>
              <p className="text-[11px] text-subtle">Status</p>
              <p className="mt-0.5 text-xs font-bold text-main">
                {isPiutang ? "Penerimaan piutang" : "Pelunasan hutang"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-subtle">Sisa tagihan</p>
              <p className="mt-0.5 text-xs font-bold text-accent">Rp {remaining.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-main">Nominal pembayaran (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder={`Maksimal Rp ${remaining.toLocaleString("id-ID")}`}
              value={formatRupiahInput(payAmount)}
              onChange={(e) => setPayAmount(e.target.value)}
              className="input-glass w-full rounded-xl px-4 py-2.5 text-sm font-bold"
            />
          </div>

          {/* Opsi catat kas */}
          <div className="tile space-y-3 rounded-2xl p-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-main">
              <input
                type="checkbox"
                checked={recordTransaction}
                onChange={(e) => setRecordTransaction(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-cyan-500"
              />
              <span>
                Catat otomatis ke transaksi kas ({isPiutang ? "pemasukan" : "pengeluaran"})
              </span>
            </label>

            {recordTransaction && (
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-subtle">Pilih dompet / aset</label>
                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  <select
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="input-glass w-full cursor-pointer rounded-xl py-2.5 pl-10 pr-4 text-sm"
                  >
                    {WALLET_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost rounded-xl py-3 text-sm font-semibold">
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <CheckCircle className="h-4 w-4" />
              Simpan pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}