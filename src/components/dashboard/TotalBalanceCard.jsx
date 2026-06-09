"use client";

import { useState } from "react";
import { Eye, EyeOff, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/70 via-indigo-500/70 to-purple-500/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(31,38,135,0.37)] rounded-3xl p-10">

      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="text-white" size={24} />
            <span className="text-blue-100 font-bold text-xl">
              TOTAL SALDO KESELURUHAN
            </span>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <h2 className="text-4xl font-bold text-white mt-6">
          {isVisible
            ? formatCurrency(totalBalance)
            : "Rp •••••••••"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="text-green-300" />
              <span className="text-sm text-white/80">
                Pemasukan
              </span>
            </div>

            <p className="font-bold text-green-300">
              {isVisible
                ? formatCurrency(totalIncome)
                : "••••••"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="text-red-300" />
              <span className="text-sm text-white/80">
                Pengeluaran
              </span>
            </div>

            <p className="font-bold text-red-300">
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