"use client";

import { Plus, X } from "lucide-react";

export default function FinanceTab({
  defaultLimit,
  setDefaultLimit,
  categories,
  newCategory,
  setNewCategory,
  onAddCategory,
  onDeleteCategory,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">
          Batas Pengeluaran Bulanan
        </h2>
        <div className="max-w-md space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Target Batas Default (Rp)
          </label>
          <input
            type="text"
            value={defaultLimit}
            onChange={(e) => setDefaultLimit(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500">
            Nilai ini akan menjadi acuan default untuk komponen Batas Pengeluaran di Dashboard.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">
          Kelola Kategori Custom
        </h2>

        <div className="flex gap-2 max-w-md mb-4">
          <input
            type="text"
            placeholder="Nama kategori baru..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <button
            onClick={onAddCategory}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
            >
              {cat}
              <button
                onClick={() => onDeleteCategory(cat)}
                className="text-slate-500 hover:text-rose-400 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}