"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-xl space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-1 text-cyan-400 font-extrabold text-sm">
          <span>Rp</span>
          <span>{payload[0].value.toLocaleString("id-ID")}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SavingGoalChart({ goals = [] }) {
  const totalAccumulated = goals.reduce(
    (sum, goal) => sum + (Number(goal.current) || 0),
    0
  );

  const chartData =
    totalAccumulated > 0
      ? [
          { month: "Bln 1", total: Math.round(totalAccumulated * 0.2) },
          { month: "Bln 2", total: Math.round(totalAccumulated * 0.4) },
          { month: "Bln 3", total: Math.round(totalAccumulated * 0.6) },
          { month: "Bln 4", total: Math.round(totalAccumulated * 0.8) },
          { month: "Bln 5", total: totalAccumulated },
        ]
      : [
          { month: "Bln 1", total: 0 },
          { month: "Bln 2", total: 0 },
          { month: "Bln 3", total: 0 },
          { month: "Bln 4", total: 0 },
          { month: "Bln 5", total: 0 },
        ];

  return (
    <div className="h-full flex flex-col justify-between group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/30 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-cyan-500/30 hover:shadow-cyan-500/10 hover:-translate-y-1">
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            AKUMULASI PERTUMBUHAN
          </span>
          <div className="flex items-baseline gap-1.5 text-white font-black mt-0.5">
            <span className="text-xl text-cyan-400">+Rp</span>
            <span className="text-3xl tracking-tight">
              {totalAccumulated.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full border text-xs font-bold backdrop-blur-md ${
            totalAccumulated > 0
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-slate-500/10 border-slate-500/20 text-slate-400"
          }`}
        >
          {totalAccumulated > 0 ? "Aktif" : "Belum Ada Setoran"}
        </div>
      </div>

      <div className="relative z-10 h-56 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#22d3ee"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
              dot={{
                r: 4,
                fill: "#0f172a",
                stroke: "#22d3ee",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#22d3ee",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}