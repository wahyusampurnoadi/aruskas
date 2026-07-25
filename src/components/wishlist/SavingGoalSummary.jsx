"use client";

export default function SavingGoalSummary({ goals = [] }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="h-full rounded-3xl border border-white/10 bg-slate-900/30 p-6 backdrop-blur-2xl flex items-center justify-center">
        <p className="text-xs text-slate-400 font-medium">Belum ada target tabungan.</p>
      </div>
    );
  }

  // Urutkan target berdasarkan deadline terdekat
  const sortedGoals = [...goals].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const mainGoal = sortedGoals[0];
  const current = Number(mainGoal.current) || 0;
  const target = Number(mainGoal.target) || 0;
  const remaining = Math.max(0, target - current);
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  // Helper untuk hitung sisa waktu dinamis (Bulan / Hari)
  const formatTimeRemaining = (deadlineDate) => {
    if (!deadlineDate) return "Belum diset";

    const today = new Date();
    // Reset jam ke 00:00:00 agar kalkulasi selisih hari akurat
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);

    if (isNaN(deadline.getTime())) return "Belum diset";

    // Hitung selisih hari total
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Terlewat ${Math.abs(diffDays)} Hari`;
    }
    if (diffDays === 0) {
      return "Hari ini";
    }
    if (diffDays < 30) {
      return `${diffDays} Hari lagi`;
    }

    // Jika 30 hari atau lebih, hitung estimasi bulan
    let months =
      (deadline.getFullYear() - today.getFullYear()) * 12 +
      (deadline.getMonth() - today.getMonth());

    if (deadline.getDate() < today.getDate()) {
      months -= 1;
    }

    return months > 0 ? `${months} Bulan` : `${diffDays} Hari lagi`;
  };

  const timeRemainingLabel = formatTimeRemaining(mainGoal.deadline);

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-slate-900/30 p-6 backdrop-blur-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            TARGET UTAMA (DEADLINE TERDEKAT)
          </span>
        </div>
      </div>

      <div className="my-4 text-center">
        <h3 className="text-lg font-black text-white mb-2">{mainGoal.name}</h3>
        <div className="inline-flex items-baseline gap-1 text-cyan-400">
          <span className="text-4xl font-black">{percentage}%</span>
        </div>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">
          PROGRESS TARGET
        </p>
      </div>

      <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Terkumpul</span>
          <span className="font-bold text-emerald-400">
            Rp {current.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Sisa Target</span>
          <span className="font-bold text-amber-400">
            Rp {remaining.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Estimasi Selesai</span>
          <span className="font-bold text-cyan-400">
            {timeRemainingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}