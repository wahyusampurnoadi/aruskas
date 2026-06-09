"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function FinanceChart({ income = 0, expense = 0 }) {
  const data = [
    {
      name: "Pemasukan",
      value: income,
      fill: "#22C55E",
    },
    {
      name: "Pengeluaran",
      value: expense,
      fill: "#EF4444",
    },
  ];

  const formatRupiah = (value) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="w-full h-[320px] bg-white/2 backdrop-blur-xl border border-white/10 rounded-3xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={56}
          margin={{ top: 50, right: 20, left: 20, bottom: 20 }}
        >
          {/* GRID */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />

          {/* X AXIS */}
          <XAxis
            dataKey="name"
            tick={{ fill: "#E5E7EB", fontSize: 14 }}
            tickLine={false}
            axisLine={false}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{ fill: "#CBD5E1", fontSize: 12 }}
            tickFormatter={(v) => `Rp ${v / 1000000}jt`}
            axisLine={false}
            tickLine={false}
          />

          {/* TOOLTIP */}
          <Tooltip
            formatter={(value) => formatRupiah(value)}
            contentStyle={{
              backgroundColor: "#0B0F19",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "#FFFFFF",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#60A5FA", fontWeight: "bold" }}
            itemStyle={{ color: "#FFFFFF" }}
            cursor={{ fill: "rgba(255,255,255,0.06)" }}
          />

          {/* BAR */}
          <Bar dataKey="value" radius={[14, 14, 0, 0]}>
            {/* LABEL ANGKA DI ATAS BAR */}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => formatRupiah(v)}
              fill="#FFFFFF"
              fontSize={14}
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
