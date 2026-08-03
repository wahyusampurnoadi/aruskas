"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import WalletHeader from "@/components/wallets/WalletHeader";
import WalletCard from "@/components/wallets/WalletCard";
import WalletModal from "@/components/wallets/WalletModal";

// Helper Tema Dinamis
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
  { id: "1", name: "BCA Utama", type: "Bank", balance: 4500000, accountNumber: "1234567890" },
  { id: "2", name: "GoPay / E-Wallet", type: "E-Wallet", balance: 350000, accountNumber: "08123456789" },
  { id: "3", name: "Dompet Tunai", type: "Cash", balance: 750000, accountNumber: "Uang Fisik" },
];

export default function WalletsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [wallets, setWallets] = useState(() =>
    DEFAULT_WALLETS.map((w) => ({ ...w, theme: getThemeProps(w.type) }))
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newWallet, setNewWallet] = useState({ name: "", type: "Bank", balance: "", accountNumber: "" });
  const [editWallet, setEditWallet] = useState({ id: "", name: "", type: "Bank", balance: "", accountNumber: "" });

  useEffect(() => {
    const saved = localStorage.getItem("aruskas_wallets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWallets(parsed.map((w) => ({ ...w, theme: getThemeProps(w.type) })));
      } catch (e) {
        console.error("Gagal membaca data dari localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("aruskas_wallets", JSON.stringify(wallets));
    }
  }, [wallets, isHydrated]);

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

  if (!isHydrated) return null;

  return (
    <div className="w-full space-y-8">
      <WalletHeader
        totalBalance={totalBalance}
        totalWallets={wallets.length}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            totalBalance={totalBalance}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteWallet}
          />
        ))}
      </div>

      <WalletModal
        isOpen={showAddModal}
        title="Tambah Dompet / Aset"
        submitLabel="Simpan Dompet"
        formData={newWallet}
        setFormData={setNewWallet}
        onSubmit={handleAddWallet}
        onClose={() => setShowAddModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <WalletModal
        isOpen={showEditModal}
        title="Edit Data Dompet / Aset"
        submitLabel="Perbarui Dompet"
        formData={editWallet}
        setFormData={setEditWallet}
        onSubmit={handleUpdateWallet}
        onClose={() => setShowEditModal(false)}
        formatRupiahInput={formatRupiahInput}
      />
    </div>
  );
}