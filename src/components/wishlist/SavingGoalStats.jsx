export default function SavingGoalStats({ goals = [] }) {
  const totalTarget = goals.reduce((sum, goal) => sum + (goal.target || 0), 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + (goal.current || 0), 0);
  const progress = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* TOTAL TARGET */}
      <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 p-5 sm:p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            🎯 Total Target
          </p>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {goals.length} Wishlist
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Rp {totalTarget.toLocaleString("id-ID")}
        </h2>
        <p className="mt-2 text-xs text-slate-400">Target impian yang ingin dicapai</p>
      </div>

      {/* TERKUMPUL */}
      <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 p-5 sm:p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            💰 Total Terkumpul
          </p>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Terkumpul
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
          Rp {totalCurrent.toLocaleString("id-ID")}
        </h2>
        <p className="mt-2 text-xs text-slate-400">Total akumulasi tabungan saat ini</p>
      </div>

      {/* PROGRESS */}
      <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 p-5 sm:p-6 rounded-3xl backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            📈 Total Progress
          </p>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Pencapaian
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">
          {progress}%
        </h2>
        <p className="mt-2 text-xs text-slate-400">Rata-rata progres dari seluruh target</p>
      </div>
    </div>
  );
}