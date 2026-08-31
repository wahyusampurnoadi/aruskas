"use client";

import { useState } from "react";
import { Lock, Loader2, X } from "lucide-react";

export default function ReAuthModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    await onConfirm(password);
    setLoading(false);
    setPassword("");
  };

  return (
    /* Menggunakan fixed + left offset area konten kanan */
    <div className="fixed top-0 right-0 bottom-0 left-0 lg:left-64 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Konfirmasi Keamanan</h3>
            <p className="text-xs text-slate-400 mt-1">
              Demi keamanan akun, masukkan kata sandi Anda saat ini untuk mengonfirmasi perubahan email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
                autoFocus
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Konfirmasi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}