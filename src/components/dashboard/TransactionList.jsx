"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  onExportExcel,
  onExportPDF,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const showReceipt = (url) => {
    Swal.fire({
      title: '<span style="color: #fff; font-weight: 700;">Bukti Transaksi</span>',
      imageUrl: url,
      imageAlt: "Bukti Transaksi",
      background: "#0f172a",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Tutup",
      showCloseButton: true,
      backdrop: `rgba(0,0,0,0.85)`,
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
      },
    });
  };

  const availableDates = useMemo(() => {
    const dates = transactions
      .map((t) => {
        const rawDate = t.transactionDate?.toDate?.() || null;
        return rawDate ? rawDate.toISOString().split("T")[0] : null;
      })
      .filter(Boolean);

    return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const dateObj = t.transactionDate?.toDate?.();
        const dateString = dateObj ? dateObj.toISOString().split("T")[0] : "";
        const matchesDate = !selectedDate || dateString === selectedDate;
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesDate && matchesType;
      })
      .sort((a, b) => {
        const dateA = a.transactionDate?.toDate?.()?.getTime?.() || 0;
        const dateB = b.transactionDate?.toDate?.()?.getTime?.() || 0;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, selectedDate, filterType, sortOrder]);

  const confirmDelete = () => {
    if (!deleteConfirmItem) return;
    onDelete(deleteConfirmItem.id, deleteConfirmItem.imageUrl || "");
    setDeleteConfirmItem(null);
  };

  const getCategoryConfig = (category = "") => {
    const norm = category.toLowerCase();

    if (norm.includes("makan") || norm.includes("jajan") || norm.includes("minum")) {
      return {
        badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        iconBg: "bg-amber-500/20 text-amber-400",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      };
    }

    if (norm.includes("transport") || norm.includes("bensin")) {
      return {
        badgeStyle: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        iconBg: "bg-cyan-500/20 text-cyan-400",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-8 4h8m-4 8l-4-4h8l-4 4zm-6-4h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1z" />
          </svg>
        ),
      };
    }

    if (norm.includes("freelance") || norm.includes("gaji") || norm.includes("pemasukan")) {
      return {
        badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        iconBg: "bg-emerald-500/20 text-emerald-400",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    }

    if (norm.includes("wishlist")) {
      return {
        badgeStyle: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        iconBg: "bg-purple-500/20 text-purple-400",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
      };
    }

    return {
      badgeStyle: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      iconBg: "bg-indigo-500/20 text-indigo-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h10" />
        </svg>
      ),
    };
  };

  return (
    <div className="space-y-6 relative">
      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-white font-bold text-lg mb-2">Hapus Transaksi?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Data transaksi yang dihapus tidak dapat dikembalikan lagi.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition active:scale-95 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARIS UTAMA HEADER & TIPE ELEMEN UTAMA */}
      <div className="bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Riwayat Transaksi
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kelola dan pantau semua transaksi keuangan yang telah tercatat
            </p>
          </div>

          {/* OPSI EXPORT */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExportExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button
              onClick={onExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>

        {/* BARIS KONTROL FILTER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-white/5">
          {/* TIPE TRANSAKSI PILLS */}
          <div className="flex p-1 bg-slate-950/60 rounded-2xl border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "income"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "expense"
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pengeluaran
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SELECT TANGGAL */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full appearance-none cursor-pointer bg-slate-950/60 border border-white/10 text-slate-300 text-xs rounded-2xl pl-4 pr-9 py-2.5 focus:outline-none focus:border-blue-500/50 transition"
              >
                <option value="">Semua Tanggal</option>
                {availableDates.map((date) => (
                  <option key={date} value={date} className="bg-slate-900 text-slate-200">
                    {new Date(date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* SORTING ORDER */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-white/5 flex-1 sm:flex-none justify-center">
              <button
                onClick={() => setSortOrder("desc")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  sortOrder === "desc"
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Terbaru
              </button>
              <button
                onClick={() => setSortOrder("asc")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  sortOrder === "asc"
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Terlama
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR DOKUMEN TRANSAKSI */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl backdrop-blur-md">
            <div className="inline-flex p-4 rounded-full bg-white/5 text-slate-500 mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">
              {selectedDate || filterType !== "all"
                ? "Tidak ada transaksi yang cocok dengan filter ini."
                : "Belum ada transaksi di periode ini."}
            </p>
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const isExpanded = expandedId === t.id;
            const note = t.note || "";
            // Menurunkan threshold karakter agar opsi baca selengkapnya muncul lebih awal di HP
            const showReadMore = note.length > 35;
            const wishlistLabel = t.wishlistName || t.goalName || t.wishlistTitle || "";
            const categoryConfig = getCategoryConfig(t.category);

            return (
              <div
                key={t.id}
                className="group relative overflow-hidden bg-slate-900/60 border border-white/10 hover:border-white/20 p-4 sm:p-5 rounded-3xl transition-all duration-300 backdrop-blur-xl shadow-lg"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* SISI KIRI: IKON & INFO INFORMASI UTAMA */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`p-3 sm:p-3.5 rounded-2xl shrink-0 mt-0.5 ${categoryConfig.iconBg}`}>
                      {categoryConfig.icon}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="font-bold text-white text-sm sm:text-base break-words">
                          {t.title || t.category || "Transaksi"}
                        </h3>

                        {/* BADGE KATEGORI */}
                        {t.category && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${categoryConfig.badgeStyle}`}
                          >
                            {t.category}
                          </span>
                        )}

                        {/* BADGE WISHLIST TARGET */}
                        {t.category?.toLowerCase() === "wishlist" && wishlistLabel && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            🎯 {wishlistLabel}
                          </span>
                        )}
                      </div>

                      {/* CATATAN / DESKRIPSI (OPTIMAL DITAMPILAN MOBILE) */}
                      {note && (
                        <div className="pt-0.5">
                          <p
                            className={`text-xs text-slate-300/90 break-words whitespace-pre-wrap leading-relaxed ${
                              isExpanded ? "" : "line-clamp-2 sm:line-clamp-1"
                            }`}
                          >
                            {note}
                          </p>
                          {showReadMore && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : t.id)}
                              className="inline-block text-[11px] font-bold text-blue-400 hover:text-blue-300 mt-1 transition-colors cursor-pointer"
                            >
                              {isExpanded ? "▲ Sembunyikan" : "▼ Selengkapnya"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SISI TENGAH & KANAN: TANGGAL, NOMINAL, DAN TOMBOL AKSI */}
                  <div className="flex flex-row items-center justify-between lg:justify-end gap-3 sm:gap-4 border-t border-white/5 pt-3 lg:border-none lg:pt-0">
                    {/* TANGGAL */}
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.transactionDate?.toDate?.()?.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }) || "-"}
                      </span>
                    </div>

                    {/* NOMINAL & TOMBOL AKSI */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={`font-black text-sm sm:text-lg tracking-tight ${
                            t.type === "income" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"} Rp{" "}
                          {(t.amount || 0).toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* KELOMPOK TOMBOL AKSI */}
                      <div className="flex items-center gap-1.5 ml-1">
                        {/* BUKTI NOTA */}
                        {t.imageUrl ? (
                          <button
                            onClick={() => showReceipt(t.imageUrl)}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition cursor-pointer"
                            title="Lihat Bukti Nota"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        ) : (
                          <div className="p-2 text-slate-700 opacity-20" title="Tidak Ada Nota">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.007 10.007 0 012.122-.363c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                            </svg>
                          </div>
                        )}

                        {/* EDIT */}
                        <button
                          onClick={() => onEdit(t)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
                          title="Edit Transaksi"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* HAPUS */}
                        <button
                          onClick={() => setDeleteConfirmItem({ id: t.id, imageUrl: t.imageUrl || "" })}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
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