"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import FinanceChart from "@/components/dashboard/FinanceChart";
import FinancialTips from "@/components/dashboard/FinancialTips";
import TotalBalanceCard from '@/components/dashboard/TotalBalanceCard';
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import TransactionList from "@/components/dashboard/TransactionList";
import Swal from 'sweetalert2';
import BudgetTracker from "@/components/dashboard/BudgetTracker";
import Avatar from "@/components/dashboard/Avatar";
import Stat from "@/components/dashboard/Stat";
import TransactionForm from "@/components/dashboard/TransactionForm";
import { exportExcel } from "@/lib/exportExcel";
import { exportPDF } from "@/lib/exportPdf";

/* ====================== */
export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionDate, setTransactionDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // yyyy-mm-dd
  });

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const years = Array.from({ length: 21 }, (_, i) => year - 10 + i);

  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const CLOUD_NAME = "dvzk6n0kh"; 
  const UPLOAD_PRESET = "aruskas_preset";

  const formRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Batasan 2MB
    const limitSize = 2097152; 
  
    if (file.size > limitSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: 'Ukuran maksimal foto adalah 2MB. Foto Anda: ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      });
      e.target.value = ""; 
      setImageFile(null); // Pastikan state direset jika gagal
      return;
    }
  
    // PENTING: Simpan file ke state agar bisa dibaca oleh fungsi submit
    setImageFile(file);
  };

const handleUpdate = async (transactionId, updatedData) => {
  try {
    // PASTIKAN transactionId tidak kosong
    if (!transactionId) {
      console.error("ID Transaksi tidak ditemukan");
      return;
    }

    const docRef = doc(db, "transactions", transactionId);
    
    // Gunakan updateDoc
    await updateDoc(docRef, updatedData);
    
    alert("Berhasil memperbarui data!");
  } catch (error) {
    // Di sinilah error "No document to update" tertangkap
    console.error("Error updating document: ", error);
    alert("Gagal update: Pastikan data masih ada di database.");
  }
};

useEffect(() => {
  let timeoutId;

  const handleScroll = () => {
    // 1. Logika untuk background header (scrolled)
    setScrolled(window.scrollY > 10);

    // 2. Logika Auto-Hide Navigasi Mobile
    setShowNav(true); // Munculkan kembali saat scroll
    
    // Reset timer setiap kali ada aktivitas scroll
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setShowNav(false); // Sembunyikan setelah 4 detik tidak ada aktivitas
    }, 1200);
  };

  window.addEventListener("scroll", handleScroll);
  
  // Inisialisasi timer pertama kali saat halaman dimuat
  timeoutId = setTimeout(() => setShowNav(false), 2500);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    clearTimeout(timeoutId);
  };
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
  
      const d = t.transactionDate.seconds
        ? t.transactionDate.toDate()
        : new Date(t.transactionDate);
  
      // MODE CUSTOM RANGE
      if (startDate && endDate) {
  
        const start = new Date(startDate);
  
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
  
        return d >= start && d <= end;
      }
  
      // MODE BULAN TAHUN (DEFAULT)
  
      return (
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  
  }, [
    transactions,
    month,
    year,
    startDate,
    endDate
  ]);
  

  /* 💰 TOTAL */
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
  
    if (!value) {
      setAmount("");
      return;
    }
  
    setAmount(new Intl.NumberFormat("id-ID").format(value));
  };

  /* ➕ SUBMIT */
  const submit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Input
    if (!amount || amount <= 0 || !category.trim()) {
      Swal.fire("Error", "Mohon isi semua data dengan benar", "error");
      return;
    }

    setUploading(true);

    try {
      // Ambil URL gambar lama jika sedang mode EDIT
      let imageUrl = editingId 
        ? (transactions.find(t => t.id === editingId)?.imageUrl || "") 
        : "";

      // 2. Logika Upload ke CLOUDINARY (Jika ada file baru)
      if (imageFile) {
        // Validasi ukuran file Cloudinary (Max 2MB untuk free tier aman)
        if (imageFile.size > 2 * 1024 * 1024) {
          throw new Error("Ukuran file terlalu besar. Maksimal 2MB.");
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "aruskas_preset"); 
        formData.append("cloud_name", CLOUD_NAME);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        
        if (data.secure_url) {
          imageUrl = data.secure_url; // Dapatkan link gambar dari Cloudinary
        } else {
          throw new Error("Gagal upload ke Cloudinary: " + (data.error?.message || "Unknown error"));
        }
      }

      // 3. Jalankan Simpan ke Database
      await saveToFirestore(imageUrl);

    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire("Gagal", error.message, "error");
      setUploading(false);
    }
  };

  // Fungsi pembantu untuk simpan ke database (DIPISAH AGAR RAPI)
  const saveToFirestore = async (url) => {
    try {
      const payload = {
        type,
        amount: Number(amount.replace(/\./g, "")),
        category,
        note,
        transactionDate: new Date(transactionDate),
        imageUrl: url,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        // Update Dokumen
        const docRef = doc(db, "transactions", editingId);
        await updateDoc(docRef, payload);
      } else {
        // Tambah Dokumen Baru
        await addDoc(collection(db, "transactions"), {
          ...payload,
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      Swal.fire("Berhasil", "Transaksi berhasil disimpan!", "success");
      resetForm();
    } catch (e) {
      console.error("Firestore Error:", e);
      // Cek jika error karena ID tidak ditemukan (seperti di gambar Anda)
      if (e.message.includes("not-found")) {
        Swal.fire("Error", "Data yang ingin di-update tidak ditemukan di database.", "error");
      } else {
        Swal.fire("Gagal", "Database Error: " + e.message, "error");
      }
    } finally {
      setUploading(false);
    }
  };
  

  const resetForm = () => {
    setEditingId(null);
    setType("income");
    setAmount("");
    setCategory("");
    setNote("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
    setImageFile(null); // Reset file
  };
  

  const editTransaction = (t) => {
    setEditingId(t.id);
    setType(t.type);
    setAmount(
      new Intl.NumberFormat("id-ID").format(t.amount)
    );
    setCategory(t.category);
    setNote(t.note || "");
  
    if (t.transactionDate) {
      const d = t.transactionDate.toDate();
      setTransactionDate(d.toISOString().split("T")[0]);
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  

  const deleteTransaction = async (id, imageUrl) => {
    const result = await Swal.fire({
      title: 'Hapus Transaksi?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });
  
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "transactions", id));
        
        // Jika ada gambar, beri info tambahan
        if (imageUrl) {
          console.log("Gambar terkait di Cloudinary:", imageUrl);
          Swal.fire(
            'Terhapus!',
            'Transaksi telah dihapus. (Catatan: File gambar masih tersimpan di Cloudinary Anda)',
            'success'
          );
        } else {
          Swal.fire('Terhapus!', 'Transaksi telah dihapus.', 'success');
        }
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };
  

  // loading
  if (loading) return <LoadingScreen />;  

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

      {/* Deskripsi: Navigasi Desktop tetap seperti kode Anda */}
      <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        <Link
          href="/dashboard"
          className={`relative group px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
            pathname === "/dashboard"
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {pathname === "/dashboard" && (
            <span className="absolute inset-0 bg-blue-500/10 animate-pulse"></span>
          )}
          <span className="relative z-10 flex items-center gap-2">
            🏠 Dashboard
          </span>
          {pathname === "/dashboard" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-blue-500 shadow-[0_0_8px_#3b82f6] rounded-full"></span>
          )}
        </Link>

        <Link
          href="/investasi"
          className={`relative group px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
            pathname === "/investasi"
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {pathname === "/investasi" && (
            <span className="absolute inset-0 bg-blue-500/10 animate-pulse"></span>
          )}
          <span className="relative z-10 flex items-center gap-2">
            📈 Investasi
          </span>
          {pathname === "/investasi" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-blue-500 shadow-[0_0_8px_#3b82f6] rounded-full"></span>
          )}
        </Link>
      </nav>

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
<div
  className="
    bg-gradient-to-r
    from-blue-500/10
    via-indigo-500/10
    to-purple-500/10

    backdrop-blur-xl

    border border-white/10
    rounded-2xl

    p-4
    mb-6
  "
>
  {/* DESKTOP */}
  <div className="hidden lg:flex items-center gap-6">

    {/* PERIODE */}
    <div className="flex items-center gap-3">

      <div
        className="
          px-3 py-2
          rounded-xl

          bg-blue-500/15
          border border-blue-500/20

          text-blue-300
          text-sm
          font-medium
        "
      >
        📅 Periode
      </div>

      <select
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        className="
          bg-black/40
          border border-white/10

          rounded-xl

          px-4 py-2

          text-white

          min-w-[140px]

          focus:border-blue-500/50
          focus:outline-none cursor-pointer
        "
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString("id-ID", {
              month: "long",
            })}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="
          bg-black/40
          border border-white/10

          rounded-xl

          px-4 py-2

          text-white

          min-w-[100px]

          focus:border-blue-500/50
          focus:outline-none cursor-pointer
        "
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>

    <div className="w-px h-8 bg-white/10" />

    {/* FILTER KHUSUS */}
    <div className="flex items-center gap-3">

      <div
        className="
          px-3 py-2
          rounded-xl

          bg-purple-500/15
          border border-purple-500/20

          text-purple-300
          text-sm
          font-medium
        "
      >
        🔎 Filter Custom
      </div>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="
          bg-black/40
          border border-white/10

          rounded-xl

          px-4 py-2

          text-white

          focus:border-purple-500/50
          focus:outline-none
        "
      />

      <span className="text-gray-400">
        →
      </span>

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="
          bg-black/40
          border border-white/10

          rounded-xl

          px-4 py-2

          text-white

          focus:border-purple-500/50
          focus:outline-none
        "
      />

      <button
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
        className="
          px-5 py-2

          rounded-xl

          bg-red-500/15
          border border-red-500/20

          text-red-400

          hover:bg-red-500/25

          transition-all cursor-pointer
        "
      >
        Reset
      </button>
    </div>
  </div>

  {/* MOBILE & TABLET */}
  <div className="lg:hidden space-y-4">

    {/* PERIODE */}
    <div>
      <div
        className="
          inline-flex
          items-center

          px-3 py-2

          rounded-xl

          bg-blue-500/15
          border border-blue-500/20

          text-blue-300
          text-sm
          font-medium

          mb-3
        "
      >
        📅 Periode
      </div>

      <div className="grid grid-cols-2 gap-3">

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="
            bg-black/40
            border border-white/10

            rounded-xl

            px-4 py-3

            text-white

            w-full
          "
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("id-ID", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="
            bg-black/40
            border border-white/10

            rounded-xl

            px-4 py-3

            text-white

            w-full
          "
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

      </div>
    </div>

    <div className="border-t border-white/10" />

    {/* FILTER KHUSUS */}
    <div>

      <div
        className="
          inline-flex
          items-center

          px-3 py-2

          rounded-xl

          bg-purple-500/15
          border border-purple-500/20

          text-purple-300
          text-sm
          font-medium

          mb-3
        "
      >
        🔎 Filter Khusus
      </div>

      <div className="grid grid-cols-2 gap-3">

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="
            bg-black/40
            border border-white/10

            rounded-xl

            px-4 py-3

            text-white

            w-full
          "
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="
            bg-black/40
            border border-white/10

            rounded-xl

            px-4 py-3

            text-white

            w-full
          "
        />

      </div>

      <button
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
        className="
          w-full
          mt-3

          px-4 py-3

          rounded-xl

          bg-red-500/15
          border border-red-500/20

          text-red-400

          hover:bg-red-500/25

          transition-all
        "
      >
        ↺ Reset Filter
      </button>

    </div>

  </div>
</div>

        {/* STAT */}
        <div className="grid md:grid-cols-3 gap-4 ">
          <Stat title="Pemasukan" value={income} color="green" />
          <Stat title="Pengeluaran" value={expense} color="red" />
          <Stat title="Saldo" value={balance} highlight />
        </div>

        {/* FORM + CHART */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

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
          uploading={uploading}
        />

          {/* CHART */}
          <div className="bg-white/5 p-6 rounded-2xl flex flex-col">
            <h2 className="font-semibold text-lg mb-8">Grafik Bulanan</h2>
            <div className="flex-1 h-[300px] mb-5">
              <FinanceChart income={income || 0} expense={expense || 0} />
            </div>
            {/* BOX BARU: Statistik Tambahan di Bawah Grafik */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider">Transaksi</p>
                <p className="text-xl font-bold">{filtered.length}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider">Tabungan</p>
                <p className="text-xl font-bold text-emerald-400">
                  {income + expense > 0 
                    ? Math.round((income / (income + expense)) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider">Terpakai</p>
                <p className="text-xl font-bold text-red-400">
                  {income + expense > 0 
                    ? Math.round((expense / (income + expense)) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider">Status</p>
                <p className={`text-sm font-bold mt-1 ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {balance >= 0 ? "Surplus ✅" : "Defisit ⚠️"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {startDate && endDate && (
  <div className="
    mb-4
    bg-blue-500/10
    border border-blue-500/20
    rounded-xl
    px-4 py-3
    text-sm
    text-blue-300
  ">
    📅 Menampilkan transaksi dari{" "}
    <strong>
      {new Date(startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </strong>
    {" "}sampai{" "}
    <strong>
      {new Date(endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </strong>
  </div>
)}

          {/* LIST TRANSAKSI */}
          <TransactionList
  transactions={filtered}
  onEdit={editTransaction}
  onDelete={deleteTransaction}
  onExportExcel={() =>
    exportExcel(filtered, month, year)
  }
  onExportPDF={() =>
    exportPDF(filtered, month, year)
  }
/>
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] transition-all duration-500 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}>
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 p-2 rounded-2xl flex justify-around items-center shadow-2xl">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/dashboard" ? "bg-blue-500/10 text-blue-500" : "text-gray-400"
            }`}>
              <span className="text-xl">🏠</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
            </Link>
            
            <Link href="/investasi" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/investasi" ? "bg-blue-500/10 text-blue-500" : "text-gray-400"
            }`}>
              <span className="text-xl">📈</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Investasi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


