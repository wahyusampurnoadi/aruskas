"use client";

import { Download, Trash2, Loader2 } from "lucide-react";

export default function DataTab({ onExport, onReset, isExporting }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">
          Cadangan & Ekspor Data
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Unduh seluruh riwayat pembukuanmu untuk disimpan sebagai arsip pribadi.
        </p>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-xs text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExporting ? "Mengekspor..." : "Ekspor Semua Data (Excel)"}</span>
        </button>
      </div>

      <div className="pt-6 border-t border-rose-500/20">
        <h2 className="text-xl font-bold text-rose-400 mb-2">Zona Bahaya</h2>
        <p className="text-xs text-slate-400 mb-4">
          Aksi di bawah ini bersifat permanen dan tidak dapat dibatalkan.
        </p>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 font-bold text-xs text-rose-300 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset Seluruh Data Transaksi</span>
        </button>
      </div>
    </div>
  );
}