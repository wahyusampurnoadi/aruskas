"use client";

import { useState } from "react";
import { X, Banknote, Wallet, CheckCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b1329] border border-white/10 p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bayar / Cicil Pinjaman</h2>
              <p className="text-xs text-slate-400">Pencatatan pembayaran {debtItem.personName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="font-semibold text-white">
                {isPiutang ? "Penerimaan Piutang" : "Pelunasan Hutang"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sisa Tagihan Saat Ini:</span>
              <span className="font-bold text-cyan-400">
                Rp {remaining.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nominal Pembayaran (Rp)
            </label>
            <input
              type="text"
              required
              placeholder={`Maksimal Rp ${remaining.toLocaleString("id-ID")}`}
              value={formatRupiahInput(payAmount)}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm font-bold focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={recordTransaction}
                onChange={(e) => setRecordTransaction(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
              <span>Catat otomatis ke Transaksi Kas ({isPiutang ? "Pemasukan" : "Pengeluaran"})</span>
            </label>

            {recordTransaction && (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Pilih Dompet / Aset:</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="BCA Utama">BCA Utama</option>
                    <option value="GoPay / E-Wallet">GoPay / E-Wallet</option>
                    <option value="Dompet Tunai">Dompet Tunai</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Pembayaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
