"use client";

import { useState } from "react";

export default function AddGoalModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const todayISO = new Date().toISOString().split("T")[0];

  // Helper untuk format angka dengan titik ribuan
  const formatNumberInput = (value) => {
    const rawValue = value.replace(/\D/g, "");
    if (!rawValue) return "";
    return new Intl.NumberFormat("id-ID").format(rawValue);
  };

  const handleTargetChange = (e) => {
    setTarget(formatNumberInput(e.target.value));
  };

  const handleCurrentChange = (e) => {
    setCurrent(formatNumberInput(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Bersihkan titik pemisah ribuan sebelum konversi ke Number
    const numTarget = Number(target.replace(/\./g, ""));
    const numCurrent = Number(current.replace(/\./g, "") || 0);

    if (!name.trim()) {
      setError("Nama target tidak boleh kosong.");
      return;
    }

    if (numTarget <= 0) {
      setError("Nominal target harus lebih dari 0.");
      return;
    }

    if (numCurrent < 0) {
      setError("Dana awal tidak boleh bernilai minus.");
      return;
    }

    if (numCurrent > numTarget) {
      setError("Dana awal tidak boleh melebihi target.");
      return;
    }

    if (deadline && deadline < todayISO) {
      setError("Deadline target tidak boleh memilih tanggal yang sudah lewat.");
      return;
    }

    await onAdd({
      name,
      target: numTarget,
      current: numCurrent,
      deadline: deadline || null,
    });

    // Reset Form
    setName("");
    setTarget("");
    setCurrent("");
    setDeadline("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-bold text-white">Tambah Target Tabungan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Nama Target / Wishlist
            </label>
            <input
              type="text"
              placeholder="Contoh: Beli Laptop Baru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Nominal Target (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 660.000"
              value={target}
              onChange={handleTargetChange}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Dana Awal (Opsional)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 500.000"
              value={current}
              onChange={handleCurrentChange}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Deadline Target
            </label>
            <input
              type="date"
              min={todayISO}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              Simpan Target
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}