"use client";

import { useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  Pencil,
  CreditCard,
  Landmark,
  Banknote,
  Sparkles,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

export default function WalletsPage() {
  const [wallets, setWallets] = useState([
    {
      id: "1",
      name: "BCA Utama",
      type: "Bank",
      balance: 4500000,
      accountNumber: "1234567890",
      iconBg: "bg-blue-500/20 text-cyan-400",
    },
    {
      id: "2",
      name: "GoPay / E-Wallet",
      type: "E-Wallet",
      balance: 350000,
      accountNumber: "08123456789",
      iconBg: "bg-cyan-500/20 text-teal-300",
    },
    {
      id: "3",
      name: "Dompet Tunai",
      type: "Cash",
      balance: 750000,
      accountNumber: "Uang Fisik",
      iconBg: "bg-emerald-500/20 text-emerald-400",
    },
  ]);

  // Helper Functions untuk Format Ribuan & Cegah Minus
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

  // State Modal Tambah & Edit
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

  // Handle Tambah Dompet Baru
  const handleAddWallet = (e) => {
    e.preventDefault();
    if (!newWallet.name || newWallet.balance === "") return;

    let iconBg = "bg-blue-500/20 text-cyan-400";
    if (newWallet.type === "E-Wallet") iconBg = "bg-cyan-500/20 text-teal-300";
    if (newWallet.type === "Cash") iconBg = "bg-emerald-500/20 text-emerald-400";

    const createdWallet = {
      id: Date.now().toString(),
      name: newWallet.name,
      type: newWallet.type,
      balance: parseRupiahInput(newWallet.balance),
      accountNumber: newWallet.accountNumber || "-",
      iconBg,
    };

    setWallets([...wallets, createdWallet]);
    setNewWallet({ name: "", type: "Bank", balance: "", accountNumber: "" });
    setShowAddModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Dompet baru berhasil ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#070d19",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-xl",
      },
    });
  };

  // Buka Modal Edit
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

  // Handle Simpan Perubahan Edit
  const handleUpdateWallet = (e) => {
    e.preventDefault();

    let iconBg = "bg-blue-500/20 text-cyan-400";
    if (editWallet.type === "E-Wallet") iconBg = "bg-cyan-500/20 text-teal-300";
    if (editWallet.type === "Cash") iconBg = "bg-emerald-500/20 text-emerald-400";

    setWallets(
      wallets.map((w) =>
        w.id === editWallet.id
          ? {
              ...w,
              name: editWallet.name,
              type: editWallet.type,
              balance: parseRupiahInput(editWallet.balance),
              accountNumber: editWallet.accountNumber || "-",
              iconBg,
            }
          : w
      )
    );

    setShowEditModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Data dompet berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#070d19",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-xl",
      },
    });
  };

  // Handle Hapus Dompet
  const handleDeleteWallet = (id) => {
    Swal.fire({
      title: "Hapus Dompet?",
      text: "Data dompet ini akan dihapus dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
      background: "#070d19",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-xl",
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

  return (
    <div className="w-full space-y-6">
      {/* Banner Header */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Wallet Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kelola Dompet
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              Atur dan pantau semua aliran dana dari bank, e-wallet, hingga dompet tunai dalam satu ekosistem terpadu.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dompet</span>
          </button>
        </div>

        {/* Cards Ringkasan */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Seluruh Saldo
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Rp {totalBalance.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status Dompet
              </span>
              <p className="text-xl font-bold text-cyan-400 mt-1">
                {wallets.length} Dompet Aktif
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards Dompet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="relative group rounded-2xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 p-5 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl ${wallet.iconBg} border border-white/10`}>
                    {wallet.type === "Bank" && <Landmark className="w-4 h-4" />}
                    {wallet.type === "E-Wallet" && <CreditCard className="w-4 h-4" />}
                    {wallet.type === "Cash" && <Banknote className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    {wallet.type}
                  </span>
                </div>

                {/* Tombol Aksi (Edit & Hapus) */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleOpenEdit(wallet)}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer"
                    title="Edit Dompet"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                    title="Hapus Dompet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Nama & Nomor Akun */}
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {wallet.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {wallet.accountNumber}
              </p>
            </div>

            {/* Saldo Nominal */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Saldo Saat Ini
              </span>
              <p className="text-xl font-black text-white mt-1 tracking-tight">
                Rp {wallet.balance.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Dompet */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#070d19] border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Tambah Dompet Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BCA, OVO, Cash"
                  value={newWallet.name}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, name: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tipe Dompet
                </label>
                <select
                  value={newWallet.type}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, type: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nomor Rekening / Akun
                </label>
                <input
                  type="text"
                  placeholder="Opsional (No Rek / HP)"
                  value={newWallet.accountNumber}
                  onChange={(e) =>
                    setNewWallet({
                      ...newWallet,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Saldo Awal (Rp)
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
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Simpan Dompet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Dompet */}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#070d19] border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Edit Data Dompet
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BCA, OVO, Cash"
                  value={editWallet.name}
                  onChange={(e) =>
                    setEditWallet({ ...editWallet, name: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tipe Dompet
                </label>
                <select
                  value={editWallet.type}
                  onChange={(e) =>
                    setEditWallet({ ...editWallet, type: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Cash">Cash / Tunai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nomor Rekening / Akun
                </label>
                <input
                  type="text"
                  placeholder="Opsional (No Rek / HP)"
                  value={editWallet.accountNumber}
                  onChange={(e) =>
                    setEditWallet({
                      ...editWallet,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Saldo Saat Ini (Rp)
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
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
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