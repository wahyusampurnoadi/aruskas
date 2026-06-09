"use client";

import { useState } from "react";

export default function BudgetTracker({ totalExpense }) {
    const [isEditing, setIsEditing] = useState(false);
    const [budget, setBudget] = useState(() => {
      // Ambil budget dari localStorage jika ada
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("monthly_budget");
        return saved ? Number(saved) : 5000000; // Default 5jt
      }
      return 5000000;
    });
  
    const percentage = Math.min((totalExpense / budget) * 100, 100);
    const isOverBudget = totalExpense > budget;
  
    const saveBudget = (e) => {
      e.preventDefault();
      localStorage.setItem("monthly_budget", budget);
      setIsEditing(false);
    };
  
    return (
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Atur Pengeluaranmu</h3>
            {isEditing ? (
              <form onSubmit={saveBudget} className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="bg-black/40 border border-blue-500 rounded-lg px-2 py-1 text-sm outline-none w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
                <button className="text-[10px] bg-blue-600 px-2 rounded cursor-pointer">Simpan</button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Rp {budget.toLocaleString("id-ID")}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-400 text-xs cursor-pointer"
                >
                  ✎ Edit
                </button>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Tersisa</p>
            <p className={`font-bold ${isOverBudget ? "text-red-400" : "text-green-400"}`}>
              Rp {(budget - totalExpense).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
  
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-blue-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
            <span className="text-gray-500">{percentage.toFixed(1)}% Terpakai</span>
            <span className={isOverBudget ? "text-red-400" : "text-gray-500"}>
              {isOverBudget ? "Overlimit!" : "Aman"}
            </span>
          </div>
        </div>
      </div>
    );
  }