"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import FinanceChart from "@/components/FinanceChart";
import FinancialTips from "@/components/FinancialTips";
import TotalBalanceCard from '@/components/TotalBalanceCard';
import LoadingScreen from "@/components/LoadingScreen";
import TransactionList from "@/components/TransactionList";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2';

/* ====================== */
export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [transactionDate, setTransactionDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // yyyy-mm-dd
  });
  

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const years = Array.from({ length: 21 }, (_, i) => year - 10 + i);

  const [scrolled, setScrolled] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const formRef = useRef(null);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  // Hitung total saldo keseluruhan (bukan hanya bulan ini)
  const totalIncomeAll = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpenseAll = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const totalBalanceAll = totalIncomeAll - totalExpenseAll;

  // Daftar Milestones
  const milestones = [
    { limit: 10000000, label: "10 Juta Pertama", icon: "🌱" },
    { limit: 100000000, label: "100 Juta Pertama", icon: "🚀" },
    { limit: 1000000000, label: "1 Miliar Pertama", icon: "👑" },
    { limit: 10000000000, label: "10 Miliar Pertama", icon: "💎" },
  ];

  // Cek pencapaian
  const lastAchieved = JSON.parse(sessionStorage.getItem("last_milestone_shown") || "0");

  milestones.forEach((m) => {
    // Logika: Jika saldo saat ini sudah melewati limit, 
    // DAN limit ini lebih tinggi dari milestone terakhir yang ditampilkan
    if (totalBalanceAll >= m.limit && m.limit > lastAchieved) {
      
      Swal.fire({
        title: `Selamat! 🎉`,
        html: `Anda telah mencapai <br/><b style="color: #3b82f6; font-size: 1.5rem;">${m.label}</b>`,
        icon: 'success',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Terus Berjuang!',
        backdrop: `rgba(0,0,0,0.6)`
      });

      // Simpan milestone tertinggi yang baru saja dicapai ke sessionStorage
    sessionStorage.setItem("last_milestone_shown", JSON.stringify(m.limit));
  }
  });
}, [transactions]); // Berjalan setiap kali ada transaksi baru


  /* 🔐 AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  /* 🔥 FETCH DATA */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [user]);

  /* 📅 FILTER BULAN */
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.transactionDate) return false;
      const d = t.transactionDate.toDate();
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [transactions, month, year]);
  

  /* 💰 TOTAL */
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  /* ➕ SUBMIT */
  const submit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !transactionDate) return;
  
    const dateObj = new Date(transactionDate);
  
    if (editingId) {
      await updateDoc(doc(db, "transactions", editingId), {
        type,
        amount: Number(amount),
        category,
        note,
        transactionDate: dateObj,
      });
    } else {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type,
        amount: Number(amount),
        category,
        note,
        transactionDate: dateObj,
        createdAt: serverTimestamp(), // tetap simpan createdAt
      });
    }
  
    resetForm();
  };
  

  const resetForm = () => {
    setEditingId(null);
    setType("income");
    setAmount("");
    setCategory("");
    setNote("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
  };
  

  const editTransaction = (t) => {
    setEditingId(t.id);
    setType(t.type);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setNote(t.note || "");
  
    if (t.transactionDate) {
      const d = t.transactionDate.toDate();
      setTransactionDate(d.toISOString().split("T")[0]);
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  

  const deleteTransaction = async (id) => {
    if (!confirm("Hapus transaksi?")) return;
    await deleteDoc(doc(db, "transactions", id));
  };

  /* 📤 EXPORT */
  const exportExcel = () => {
    const data = filtered.map((t, i) => ({
      No: i + 1,
      Tanggal: t.transactionDate.toDate().toLocaleDateString("id-ID"),
      Jenis: t.type,
      Kategori: t.category,
      Catatan: t.note || "-",
      Jumlah: t.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan-${month + 1}-${year}.xlsx`);
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
  
    pdf.setFontSize(14);
    pdf.text("Laporan Keuangan Bulanan", 14, 15);
  
    pdf.setFontSize(11);
    pdf.text(`Periode: ${month + 1}/${year}`, 14, 23);
  
    autoTable(pdf, {
      startY: 30,
      head: [["Tanggal", "Jenis", "Kategori", "Catatan", "Jumlah"]],
      body: filtered.map((t) => [
        t.createdAt.toDate().toLocaleDateString("id-ID"),
        t.type === "income" ? "Pemasukan" : "Pengeluaran",
        t.category,
        t.note || "-",
        `Rp ${t.amount.toLocaleString("id-ID")}`,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [30, 64, 175], // biru
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        textColor: 20,
      },
      columnStyles: {
        4: { halign: "right" },
      },
    });
  
    pdf.save(`Laporan-${month + 1}-${year}.pdf`);
  };
  

  // loading
  if (loading) return <LoadingScreen />;  

  function BudgetTracker({ totalExpense }) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      {/* --- EFEK GRID BACKGROUND --- */}
    <div className="fixed inset-0 z-0">
      {/* Pola Grid Halus */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Cahaya Biru (Glow) di bagian atas */}
      <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
    </div>

      {/* HEADER */}
      <div className="relative z-10">
      <header
        className={`
          sticky top-0 z-50
          transition-all duration-300
          ${
            scrolled
              ? "backdrop-blur-xl bg-black/40 border-white/10 shadow-lg"
              : "bg-transparent border-transparent"
          }
          border-b
        `}
      >
        <div className="max-w-7xl mx-auto p-5 px-8 md:px-12 flex justify-between items-center">
        <h1 className="font-bold text-xl flex items-center gap-2"> 
        <img 
          src="/logo-aruskas.png" 
          alt="Logo ArusKas"
          className="w-8 h-8 object-contain"
        />
        <span>
          Arus<span className="text-blue-500">Kas</span>
        </span>
      </h1>

          <div className="flex items-center gap-6"> {/* gap diperbesar dari 4 ke 6 */}
            <div className="flex items-center gap-3">
              <Avatar name={user.displayName || user.email} />

              <div className="leading-tight hidden sm:block"> {/* Sembunyikan detail di layar sangat kecil jika perlu */}
                <p className="text-sm font-semibold">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut(auth)}
              className="text-red-400 hover:text-red-300 text-sm cursor-pointer font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>


      <main className="max-w-6xl mx-auto p-6 space-y-8">

      <TotalBalanceCard transactions={transactions} />

      {/* Grid Baru untuk Budget dan Ringkasan Cepat */}
  <div className="grid md:grid-cols-2 gap-6">
    <BudgetTracker totalExpense={expense} /> {/* 'expense' adalah variabel pengeluaran bulanan yang sudah Anda buat */}

    {/* Komponen Tips Random - Desain sudah seragam */}
    <FinancialTips />
    
  </div>
        {/* FILTER */}
        <div className="flex flex-wrap gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="
            bg-black/40 text-white p-3 rounded-xl cursor-pointer
            border border-white/10
            hover:border-blue-500/50 hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            transition-all duration-200
          "
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i} className="bg-gray-900">
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          size={1} // tetap dropdown normal
          className="
            bg-black/40 text-white p-3 rounded-xl cursor-pointer
            border border-white/10
            hover:border-purple-500/50 hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-purple-500/50
            transition-all duration-200
          "
        >
          {years.map((y) => (
            <option
              key={y}
              value={y}
              className="bg-gray-900"
            >
              {y}
            </option>
          ))}
        </select>

          <button
            onClick={exportExcel}
            className="px-4 py-3 bg-green-600/20 rounded-xl cursor-pointer"
          >
            📊 Excel
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-3 bg-red-600/20 rounded-xl cursor-pointer"
          >
            📄 PDF
          </button>
        </div>

        {/* STAT */}
        <div className="grid md:grid-cols-3 gap-4 ">
          <Stat title="Pemasukan" value={income} color="green" />
          <Stat title="Pengeluaran" value={expense} color="red" />
          <Stat title="Saldo" value={balance} highlight />
        </div>

        {/* FORM + CHART */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* FORM */}
          <form
            ref={formRef}
            onSubmit={submit}
            className={`transition-all duration-500 ${editingId ? "ring-2 ring-blue-500 bg-blue-500/5" : "bg-white/5"} p-6 rounded-2xl space-y-3 flex flex-col`}
          >
            <h2 className="font-semibold text-lg">
              {editingId ? "Edit" : "Tambah"} Transaksi
            </h2>

            <div className="flex gap-2">
              <Toggle
                active={type === "income"}
                onClick={() => setType("income")}
                label="Pemasukan"
              />
              <Toggle
                active={type === "expense"}
                onClick={() => setType("expense")}
                label="Pengeluaran"
              />
            </div>

            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="
                w-full p-3 rounded-xl bg-black/40 border border-white/10
                text-white cursor-pointer outline-none
                focus:ring-2 focus:ring-blue-500/50
                scheme-dark
              "
            />

            <input
              type="number"
              placeholder="Jumlah (Rp)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
                w-full p-3 rounded-xl bg-black/40
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
              "
            />

            <input
              placeholder="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40"
            />

            <textarea
              placeholder="Catatan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-black/40 resize-none"
            />

            <button className="mt-auto w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold cursor-pointer">
              Simpan
            </button>
          </form>

          {/* CHART */}
          <div className="bg-white/5 p-6 rounded-2xl flex flex-col">
            <h2 className="font-semibold text-lg mb-3">Grafik Bulanan</h2>
            <div className="flex-1 h-[300px]">
              <FinanceChart income={income || 0} expense={expense || 0} />
            </div>
          </div>
        </div>

          {/* LIST TRANSAKSI */}
          <TransactionList 
            transactions={filtered} 
            onEdit={editTransaction} 
            onDelete={deleteTransaction} 
            onExportExcel={exportExcel}
            onExportPDF={exportPDF}
          />
        </main>
      </div>
    </div>
  );
}

/* ===== COMPONENT ===== */
function Avatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
        {initial}
      </div>
    );
  }
  
function Stat({ title, value, color, highlight }) {
  return (
    <div className={`p-5 rounded-2xl ${highlight ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-white/5"}`}>
      <p className="text-sm">{title}</p>
      <h3
        className={`text-2xl font-bold ${
          color === "green"
            ? "text-green-400"
            : color === "red"
            ? "text-red-400"
            : ""
        }`}
      >
        Rp {value.toLocaleString("id-ID")}
      </h3>
    </div>
  );
}

function Toggle({ active, onClick, label }) {
  const isIncome = label === "Pemasukan";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 p-3 rounded-xl cursor-pointer font-semibold transition
        ${
          active
            ? isIncome
              ? "bg-green-500/30 text-green-400 ring-1 ring-green-500/40"
              : "bg-red-500/30 text-red-400 ring-1 ring-red-500/40"
            : "bg-black/40 text-gray-300 hover:bg-white/10"
        }
      `}
    >
      {label}
    </button>
  );
}


