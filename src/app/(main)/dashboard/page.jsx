"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Plus,
  X,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileText,
  Check,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Sparkles,
  CalendarDays,
  LineChart,
  Activity,
} from "lucide-react";

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
import FinanceChart from "@/components/dashboard/FinanceChart";
import TransactionForm from "@/components/dashboard/TransactionForm";
import FinancialHealthCard from "@/components/premium/FinancialHealthCard";
import UpgradeProModal from "@/components/premium/UpgradeProModal";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DEFAULT_BUDGET = 800000;

const toDate = (value) => (value?.toDate ? value.toDate() : new Date(value));

const formatDigits = (value) => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
};

const statusColor = (percent) =>
  percent >= 100 ? "#f43f5e" : percent >= 70 ? "#f59e0b" : "#10b981";

const signedDelta = (t) =>
  t.type === "income" ? Number(t.amount) || 0 : -(Number(t.amount) || 0);

/* ---------- Kerangka panel seragam ---------- */
const PANEL = "glass relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 sm:p-8";
const PANEL_STRONG = "glass-strong relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 sm:p-8";

function PanelHeader({ label, title, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle sm:text-[11px]">
          {label}
        </p>
        {title && <h3 className="mt-1 truncate text-base font-bold text-main sm:text-lg">{title}</h3>}
      </div>
      {right}
    </div>
  );
}

/* ---------- Saldo dengan tanda sejajar ---------- */
function SignedAmount({ value, currency, hidden, className = "" }) {
  if (hidden) {
    return <span className={`whitespace-nowrap ${className}`}>••••••</span>;
  }
  const isNegative = value < 0;
  const absText = formatCurrency(Math.abs(value), currency).replace(/^-/, "");

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap tabular-nums ${className}`}>
      {isNegative && <span className="mr-[0.12em]">−</span>}
      <span>{absText}</span>
    </span>
  );
}

/* ---------- Cincin progres ---------- */
function Ring({ percent }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--track)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={statusColor(percent)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-black text-main">{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}

/* ---------- Panel batas pengeluaran ---------- */
function BudgetCard({ totalExpense = 0, currency = "IDR" }) {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(formatDigits(DEFAULT_BUDGET));

  useEffect(() => {
    const saved = localStorage.getItem("monthly_budget");
    const value = saved ? Number(saved) : DEFAULT_BUDGET;
    setBudget(value);
    setInput(formatDigits(String(value)));
  }, []);

  const save = () => {
    const value = Number(input.replace(/\D/g, "")) || 0;
    setBudget(value);
    localStorage.setItem("monthly_budget", String(value));
    setEditing(false);
  };

  const cancel = () => {
    setInput(formatDigits(String(budget)));
    setEditing(false);
  };

  const remaining = Math.max(budget - totalExpense, 0);
  const percent = budget > 0 ? (totalExpense / budget) * 100 : 0;
  const isOver = totalExpense > budget;

  return (
    <div className={PANEL_STRONG}>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl"
      />

      <PanelHeader
        label="Batas pengeluaran"
        right={
          !editing && (
            <button
              onClick={() => setEditing(true)}
              aria-label="Ubah batas"
              className="btn-icon inline-flex h-8 w-8 items-center justify-center rounded-lg"
            >
              <Pencil size={13} />
            </button>
          )
        }
      />

      <div className="relative flex flex-1 items-center gap-6 py-6">
        <Ring percent={percent} />

        <div className="min-w-0 flex-1">
          {!editing ? (
            <>
              <p className="truncate text-2xl font-black tracking-tight text-main sm:text-3xl">
                {formatCurrency(budget, "IDR")}
              </p>
              <p className="mt-2 text-xs text-subtle">
                {isOver ? (
                  <span className="font-semibold text-rose-500">Melewati batas pengeluaran</span>
                ) : (
                  <>
                    Sisa{" "}
                    <span className="font-semibold text-emerald-500">
                      {formatCurrency(remaining, currency)}
                    </span>
                  </>
                )}
              </p>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(formatDigits(e.target.value))}
                autoFocus
                className="input-glass w-full min-w-0 flex-1 rounded-xl px-3 py-2 text-sm font-semibold"
              />
              <button
                onClick={save}
                aria-label="Simpan"
                className="btn-primary inline-flex h-9 w-9 items-center justify-center rounded-xl"
              >
                <Check size={14} />
              </button>
              <button
                onClick={cancel}
                aria-label="Batal"
                className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-xl"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3">
        <div className="tile rounded-2xl p-4">
          <p className="text-[11px] font-medium text-subtle">Terpakai</p>
          <p className="mt-1 text-lg font-bold text-main">{Math.min(Math.round(percent), 999)}%</p>
        </div>
        <div className="tile rounded-2xl p-4">
          <p className="text-[11px] font-medium text-subtle">Sisa</p>
          <p className={`mt-1 truncate text-lg font-bold ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
            {formatCurrency(remaining, currency)}
          </p>
        </div>
      </div>
      <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--track)]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percent, 100)}%`, background: statusColor(percent) }}
        />
      </div>
    </div>
  );
}

/* ---------- Grafik kosong ---------- */
function EmptyChart() {
  return (
    <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--line)] text-center">
      <svg
        viewBox="0 0 400 140"
        className="absolute inset-x-0 bottom-0 h-40 w-full opacity-60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="emptyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 110 C 60 100, 90 120, 140 90 S 230 70, 270 60 S 350 40, 400 30 L400 140 L0 140 Z"
          fill="url(#emptyFill)"
        />
        <path
          d="M0 110 C 60 100, 90 120, 140 90 S 230 70, 270 60 S 350 40, 400 30"
          fill="none"
          stroke="var(--text-subtle)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <span className="chip flex h-14 w-14 items-center justify-center rounded-2xl text-accent">
          <LineChart size={24} />
        </span>
        <p className="mt-4 text-sm font-bold text-main">Grafik belum tersedia</p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-subtle">
          Catat pemasukan atau pengeluaran pertamamu, dan grafik akan muncul di sini.
        </p>
      </div>
    </div>
  );
}

/* ---------- Kesehatan keuangan kosong ---------- */
function EmptyHealth() {
  return (
    <div className={PANEL + " items-center justify-center text-center"}>
      <span className="chip flex h-14 w-14 items-center justify-center rounded-2xl text-accent">
        <Activity size={24} />
      </span>
      <p className="mt-5 text-base font-bold text-main">Financial health</p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-subtle">
        Skor kesehatan keuangan akan dihitung otomatis setelah ada data pemasukan dan pengeluaran pada periode ini.
      </p>
      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2">
        {["Tabungan", "Utang", "Dana darurat"].map((label) => (
          <div key={label} className="tile rounded-xl px-2 py-3">
            <p className="text-[10px] font-semibold text-subtle">{label}</p>
            <p className="mt-1 text-sm font-bold text-main">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Halaman dashboard ---------- */
export default function DashboardPage() {
  const router = useRouter();
  const formRef = useRef(null);

  const { user, loading } = useAuth();
  const { goals } = useSavingGoals();

  const [currency, setCurrency] = useState("IDR");
  const [isProUser, setIsProUser] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user) setIsProUser(user.isPro || false);
  }, [user]);

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

  const [showBalance, setShowBalance] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hideBalanceByDefault") !== "true";
    }
    return true;
  });

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
  const [previewImageModalUrl, setPreviewImageModalUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const activePeriodLabel = useMemo(() => {
    if (filterMode === "custom" && startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString("id-ID")} – ${new Date(
        endDate
      ).toLocaleDateString("id-ID")}`;
    }
    return `${MONTH_NAMES[month]} ${year}`;
  }, [filterMode, startDate, endDate, month, year]);

  const groupedTransactions = useMemo(() => {
    const groups = [];
    const index = new Map();
    transactions.forEach((t) => {
      const date = toDate(t.transactionDate);
      const key = isNaN(date)
        ? "Tanpa tanggal"
        : date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
      if (!index.has(key)) {
        index.set(key, groups.length);
        groups.push({ key, items: [] });
      }
      groups[index.get(key)].items.push(t);
    });
    return groups;
  }, [transactions]);

  useEffect(() => {
    const updateCurrency = () => {
      setCurrency(localStorage.getItem("app_currency") || "IDR");
    };
    const updateBalanceVisibility = () => {
      setShowBalance(localStorage.getItem("hideBalanceByDefault") !== "true");
    };

    updateCurrency();
    updateBalanceVisibility();

    window.addEventListener("currencyChange", updateCurrency);
    window.addEventListener("storage_hide_balance", updateBalanceVisibility);
    window.addEventListener("storage", updateBalanceVisibility);

    return () => {
      window.removeEventListener("currencyChange", updateCurrency);
      window.removeEventListener("storage_hide_balance", updateBalanceVisibility);
      window.removeEventListener("storage", updateBalanceVisibility);
    };
  }, []);

  const handleToggleBalance = () => {
    const next = !showBalance;
    setShowBalance(next);
    localStorage.setItem("hideBalanceByDefault", String(!next));
    window.dispatchEvent(new Event("storage_hide_balance"));
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
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
    reader.onload = () => setImagePreview(reader.result);
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
      setTransactionDate(toDate(transaction.transactionDate).toISOString().split("T")[0]);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowTransactionModal(true);
  };

  const editTransaction = (transaction) => {
    loadTransaction(transaction);
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => setShowTransactionModal(false);

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

      toast.success("Transaksi berhasil disimpan");
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
      toast.success("Transaksi berhasil dihapus");
      await refreshTransactions();
    } catch (error) {
      console.error("Delete transaction error:", error);
      Swal.fire("Gagal", "Gagal menghapus transaksi", "error");
    }
  };

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

  const usedPercent = income > 0 ? Math.round((expense / income) * 100) : 0;
  const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 3 + i);
  const greetingName = user?.displayName?.split(" ")[0] || "kamu";

  const formatMoney = (value) =>
    showBalance ? formatCurrency(value, currency) : "••••••";

  const flowTotal = (totalIncome || 0) + (totalExpense || 0);
  const incomeShare = flowTotal > 0 ? ((totalIncome || 0) / flowTotal) * 100 : 50;

  const periodFlow = (income || 0) + (expense || 0);
  const periodIncomeShare = periodFlow > 0 ? ((income || 0) / periodFlow) * 100 : 50;

  const hasPeriodData = (income || 0) > 0 || (expense || 0) > 0;
  const isNegativeBalance = totalBalance < 0;

  const periodStats = [
    {
      label: "Pemasukan",
      value: formatMoney(income),
      tone: "text-emerald-500",
      bg: "bg-emerald-500/15",
      Icon: ArrowDownRight,
    },
    {
      label: "Pengeluaran",
      value: formatMoney(expense),
      tone: "text-rose-500",
      bg: "bg-rose-500/15",
      Icon: ArrowUpRight,
    },
    {
      label: "Transaksi",
      value: transactions.length,
      tone: "text-main",
      bg: "bg-accent/15",
      Icon: Receipt,
    },
    {
      label: "Terpakai",
      value: `${usedPercent}%`,
      tone: "text-main",
      bg: "bg-indigo-500/15",
      Icon: Sparkles,
      hint: balance >= 0 ? "Surplus" : "Defisit",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-muted">
            <CalendarDays size={12} className="text-accent" />
            {MONTH_NAMES[month]} {year}
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-main sm:text-4xl">
            Halo, {greetingName} <span className="inline-block">👋</span>
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Transaksi baru
        </button>
      </header>

      {/* HERO SALDO */}
      <section className="glass-strong relative overflow-hidden rounded-[28px] p-5 sm:rounded-[32px] sm:p-10">
        <div
          aria-hidden
          className="animate-float-a pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl sm:h-80 sm:w-80"
        />
        <div
          aria-hidden
          className="animate-float-b pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl sm:h-72 sm:w-72"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Wallet size={14} className="text-accent" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle sm:text-[11px]">
                Total saldo
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <h2 className="min-w-0 text-[clamp(1.9rem,8.5vw,4.5rem)] font-black leading-none tracking-tight text-main">
                <SignedAmount value={totalBalance} currency={currency} hidden={!showBalance} />
              </h2>
              <button
                onClick={handleToggleBalance}
                aria-label={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                className="btn-icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              >
                {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>

            <span
              className={`chip mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isNegativeBalance ? "text-rose-500" : "text-emerald-500"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isNegativeBalance ? "bg-rose-500" : "bg-emerald-500"}`} />
              {isNegativeBalance ? "Defisit" : "Surplus"} • sepanjang waktu
            </span>

            <div className="mt-6 sm:mt-8">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--track)] sm:h-2.5">
                <div
                  className="h-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-700"
                  style={{ width: `${incomeShare}%` }}
                />
                <div
                  className="h-full bg-linear-to-r from-rose-400 to-pink-500 transition-all duration-700"
                  style={{ width: `${100 - incomeShare}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="tile flex items-center gap-3 rounded-2xl p-3.5 sm:gap-4 sm:p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 sm:h-11 sm:w-11">
                <ArrowDownRight size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-subtle">Total pemasukan</p>
                <p className="mt-0.5 truncate text-base font-bold text-emerald-500 sm:text-xl">
                  {formatMoney(totalIncome)}
                </p>
              </div>
            </div>
            <div className="tile flex items-center gap-3 rounded-2xl p-3.5 sm:gap-4 sm:p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500 sm:h-11 sm:w-11">
                <ArrowUpRight size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-subtle">Total pengeluaran</p>
                <p className="mt-0.5 truncate text-base font-bold text-rose-500 sm:text-xl">
                  {formatMoney(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BARIS 1: PERIODE & BATAS PENGELUARAN */}
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        <div className={PANEL}>
          <PanelHeader label="Periode" title={activePeriodLabel} />

          <div className="mt-5 flex flex-col gap-3">
            <div className="tile grid w-full grid-cols-2 gap-1 rounded-2xl p-1">
              {[
                { key: "monthly", label: "Bulanan" },
                { key: "custom", label: "Rentang" },
              ].map((opt) => {
                const active = filterMode === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => (opt.key === "monthly" ? resetToMonthly() : setFilterMode("custom"))}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      active ? "btn-primary" : "nav-item"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {filterMode === "monthly" ? (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="input-glass rounded-xl px-3 py-2.5 text-sm"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i}>{name}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="input-glass rounded-xl px-3 py-2.5 text-sm"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-glass rounded-xl px-3 py-2.5 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-glass rounded-xl px-3 py-2.5 text-sm"
                />
                <button
                  onClick={handleApplyCustomFilter}
                  className="btn-primary col-span-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
                >
                  Terapkan
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center py-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              {periodStats.map((s) => {
                const Icon = s.Icon;
                return (
                  <div key={s.label} className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${s.bg} ${s.tone}`}>
                        <Icon size={14} />
                      </span>
                      <p className="text-xs font-medium text-subtle">{s.label}</p>
                    </div>
                    <p
                      className={`mt-2 break-words text-[clamp(1rem,1.6vw,1.25rem)] font-bold leading-tight tabular-nums ${s.tone}`}
                    >
                      {s.value}
                    </p>
                    {s.hint && <p className="mt-0.5 text-[11px] text-subtle">{s.hint}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] text-subtle">
              <span>Komposisi arus kas</span>
              <span className="font-semibold text-main">
                {hasPeriodData ? `${Math.round(periodIncomeShare)}% masuk` : "Belum ada data"}
              </span>
            </div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-700"
                style={{ width: `${periodIncomeShare}%` }}
              />
              <div
                className="h-full bg-linear-to-r from-rose-400 to-pink-500 transition-all duration-700"
                style={{ width: `${100 - periodIncomeShare}%` }}
              />
            </div>
          </div>
        </div>

        <BudgetCard totalExpense={expense} currency={currency} />
      </section>

      {/* BARIS 2: GRAFIK & KESEHATAN */}
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
        <div className={PANEL}>
          <PanelHeader label="Grafik" title="Pemasukan vs pengeluaran" />
          <div className="mt-5 flex-1">
            {hasPeriodData ? (
              <div className="h-[280px] w-full sm:h-full sm:min-h-[300px]">
                <FinanceChart income={income || 0} expense={expense || 0} />
              </div>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        <div className="h-full">
          {hasPeriodData ? (
            <FinancialHealthCard
              isPro={isProUser}
              income={income || 0}
              expense={expense || 0}
              totalSavings={totalBalance || 0}
              monthlyDebt={0}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          ) : (
            <EmptyHealth />
          )}
        </div>
      </section>

      {/* RIWAYAT TRANSAKSI */}
      <section className="glass rounded-[28px] p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle sm:text-[11px]">Riwayat</p>
            <h3 className="mt-1 text-base font-bold text-main sm:text-lg">Transaksi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportExcel(transactions, month, year)}
              disabled={transactions.length === 0}
              className="btn-ghost inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button
              onClick={() => exportPDF(transactions, month, year)}
              disabled={transactions.length === 0}
              className="btn-ghost inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              <FileText size={14} /> PDF
            </button>
          </div>
        </div>

        {loadingTransactions && (
          <p className="py-10 text-center text-sm text-subtle">Memuat transaksi...</p>
        )}

        {errorTransactions && (
          <p className="py-6 text-center text-sm text-rose-500">{errorTransactions}</p>
        )}

        {!loadingTransactions && !errorTransactions && transactions.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--line)] px-6 py-14 text-center">
            <span className="chip flex h-16 w-16 items-center justify-center rounded-2xl text-accent">
              <Receipt className="h-7 w-7" />
            </span>
            <div>
              <p className="text-base font-bold text-main">Belum ada transaksi</p>
              <p className="mt-1 text-xs text-subtle">
                Catat transaksi pertamamu pada periode ini untuk mulai melihat ringkasannya.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Catat transaksi pertama
            </button>
          </div>
        )}

        {!loadingTransactions && !errorTransactions && transactions.length > 0 && (
          <div className="space-y-4">
            {groupedTransactions.map((group) => {
              const dayNet = group.items.reduce((sum, t) => sum + signedDelta(t), 0);
              return (
                <div
                  key={group.key}
                  className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--glass-hover)]"
                >
                  {/* Header tanggal dengan selisih harian */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-2.5">
                    <p className="min-w-0 text-[11px] font-semibold text-muted">{group.key}</p>
                    <p
                      className={`shrink-0 text-[11px] font-bold tabular-nums ${
                        dayNet >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {dayNet >= 0 ? "+" : "−"} {formatMoney(Math.abs(dayNet))}
                    </p>
                  </div>

                  {/* Baris transaksi */}
                  <ul className="divide-y divide-[var(--line)]">
                    {group.items.map((t) => {
                      const isIncome = t.type === "income";
                      const Icon = isIncome ? ArrowDownRight : ArrowUpRight;

                      return (
                        <li
                          key={t.id}
                          className="flex flex-col gap-2.5 px-4 py-3.5 transition hover:bg-[var(--glass-bg-strong)] sm:flex-row sm:items-center sm:gap-4"
                        >
                          {/* Isi utama: ikon, teks, nominal */}
                          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                            <span
                              className={`mt-0.5 h-9 w-[3px] shrink-0 rounded-full sm:mt-0 ${
                                isIncome ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />

                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                isIncome ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              <Icon size={15} />
                            </span>

                            {/* Teks: lebar penuh, tidak dipotong */}
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-sm font-semibold leading-snug text-main">
                                {t.category || (isIncome ? "Pemasukan" : "Pengeluaran")}
                              </p>
                              <p className="mt-0.5 break-words text-xs leading-relaxed text-subtle">
                                {t.note || "Tanpa catatan"}
                              </p>
                            </div>

                            <p
                              className={`shrink-0 whitespace-nowrap pt-0.5 text-right text-sm font-bold tabular-nums ${
                                isIncome ? "text-emerald-500" : "text-rose-500"
                              }`}
                            >
                              {isIncome ? "+" : "−"} {formatMoney(t.amount)}
                            </p>
                          </div>

                          {/* Aksi: baris sendiri di HP, sebaris di layar besar */}
                          <div className="flex shrink-0 items-center justify-end gap-1 border-t border-[var(--line)] pt-2.5 sm:border-0 sm:pt-0">
                            {t.imageUrl && (
                              <button
                                onClick={() => setPreviewImageModalUrl(t.imageUrl)}
                                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-subtle transition hover:bg-[var(--glass-bg-strong)] hover:text-accent"
                              >
                                Bukti
                              </button>
                            )}
                            <button
                              onClick={() => editTransaction(t)}
                              aria-label="Edit transaksi"
                              title="Edit"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition hover:bg-[var(--glass-bg-strong)] hover:text-main"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              aria-label="Hapus transaksi"
                              title="Hapus"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition hover:bg-rose-500/10 hover:text-rose-500"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL TAMBAH / EDIT TRANSAKSI (di tengah area konten, di kanan sidebar) */}
      {showTransactionModal && (
        <div
          className="fixed inset-y-0 left-0 right-0 z-[9999] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm lg:left-[280px] sm:items-center sm:p-4"
          onClick={closeTransactionModal}
        >
          <div
            className="glass-strong relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] p-5 [scrollbar-gutter:stable] sm:max-w-2xl sm:rounded-[28px] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
              <div>
                <h2 className="text-lg font-bold text-main">
                  {editingId ? "Edit transaksi" : "Transaksi baru"}
                </h2>
                <p className="text-xs text-subtle">
                  {editingId ? "Perbarui rincian transaksi" : "Catat arus kas baru"}
                </p>
              </div>
              <button
                onClick={closeTransactionModal}
                aria-label="Tutup"
                className="btn-icon inline-flex h-9 w-9 items-center justify-center rounded-xl"
              >
                <X className="h-4 w-4" />
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
              setAmount={setAmount}
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
              onPreviewClick={(url) => setPreviewImageModalUrl(url)}
              isProUser={isProUser}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>
        </div>
      )}

      {/* MODAL UPGRADE PRO */}
      <UpgradeProModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccessUpgrade={() => setIsProUser(true)}
      />

      {/* PRATINJAU BUKTI (di tengah area konten, di kanan sidebar) */}
      {previewImageModalUrl && (
        <div
          className="fixed inset-y-0 left-0 right-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md lg:left-[280px]"
          onClick={() => setPreviewImageModalUrl(null)}
        >
          <div className="relative flex max-h-[90vh] max-w-4xl flex-col items-center justify-center">
            <button
              onClick={() => setPreviewImageModalUrl(null)}
              aria-label="Tutup pratinjau"
              className="btn-icon absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={previewImageModalUrl}
              alt="Bukti transaksi"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}