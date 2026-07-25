"use client";

import { useState } from "react";

export default function DepositModal({ open, goal, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !goal) return null;

  // Format angka ke string berpemisah titik (contoh: 515351 -> 515.351)
  const handleChangeAmount = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setAmount("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(rawValue);
    setAmount(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hapus titik sebelum dikonversi ke angka murni
    const numAmount = Number(amount.replace(/\./g, ""));

    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Masukkan nominal setoran yang valid!");
      return;
    }

    try {
      setIsSubmitting(true);
      if (typeof onConfirm === "function") {
        await onConfirm(goal.id, numAmount);
      }
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Gagal melakukan setoran:", error);
      alert("Terjadi kesalahan saat memproses setoran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h3 className="text-lg font-bold text-white">Setor Tabungan</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 rounded-2xl bg-slate-950/50 border border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</p>
          <p className="text-sm font-bold text-white">{goal.name}</p>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>Terkumpul:</span>
            <span className="text-emerald-400 font-bold">
              Rp {(Number(goal.current) || 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Nominal Setoran (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 500.000"
              value={amount}
              onChange={handleChangeAmount}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi Setor"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}