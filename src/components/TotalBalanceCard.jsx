"use client";

import React, { useState } from "react";
// Import icon mata untuk tombol sensor
import { Eye, EyeOff } from "lucide-react";

export default function TotalBalanceCard({ transactions }) {
  // State untuk mengontrol sensor saldo
  const [isVisible, setIsVisible] = useState(true);

  // Menghitung akumulasi dari seluruh data tanpa filter bulan
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl mb-8">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
              Total Saldo Keseluruhan
            </p>
            {/* Tombol Sensor */}
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-blue-200 hover:text-white transition-colors p-1 cursor-pointer"
              title={isVisible ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            {isVisible 
              ? `Rp ${totalBalance.toLocaleString("id-ID")}` 
              : "Rp ••••••••"}
          </h2>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-none">
          <div className="text-center md:text-right">
            <p className="text-[10px] text-blue-100 uppercase">Total Masuk</p>
            <p className="text-green-300 font-bold">
              {isVisible 
                ? `+ ${totalIncome.toLocaleString("id-ID")}` 
                : "••••••"}
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] text-blue-100 uppercase">Total Keluar</p>
            <p className="text-red-300 font-bold">
              {isVisible 
                ? `- ${totalExpense.toLocaleString("id-ID")}` 
                : "••••••"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}