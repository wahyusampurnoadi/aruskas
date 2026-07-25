"use client";

import { useState, useEffect } from "react";

export default function EditGoalModal({ open, goal, onClose, onUpdate }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const todayISO = new Date().toISOString().split("T")[0];

  // Isi data awal saat modal dibuka/goal berganti
  useEffect(() => {
    if (goal) {
      setName(goal.name || "");
      setTarget(
        goal.target ? new Intl.NumberFormat("id-ID").format(goal.target) : ""
      );
      // Format tanggal ke YYYY-MM-DD jika tersedia
      if (goal.deadline) {
        const formattedDate = new Date(goal.deadline)
          .toISOString()
          .split("T")[0];
        setDeadline(formattedDate);
      } else {
        setDeadline("");
      }
      setError("");
    }
  }, [goal]);

  if (!open || !goal) return null;

  const handleTargetChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setTarget("");
      return;
    }
    setTarget(new Intl.NumberFormat("id-ID").format(rawValue));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numTarget = Number(target.replace(/\./g, ""));

    if (!name.trim()) {
      setError("Nama target tidak boleh kosong.");
      return;
    }

    if (numTarget <= 0) {
      setError("Nominal target harus lebih dari 0.");
      return;
    }

    if (deadline && deadline < todayISO) {
      setError("Deadline target tidak boleh memilih tanggal yang sudah lewat.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(goal.id, {
        name,
        target: numTarget,
        deadline: deadline || null,
      });
      onClose();
    } catch (err) {
      console.error("Gagal mengedit target:", err);
      setError("Terjadi kesalahan saat memperbarui target.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h3 className="text-lg font-bold text-white">Edit Target Tabungan</h3>
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
              placeholder="Contoh: 31.500.000"
              value={target}
              onChange={handleTargetChange}
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
              required
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
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all [color-scheme:dark]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Simpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}