"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Plus, ArrowDownRight, ArrowUpRight } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import useTransactions from "@/app/hooks/useTransactions";
import useSavingGoals from "@/app/hooks/useSavingGoals";
import { uploadImage } from "@/lib/cloudinary";
import { formatCurrency } from "@/lib/utils";

import {
  createTransaction,
  updateTransaction,
  deleteTransactionById,
} from "@/lib/transactions";

import { exportExcel } from "@/lib/exportExcel";
import { exportPDF } from "@/lib/exportPdf";

import LoadingScreen from "@/components/dashboard/LoadingScreen";
import TotalBalanceCard from "@/components/dashboard/TotalBalanceCard";
import BudgetTracker from "@/components/dashboard/BudgetTracker";
import FinanceChart from "@/components/dashboard/FinanceChart";
import TransactionList from "@/components/dashboard/TransactionList";
import TransactionForm from "@/components/dashboard/TransactionForm";
import DashboardFilter from "@/components/dashboard/DashboardFilter";

export default function DashboardPage() {
  const router = useRouter();
  const formRef = useRef(null);

  const { user, loading } = useAuth();
  const { goals } = useSavingGoals();

  const [currency, setCurrency] = useState("IDR");

  const {
    transactions,
    loadingTransactions,
    errorTransactions,

    filterMode,
    setFilterMode,

    month,
    setMonth,
    year,
    setYear,

    startDate,
    setStartDate,
    endDate,
    setEndDate,

    applyCustomRange,
    resetToMonthly,

    income,
    expense,
    balance,

    totalIncome,
    totalExpense,
    totalBalance,

    refreshTransactions,
  } = useTransactions(user);

  // =========================
  // Local state form & UI
  // =========================
  const [showBalance, setShowBalance] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [selectedGoalId, setSelectedGoalId] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);

  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const activePeriodLabel = useMemo(() => {
    if (filterMode === "custom" && startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString("id-ID")} - ${new Date(
        endDate
      ).toLocaleDateString("id-ID")}`;
    }

    return `${monthNames[month]} ${year}`;
  }, [filterMode, startDate, endDate, month, year]);

  // Sinkronisasi mata uang aktif dari localStorage & event listener global
  useEffect(() => {
    const updateCurrency = () => {
      const saved = localStorage.getItem("app_currency") || "IDR";
      setCurrency(saved);
    };

    updateCurrency();
    window.addEventListener("currencyChange", updateCurrency);
    return () => window.removeEventListener("currencyChange", updateCurrency);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  const resetForm = () => {
    setEditingId(null);
    setType("income");
    setAmount("");
    setCategory("");
    setNote("");
    setSelectedGoalId("");
    setImageFile(null);
    setImagePreview("");
    setExistingImageUrl("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      setAmount("");
      return;
    }

    setAmount(new Intl.NumberFormat("id-ID").format(Number(value)));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran maksimal gambar adalah 2 MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const loadTransaction = (transaction) => {
    setEditingId(transaction.id);
    setType(transaction.type);
    setAmount(new Intl.NumberFormat("id-ID").format(transaction.amount || 0));
    setCategory(transaction.category || "");
    setNote(transaction.note || "");
    setSelectedGoalId(transaction.wishlistGoalId || "");
    setExistingImageUrl(transaction.imageUrl || "");
    setImagePreview(transaction.imageUrl || "");
    setImageFile(null);

    if (transaction.transactionDate) {
      const d = transaction.transactionDate.toDate
        ? transaction.transactionDate.toDate()
        : new Date(transaction.transactionDate);

      setTransactionDate(d.toISOString().split("T")[0]);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowTransactionModal(true);
  };

  const editTransaction = (transaction) => {
    loadTransaction(transaction);
    setShowTransactionModal(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  };

  // =========================
  // Submit Transaksi
  // =========================
  const submit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount.replace(/\./g, "")) <= 0 || !category.trim()) {
      toast.error("Mohon isi data transaksi dengan benar");
      return;
    }

    if (type === "expense" && category === "Wishlist" && !selectedGoalId) {
      toast.warning("Silakan pilih target wishlist terlebih dahulu");
      return;
    }

    setUploading(true);

    try {
      const numericAmount = Number(amount.replace(/\./g, ""));

      const selectedGoal =
        type === "expense" && category === "Wishlist"
          ? goals.find((g) => g.id === selectedGoalId)
          : null;

      let finalImageUrl = "";

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      } else if (editingId) {
        finalImageUrl = existingImageUrl || "";
      }

      const payload = {
        type,
        amount: numericAmount,
        category,
        note,
        transactionDate: new Date(transactionDate),
        imageUrl: finalImageUrl,
        wishlistGoalId:
          type === "expense" && category === "Wishlist" ? selectedGoalId : null,
        wishlistName:
          type === "expense" && category === "Wishlist"
            ? selectedGoal?.name || ""
            : "",
      };

      if (editingId) {
        await updateTransaction(user.uid, editingId, payload);
      } else {
        await createTransaction(user.uid, payload);
      }

      toast.success("Transaksi berhasil disimpan 🎉");
      resetForm();
      setShowTransactionModal(false);
      await refreshTransactions();
    } catch (error) {
      console.error("Submit transaction error:", error);
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Hapus Transaksi
  // =========================
  const handleDeleteTransaction = async (transactionId) => {
    const result = await Swal.fire({
      title: "Hapus transaksi?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTransactionById(user.uid, transactionId);
      toast.success("Transaksi berhasil dihapus 🗑️");
      await refreshTransactions();
    } catch (error) {
      console.error("Delete transaction error:", error);
      Swal.fire("Gagal", "Gagal menghapus transaksi", "error");
    }
  };

  // =========================
  // Custom Filter
  // =========================
  const handleApplyCustomFilter = () => {
    if (!startDate || !endDate) {
      toast.warning("Isi tanggal awal dan tanggal akhir dulu");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.warning("Tanggal awal tidak boleh lebih besar dari tanggal akhir");
      return;
    }

    applyCustomRange(startDate, endDate);
  };

  return (
    <div className="min-h-screen text-white">
      <main className="relative z-10 space-y-8 p-4 md:p-6 lg:p-8">
        {/* TOTAL SALDO CARD */}
        <div className="relative">
          <TotalBalanceCard
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            showBalance={showBalance}
            toggleBalance={() => setShowBalance(!showBalance)}
            currency={currency}
          />
          <div className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6">
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm text-white shadow-lg transition active:scale-95 cursor-pointer border border-white/10"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Transaksi</span>
            </button>
          </div>
        </div>

        <BudgetTracker totalExpense={expense} currency={currency} />

        <DashboardFilter
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          monthNames={monthNames}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          activePeriodLabel={activePeriodLabel}
          resetToMonthly={resetToMonthly}
          handleApplyCustomFilter={handleApplyCustomFilter}
        />

        {/* CHART + STATS */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Analisis Visual
                </p>
                <h3 className="font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                  Grafik Periode Aktif
                </h3>
              </div>

              <div className="self-start sm:self-auto px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold backdrop-blur-md">
                🗓️ {activePeriodLabel}
              </div>
            </div>

            <div className="w-full h-[320px]">
              <FinanceChart income={income || 0} expense={expense || 0} />
            </div>

            {/* RINCIAN PEMASUKAN & PENGELUARAN AKTIF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider">
                    Pemasukan Aktif
                  </p>
                  <p className="text-lg font-extrabold text-emerald-300 mt-0.5">
                    {formatCurrency(income, currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-400/80 uppercase tracking-wider">
                    Pengeluaran Aktif
                  </p>
                  <p className="text-lg font-extrabold text-rose-300 mt-0.5">
                    {formatCurrency(expense, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KARTU STATISTIK RINGKAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Transaksi
                  </p>
                  <h4 className="text-3xl font-black text-white mt-2">
                    {transactions.length}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Item telah dicatat</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  📊
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Terpakai
                  </p>
                  <h4 className="text-3xl font-black text-rose-400 mt-2">
                    {income > 0 ? Math.round((expense / income) * 100) : 0}%
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Dari total pemasukan</p>
                </div>
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  ⚡
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </p>
                  <h4
                    className={`text-2xl font-black mt-2 ${
                      balance >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {balance >= 0 ? "Surplus" : "Defisit"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Kondisi keuangan saat ini</p>
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    balance >= 0
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  }`}
                >
                  {balance >= 0 ? "🛡️" : "⚠️"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {loadingTransactions && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            Memuat transaksi...
          </div>
        )}

        {errorTransactions && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {errorTransactions}
          </div>
        )}

        {!loadingTransactions && !errorTransactions && (
          <TransactionList
            transactions={transactions}
            onEdit={editTransaction}
            onDelete={(id) => handleDeleteTransaction(id)}
            onExportExcel={() => exportExcel(transactions, month, year)}
            onExportPDF={() => exportPDF(transactions, month, year)}
          />
        )}

        {showTransactionModal && (
          <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Transaksi" : "Tambah Transaksi"}
                </h2>

                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-white text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <TransactionForm
                formRef={formRef}
                submit={submit}
                editingId={editingId}
                type={type}
                setType={setType}
                transactionDate={transactionDate}
                setTransactionDate={setTransactionDate}
                amount={amount}
                handleAmountChange={handleAmountChange}
                category={category}
                setCategory={setCategory}
                note={note}
                setNote={setNote}
                handleFileUpload={handleFileUpload}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                uploading={uploading}
                goals={goals}
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}