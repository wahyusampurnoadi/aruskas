"use client";

import { useState, useMemo } from "react";

export default function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete, 
  onExportExcel, 
  onExportPDF 
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  // State untuk kontrol modal konfirmasi
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const availableDates = useMemo(() => {
    const dates = transactions.map(t => {
      const dateObj = t.transactionDate?.toDate();
      return dateObj ? dateObj.toISOString().split('T')[0] : null;
    }).filter(Boolean);
    
    return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!selectedDate) return transactions;
    return transactions.filter(t => {
      const dateString = t.transactionDate?.toDate().toISOString().split('T')[0];
      return dateString === selectedDate;
    });
  }, [transactions, selectedDate]);

  // Fungsi untuk mengeksekusi penghapusan
  const confirmDelete = () => {
    onDelete(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4 relative">
      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Hapus Transaksi?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-bold text-xl text-white">Riwayat Transaksi</h2>
        <div className="flex gap-2">
          <button onClick={onExportExcel} className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm font-medium hover:bg-green-600/30 transition">
            Excel
          </button>
          <button onClick={onExportPDF} className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium hover:bg-red-600/30 transition">
            PDF
          </button>
        </div>
      </div>

      {/* FILTER TANGGAL */}
      <div className="flex flex-wrap items-center gap-3 py-2">
        <span className="text-sm text-gray-400 font-medium">Filter Tanggal:</span>
        <div className="relative group">
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none cursor-pointer bg-[#1a1f2e] border border-white/10 text-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-blue-500/50 transition-all"
          >
            <option value="">Semua Tanggal</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {selectedDate && (
          <button onClick={() => setSelectedDate("")} className="text-xs font-semibold text-red-400/80 hover:text-red-400 transition cursor-pointer">
            Bersihkan Filter ×
          </button>
        )}
      </div>

      {/* LIST TRANSAKSI */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
            {selectedDate ? "Tidak ada transaksi di tanggal ini." : "Belum ada transaksi di periode ini."}
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <div
                key={t.id}
                className="bg-[#1a1f2e]/50 border border-white/5 p-4 rounded-2xl transition hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* KIRI */}
                <div className="sm:w-1/3 min-w-0">
                  <p className="font-semibold text-gray-100 truncate">{t.category}</p>
                  {t.note && (
                    <div className="mt-1">
                        <p className={`text-sm text-gray-400 break-words ${isExpanded ? "" : "line-clamp-1"}`}>
                          {t.note}
                        </p>
                        {t.note.length > 40 && (
                          <button 
                              onClick={() => setExpandedId(isExpanded ? null : t.id)}
                              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 mt-0.5 transition-colors cursor-pointer"
                          >
                              {isExpanded ? "↑ Sembunyikan" : "...selengkapnya"}
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* TENGAH */}
                <div className="flex-1 flex justify-center">
                  <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {t.transactionDate?.toDate().toLocaleDateString("id-ID", { 
                      day: '2-digit', month: 'short', year: 'numeric' 
                    })}
                  </span>
                </div>

                {/* KANAN */}
                <div className="sm:w-1/3 flex items-center justify-between sm:justify-end gap-5 border-t border-white/5 pt-3 sm:border-none sm:pt-0">
                  <span className={`font-bold text-base ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => onEdit(t)} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition cursor-pointer">Edit</button>
                    {/* Mengubah onDelete langsung menjadi setDeleteConfirmId */}
                    <button 
                      onClick={() => setDeleteConfirmId(t.id)} 
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}