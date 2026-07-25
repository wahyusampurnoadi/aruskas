"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FinanceChart({ income = 0, expense = 0 }) {
  // Data simulasi titik kurva agar grafik melengkung indah
  const data = [
    { name: "Awal", Pemasukan: 0, Pengeluaran: 0 },
    { name: "Mid", Pemasukan: income * 0.45, Pengeluaran: expense * 0.3 },
    { name: "Peak", Pemasukan: income * 0.85, Pengeluaran: expense * 0.9 },
    { name: "Aktif", Pemasukan: income, Pengeluaran: expense },
  ];

  const formatRupiah = (value) =>
    `Rp ${Number(value).toLocaleString("id-ID")}`;

  const formatAxis = (value) => {
    if (value === 0) return "Rp 0";
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
    return `Rp ${value}`;
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            {/* Gradien Pemasukan (Emerald Neon) */}
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>

            {/* Gradien Pengeluaran (Rose Neon) */}
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />

          <YAxis
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickFormatter={formatAxis}
            axisLine={false}
            tickLine={false}
            dx={-5}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl space-y-1.5 min-w-[150px]">
                    <p className="text-xs text-slate-400 font-medium">
                      Detail Transaksi
                    </p>
                    {payload.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 text-xs font-semibold"
                      >
                        <span
                          style={{ color: item.color }}
                          className="flex items-center gap-1.5"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}:
                        </span>
                        <span className="text-white">
                          {formatRupiah(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="Pemasukan"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />

          <Area
            type="monotone"
            dataKey="Pengeluaran"
            stroke="#F43F5E"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}