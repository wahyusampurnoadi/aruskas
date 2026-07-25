"use client";

export default function DeleteGoalModal({ open, goal, onClose, onConfirm }) {
  if (!open || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl text-center">
        
        {/* Icon Peringatan */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Konten Teks */}
        <h3 className="text-lg font-bold text-white mb-2">Hapus Target Tabungan?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus <span className="font-bold text-white">"{goal.name}"</span>? Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-white/10 transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(goal.id)}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            Hapus Target
          </button>
        </div>

      </div>
    </div>
  );
}