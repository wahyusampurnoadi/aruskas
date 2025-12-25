"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddTransactionModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      type,
      amount: Number(amount),
      category,
      note,
      date,
    });

    setAmount("");
    setCategory("");
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="bg-[#111827] w-full max-w-md rounded-2xl p-6 relative animate-scaleIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">
          Tambah Transaksi
        </h2>

        {/* Type */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 rounded-xl font-semibold transition
              ${
                type === "income"
                  ? "bg-green-600 text-white"
                  : "bg-[#1F2937] text-gray-400"
              }`}
          >
            Pemasukan
          </button>

          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 rounded-xl font-semibold transition
              ${
                type === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-[#1F2937] text-gray-400"
              }`}
          >
            Pengeluaran
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="number"
            placeholder="Nominal"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            placeholder="Kategori (Makan, Gaji, dll)"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            placeholder="Catatan (opsional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1F2937] text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}
