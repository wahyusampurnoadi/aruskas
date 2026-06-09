"use client";

import { useState, useMemo } from "react";
import Swal from 'sweetalert2';
import { FaCamera, FaTrash, FaEdit } from 'react-icons/fa';

export default function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete, 
  onExportExcel, 
  onExportPDF 
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  // --- STATE BARU UNTUK FILTER TIPE ---
  const [filterType, setFilterType] = useState("all"); 
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showReceipt = (url) => {
    Swal.fire({
      title: '<span style="color: #fff">Bukti Transaksi</span>',
      imageUrl: url,
      imageAlt: 'Bukti Transaksi',
      background: '#1a1f2e',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Tutup',
      showCloseButton: true,
      backdrop: `rgba(0,0,0,0.8)`,
      customClass: {
        popup: 'rounded-2xl border border-white/10'
      }
    });
  };

  const availableDates = useMemo(() => {
    const dates = transactions.map(t => {
      const dateObj = t.transactionDate?.toDate();
      return dateObj ? dateObj.toISOString().split('T')[0] : null;
    }).filter(Boolean);
    
    return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // --- LOGIKA FILTER YANG DIPERBARUI ---
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const dateString = t.transactionDate?.toDate().toISOString().split('T')[0];
        const matchesDate = !selectedDate || dateString === selectedDate;
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesDate && matchesType;
      })
      .sort((a, b) => {
        const dateA = a.transactionDate?.toDate().getTime() || 0;
        const dateB = b.transactionDate?.toDate().getTime() || 0;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, selectedDate, filterType, sortOrder]);
  
  

  const confirmDelete = () => {
    onDelete(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4 relative">
      {/* MODAL KONFIRMASI HAPUS (Tetap sama) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Hapus Transaksi?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition cursor-pointer">
                Batal
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition cursor-pointer">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & EXPORT */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="font-bold text-xl text-white">Riwayat Transaksi</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={onExportExcel} className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm font-medium hover:bg-green-600/30 transition cursor-pointer">
          📊 Excel
          </button>
          <button onClick={onExportPDF} className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-sm font-medium hover:bg-red-600/30 transition cursor-pointer">
          📄 PDF
          </button>
        </div>
      </div>

      {/* BAGIAN FILTER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-2">
        

      {/* KIRI: FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        {/* Filter Tipe */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-fit justify-between sm:justify-start">
          <button
            onClick={() => setFilterType("all")}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === "all"
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === "income"
                ? "bg-green-500 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === "expense"
                ? "bg-red-500 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Filter Tanggal */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1a1f2e] w-full sm:w-auto">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
            w-full appearance-none cursor-pointer
            bg-[#1a1f2e]
            text-gray-200 text-sm
            pl-4 pr-10 py-2
            outline-none
            focus:bg-[#1a1f2e]
          "
        >
          <option value="" className="bg-[#1a1f2e] text-gray-400">
            Semua Tanggal
          </option>

          {availableDates.map(date => (
            <option
              key={date}
              value={date}
              className="bg-[#1a1f2e] text-gray-200"
            >
              {new Date(date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>

        {/* ICON PANAH */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
        
        {/* SORT TANGGAL */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400 font-semibold">Urutkan:</span>

          <button
            onClick={() => setSortOrder("desc")}
            className={`cursor-pointer px-3 py-1 text-xs rounded-lg font-bold transition ${
              sortOrder === "desc"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-gray-200"
            }`}
          >
            Terbaru
          </button>

          <button
            onClick={() => setSortOrder("asc")}
            className={`cursor-pointer px-3 py-1 text-xs rounded-lg font-bold transition ${
              sortOrder === "asc"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-gray-200"
            }`}
          >
            Terlama
          </button>
        </div>

        </div>
      </div>


      {/* LIST TRANSAKSI (Sama seperti sebelumnya) */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
            {selectedDate || filterType !== "all" ? "Data tidak ditemukan dengan filter ini." : "Belum ada transaksi di periode ini."}
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <div key={t.id} className="bg-[#1a1f2e]/50 border border-white/5 p-4 rounded-2xl transition hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="sm:w-1/3 min-w-0">
                  <p className="font-semibold text-gray-100 truncate">{t.category}</p>
                  {t.note && (
                    <div className="mt-1">
                      <p className={`text-sm text-gray-400 break-words ${isExpanded ? "" : "line-clamp-1"}`}>
                        {t.note}
                      </p>
                      {t.note.length > 40 && (
                        <button onClick={() => setExpandedId(isExpanded ? null : t.id)} className="text-[11px] font-bold text-blue-400 hover:text-blue-300 mt-0.5 transition-colors cursor-pointer">
                          {isExpanded ? "↑ Sembunyikan" : "...selengkapnya"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {t.transactionDate?.toDate().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="sm:w-1/3 flex items-center justify-between sm:justify-end gap-5 border-t border-white/5 pt-3 sm:border-none sm:pt-0">
                  <span className={`font-bold text-base ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                  </span>
                  {t.imageUrl ? (
                    <button onClick={() => showReceipt(t.imageUrl)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition cursor-pointer">
                      📷
                    </button>
                  ) : (
                    <div className="p-2 text-gray-700 opacity-20">📷</div>
                  )}
                  <div className="flex gap-4">
                    <button onClick={() => onEdit(t)} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition cursor-pointer">Edit</button>
                    <button onClick={() => setDeleteConfirmId(t.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition cursor-pointer">
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