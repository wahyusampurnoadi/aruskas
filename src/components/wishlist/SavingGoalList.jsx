"use client";

export default function SavingGoalList({ goals = [], onDeposit, onEdit, onDelete }) {
  if (goals.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/30 p-8 text-center backdrop-blur-2xl">
        <p className="text-sm font-semibold text-slate-400">
          Belum ada target tabungan. Klik tombol "Tambah Target" untuk memulai!
        </p>
      </div>
    );
  }

  // Helper untuk format tanggal (contoh: 26 Juli 2026)
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <span>🎯</span> Daftar Wishlist & Target
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const current = Number(goal.current) || 0;
          const target = Number(goal.target) || 0;
          const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
          const formattedDeadline = formatDate(goal.deadline);

          return (
            <div
              key={goal.id}
              className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-white/20"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="font-bold text-white text-base line-clamp-1">
                    {goal.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-400">
                    {percentage}%
                  </span>
                </div>

                {/* Info Nominal */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Terkumpul</span>
                    <span className="font-bold text-emerald-400">
                      Rp {current.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target</span>
                    <span className="font-bold text-white">
                      Rp {target.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Field Tanggal Target (Deadline) */}
                  <div className="flex justify-between items-center pt-1 border-t border-white/5">
                    <span className="text-slate-400">Deadline</span>
                    <span className="font-semibold text-slate-300">
                      {formattedDeadline ? `📅 ${formattedDeadline}` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-5 mt-4 border-t border-white/5">
                <button
                  onClick={() => onDeposit(goal.id)}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Setor
                </button>
                <button
                  onClick={() => onEdit(goal.id)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/20 transition-all active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}