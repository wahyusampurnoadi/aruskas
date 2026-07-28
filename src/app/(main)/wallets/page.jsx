"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  Pencil,
  CreditCard,
  Landmark,
  Banknote,
  Sparkles,
  TrendingUp,
  X,
  Bitcoin,
  Lock,
  FileText,
  PieChart,
  Building2,
} from "lucide-react";
import Swal from "sweetalert2";

// Helper Tema Dinamis berdasarkan Tipe Dompet/Aset
const getThemeProps = (type) => {
  switch (type) {
    case "E-Wallet":
      return {
        badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        barGradient: "from-emerald-400 to-teal-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
        borderColor: "group-hover:border-emerald-500/40",
      };
    case "Cash":
      return {
        badgeBg: "bg-violet-500/10 border-violet-500/30 text-violet-400",
        iconBg: "bg-violet-500/20 text-violet-300 border-violet-500/30",
        barGradient: "from-violet-500 to-purple-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
        borderColor: "group-hover:border-violet-500/40",
      };
    case "Saham":
      return {
        badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        iconBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        barGradient: "from-blue-500 to-indigo-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
        borderColor: "group-hover:border-blue-500/40",
      };
    case "Crypto":
      return {
        badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        iconBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        barGradient: "from-amber-400 to-orange-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
        borderColor: "group-hover:border-amber-500/40",
      };
    case "Deposito":
      return {
        badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
        iconBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        barGradient: "from-indigo-500 to-sky-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
        borderColor: "group-hover:border-indigo-500/40",
      };
    case "Obligasi":
      return {
        badgeBg: "bg-teal-500/10 border-teal-500/30 text-teal-400",
        iconBg: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        barGradient: "from-teal-400 to-emerald-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]",
        borderColor: "group-hover:border-teal-500/40",
      };
    case "Reksadana":
      return {
        badgeBg: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
        iconBg: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
        barGradient: "from-fuchsia-500 to-pink-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]",
        borderColor: "group-hover:border-fuchsia-500/40",
      };
    case "Properti":
      return {
        badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        iconBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        barGradient: "from-rose-500 to-red-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
        borderColor: "group-hover:border-rose-500/40",
      };
    case "Bank":
    default:
      return {
        badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        iconBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        barGradient: "from-cyan-500 to-blue-500",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
        borderColor: "group-hover:border-cyan-500/40",
      };
  }
};

const DEFAULT_WALLETS = [
  {
    id: "1",
    name: "BCA Utama",
    type: "Bank",
    balance: 4500000,
    accountNumber: "1234567890",
  },
  {
    id: "2",
    name: "GoPay / E-Wallet",
    type: "E-Wallet",
    balance: 350000,
    accountNumber: "08123456789",
  },
  {
    id: "3",
    name: "Dompet Tunai",
    type: "Cash",
    balance: 750000,
    accountNumber: "Uang Fisik",
  },
];

export default function WalletsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [wallets, setWallets] = useState(() =>
    DEFAULT_WALLETS.map((w) => ({
      ...w,
      theme: getThemeProps(w.type),
    }))
  );

  // 1. Ambil data dari localStorage hanya di Client side setelah mount
  useEffect(() => {
    const saved = localStorage.getItem("aruskas_wallets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWallets(
          parsed.map((w) => ({
            ...w,
            theme: getThemeProps(w.type),
          }))
        );
      } catch (e) {
        console.error("Gagal membaca data dari localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // 2. Simpan ke localStorage setiap kali state `wallets` berubah (hanya setelah hydrated)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("aruskas_wallets", JSON.stringify(wallets));
    }
  }, [wallets, isHydrated]);

  // Helper Ikon berdasarkan Tipe
  const renderWalletIcon = (type) => {
    switch (type) {
      case "Bank":
        return <Landmark className="w-5 h-5" />;
      case "E-Wallet":
        return <CreditCard className="w-5 h-5" />;
      case "Cash":
        return <Banknote className="w-5 h-5" />;
      case "Saham":
        return <TrendingUp className="w-5 h-5" />;
      case "Crypto":
        return <Bitcoin className="w-5 h-5" />;
      case "Deposito":
        return <Lock className="w-5 h-5" />;
      case "Obligasi":
        return <FileText className="w-5 h-5" />;
      case "Reksadana":
        return <PieChart className="w-5 h-5" />;
      case "Properti":
        return <Building2 className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  // State Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newWallet, setNewWallet] = useState({
    name: "",
    type: "Bank",
    balance: "",
    accountNumber: "",
  });

  const [editWallet, setEditWallet] = useState({
    id: "",
    name: "",
    type: "Bank",
    balance: "",
    accountNumber: "",
  });

  const formatRupiahInput = (value) => {
    if (!value) return "";
    const cleanNumber = value.toString().replace(/\D/g, "");
    if (!cleanNumber) return "";
    return parseInt(cleanNumber, 10).toLocaleString("id-ID");
  };

  const parseRupiahInput = (formattedValue) => {
    if (!formattedValue) return 0;
    const cleanNumber = formattedValue.toString().replace(/\D/g, "");
    return cleanNumber ? parseInt(cleanNumber, 10) : 0;
  };

  // Handle Tambah Dompet
  const handleAddWallet = (e) => {
    e.preventDefault();
    if (!newWallet.name || newWallet.balance === "") return;

    const createdWallet = {
      id: Date.now().toString(),
      name: newWallet.name,
      type: newWallet.type,
      balance: parseRupiahInput(newWallet.balance),
      accountNumber: newWallet.accountNumber || "-",
      theme: getThemeProps(newWallet.type),
    };

    setWallets([...wallets, createdWallet]);
    setNewWallet({ name: "", type: "Bank", balance: "", accountNumber: "" });
    setShowAddModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Dompet / Aset baru berhasil ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#0b1329",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
      },
    });
  };

  // Handle Edit Dompet
  const handleOpenEdit = (wallet) => {
    setEditWallet({
      id: wallet.id,
      name: wallet.name,
      type: wallet.type,
      balance: formatRupiahInput(wallet.balance),
      accountNumber: wallet.accountNumber,
    });
    setShowEditModal(true);
  };

  const handleUpdateWallet = (e) => {
    e.preventDefault();
    setWallets(
      wallets.map((w) =>
        w.id === editWallet.id
          ? {
              ...w,
              name: editWallet.name,
              type: editWallet.type,
              balance: parseRupiahInput(editWallet.balance),
              accountNumber: editWallet.accountNumber || "-",
              theme: getThemeProps(editWallet.type),
            }
          : w
      )
    );

    setShowEditModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Data dompet / aset berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#0b1329",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
      },
    });
  };

  // Handle Hapus Dompet
  const handleDeleteWallet = (id) => {
    Swal.fire({
      title: "Hapus Dompet?",
      text: "Data dompet ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
      background: "#0b1329",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
        confirmButton: "rounded-xl font-bold px-5 py-2.5",
        cancelButton: "rounded-xl font-bold px-5 py-2.5",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setWallets(wallets.filter((w) => w.id !== id));
      }
    });
  };

  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  // Mencegah mismatch render sebelum hydration selesai
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      {/* HEADER SECTION */}
      <div className="relative w-full rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Wallet Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Kelola Dompet & Aset
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Atur dan pantau semua aliran dana dari bank, e-wallet, hingga investasi seperti saham, crypto, dan properti.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dompet</span>
          </button>
        </div>

        {/* SUMMARY CARDS GRID */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Seluruh Saldo & Aset
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                Aktif
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Rp {totalBalance.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Akumulasi saldo terhitung dari seluruh dompet & instrumen investasi terhubung.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300">
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Status Alokasi
              </span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 tracking-tight">
                {wallets.length} Akun / Aset Aktif
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Tersedia untuk transaksi harian dan portofolio investasi.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Wallet className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* WALLETS GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => {
          const percentage =
            totalBalance > 0
              ? ((wallet.balance / totalBalance) * 100).toFixed(1)
              : 0;

          return (
            <div
              key={wallet.id}
              className={`group relative rounded-3xl bg-slate-900/40 border border-white/10 ${wallet.theme.borderColor} ${wallet.theme.glowColor} p-6 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between shadow-xl overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl ${wallet.theme.iconBg} border shadow-md`}
                    >
                      {renderWalletIcon(wallet.type)}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${wallet.theme.badgeBg}`}
                      >
                        {wallet.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleOpenEdit(wallet)}
                      className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-all cursor-pointer"
                      title="Edit Dompet"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition-all cursor-pointer"
                      title="Hapus Dompet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {wallet.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1 tracking-wider">
                  {wallet.accountNumber}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-white/5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Saldo / Nilai Aset
                  </span>
                  <p className="text-2xl font-black text-white mt-1 tracking-tight">
                    Rp {wallet.balance.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-semibold">
                    <span className="text-slate-400">Alokasi Portfolio</span>
                    <span className="text-white font-bold">{percentage}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${wallet.theme.barGradient} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL TAMBAH DOMPET */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b1329] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Tambah Dompet / Aset</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Dompet / Aset
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bibit, Indodax, Rumah BSD"
                  value={newWallet.name}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, name: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tipe Dompet / Kategori
                </label>
                <select
                  value={newWallet.type}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, type: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                  <option value="Saham">Saham</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Deposito">Deposito</option>
                  <option value="Obligasi">Obligasi</option>
                  <option value="Reksadana">Reksadana</option>
                  <option value="Properti">Properti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nomor Rekening / Keterangan Akun
                </label>
                <input
                  type="text"
                  placeholder="Opsional (No Rekening / RDN / Sub-Rekening)"
                  value={newWallet.accountNumber}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, accountNumber: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Saldo / Nilai Aset Awal (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={newWallet.balance}
                  onChange={(e) =>
                    setNewWallet({
                      ...newWallet,
                      balance: formatRupiahInput(e.target.value),
                    })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Simpan Dompet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DOMPET */}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b1329] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Data Dompet / Aset</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Dompet / Aset
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BCA Utama, Bibit"
                  value={editWallet.name}
                  onChange={(e) =>
                    setEditWallet({ ...editWallet, name: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tipe Dompet / Kategori
                </label>
                <select
                  value={editWallet.type}
                  onChange={(e) =>
                    setEditWallet({ ...editWallet, type: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                  <option value="Saham">Saham</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Deposito">Deposito</option>
                  <option value="Obligasi">Obligasi</option>
                  <option value="Reksadana">Reksadana</option>
                  <option value="Properti">Properti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nomor Rekening / Keterangan Akun
                </label>
                <input
                  type="text"
                  placeholder="Opsional (No Rekening / RDN / Sub-Rekening)"
                  value={editWallet.accountNumber}
                  onChange={(e) =>
                    setEditWallet({
                      ...editWallet,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Saldo / Nilai Aset (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={editWallet.balance}
                  onChange={(e) =>
                    setEditWallet({
                      ...editWallet,
                      balance: formatRupiahInput(e.target.value),
                    })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Perbarui Dompet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}