"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function TotalBalanceCard({ transactions }) {
  const [isVisible, setIsVisible] = useState(true);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const formatCurrency = (amount) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <div
      className="
        relative overflow-hidden

        bg-gradient-to-br
        from-blue-500/70
        via-indigo-500/70
        to-purple-500/70

        backdrop-blur-2xl
        border border-white/20

        shadow-[0_8px_32px_rgba(31,38,135,0.37)]

        rounded-3xl

        p-5
        md:p-7
      "
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="text-white/90" size={24} />

            <div>
  <h2
    className="
      text-lg
      md:text-2xl

      font-bold

      text-white

      tracking-wide
    "
  >
    TOTAL SALDO KESELURUHAN
  </h2>
</div>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-white/80 hover:text-white transition cursor-pointer"
          >
            {isVisible ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>

        {/* Nominal */}
        <div className="mt-4">
          <h1
            className="
              text-3xl
              md:text-5xl

              font-bold
              text-white

              drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]
            "
          >
            {isVisible
              ? formatCurrency(totalBalance)
              : "Rp •••••••••"}
          </h1>

          <div className="mt-3">
            {totalBalance >= 0 ? (
              <span
                className="
                  inline-flex
                  items-center
                  px-3
                  py-1

                  rounded-full

                  bg-green-500/20
                  border border-green-400/20

                  text-green-300
                  text-sm
                  font-medium
                "
              >
                ● Surplus
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  px-3
                  py-1

                  rounded-full

                  bg-red-500/20
                  border border-red-400/20

                  text-red-300
                  text-sm
                  font-medium
                "
              >
                ● Defisit
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-5" />

        {/* Statistik */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="text-green-300" />

              <span className="text-white/70 text-sm">
                Pemasukan
              </span>
            </div>

            <p
              className="
                text-lg
                md:text-2xl

                font-bold
                text-green-300
              "
            >
              {isVisible
                ? formatCurrency(totalIncome)
                : "••••••"}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="text-red-300" />

              <span className="text-white/70 text-sm">
                Pengeluaran
              </span>
            </div>

            <p
              className="
                text-xl
                md:text-3xl

                font-bold
                text-red-300
              "
            >
              {isVisible
                ? formatCurrency(totalExpense)
                : "••••••"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}