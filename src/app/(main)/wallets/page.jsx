"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import WalletHeader from "@/components/wallets/WalletHeader";
import WalletCard from "@/components/wallets/WalletCard";
import WalletModal from "@/components/wallets/WalletModal";

// Tema per tipe dompet (kelas ditulis lengkap agar terbaca Tailwind)
const THEMES = {
  Bank: {
    label: "Bank",
    icon: "bg-cyan-500/15 text-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-500 border-cyan-500/25",
    bar: "bg-linear-to-r from-cyan-400 to-blue-500",
    accent: "bg-linear-to-r from-cyan-400 to-blue-500",
  },
  "E-Wallet": {
    label: "E-Wallet",
    icon: "bg-emerald-500/15 text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    bar: "bg-linear-to-r from-emerald-400 to-teal-500",
    accent: "bg-linear-to-r from-emerald-400 to-teal-500",
  },
  Cash: {
    label: "Cash",
    icon: "bg-violet-500/15 text-violet-500",
    badge: "bg-violet-500/10 text-violet-500 border-violet-500/25",
    bar: "bg-linear-to-r from-violet-500 to-purple-500",
    accent: "bg-linear-to-r from-violet-500 to-purple-500",
  },
  Saham: {
    label: "Saham",
    icon: "bg-blue-500/15 text-blue-500",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/25",
    bar: "bg-linear-to-r from-blue-500 to-indigo-500",
    accent: "bg-linear-to-r from-blue-500 to-indigo-500",
  },
  Crypto: {
    label: "Crypto",
    icon: "bg-amber-500/15 text-amber-500",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    bar: "bg-linear-to-r from-amber-400 to-orange-500",
    accent: "bg-linear-to-r from-amber-400 to-orange-500",
  },
  Deposito: {
    label: "Deposito",
    icon: "bg-indigo-500/15 text-indigo-500",
    badge: "bg-indigo-500/10 text-indigo-500 border-indigo-500/25",
    bar: "bg-linear-to-r from-indigo-500 to-sky-500",
    accent: "bg-linear-to-r from-indigo-500 to-sky-500",
  },
  Obligasi: {
    label: "Obligasi",
    icon: "bg-teal-500/15 text-teal-500",
    badge: "bg-teal-500/10 text-teal-500 border-teal-500/25",
    bar: "bg-linear-to-r from-teal-400 to-emerald-500",
    accent: "bg-linear-to-r from-teal-400 to-emerald-500",
  },
  Reksadana: {
    label: "Reksadana",
    icon: "bg-fuchsia-500/15 text-fuchsia-500",
    badge: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/25",
    bar: "bg-linear-to-r from-fuchsia-500 to-pink-500",
    accent: "bg-linear-to-r from-fuchsia-500 to-pink-500",
  },
  Properti: {
    label: "Properti",
    icon: "bg-rose-500/15 text-rose-500",
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/25",
    bar: "bg-linear-to-r from-rose-500 to-red-500",
    accent: "bg-linear-to-r from-rose-500 to-red-500",
  },
};

const getThemeProps = (type) => THEMES[type] || THEMES.Bank;

const DEFAULT_WALLETS = [
  { id: "1", name: "BCA Utama", type: "Bank", balance: 4500000, accountNumber: "1234567890" },
  { id: "2", name: "GoPay / E-Wallet", type: "E-Wallet", balance: 350000, accountNumber: "08123456789" },
  { id: "3", name: "Dompet Tunai", type: "Cash", balance: 750000, accountNumber: "Uang Fisik" },
];

const swalTheme = () => {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    customClass: { popup: "rounded-3xl" },
  };
};

export default function WalletsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [wallets, setWallets] = useState(() => DEFAULT_WALLETS);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newWallet, setNewWallet] = useState({ name: "", type: "Bank", balance: "", accountNumber: "" });
  const [editWallet, setEditWallet] = useState({ id: "", name: "", type: "Bank", balance: "", accountNumber: "" });

  useEffect(() => {
    const saved = localStorage.getItem("aruskas_wallets");
    if (saved) {
      try {
        setWallets(JSON.parse(saved));
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
    };

    setWallets([...wallets, createdWallet]);
    setNewWallet({ name: "", type: "Bank", balance: "", accountNumber: "" });
    setShowAddModal(false);

    Swal.fire({
      ...swalTheme(),
      title: "Berhasil!",
      text: "Dompet / aset baru berhasil ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
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
            }
          : w
      )
    );

    setShowEditModal(false);

    Swal.fire({
      ...swalTheme(),
      title: "Berhasil!",
      text: "Data dompet / aset berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDeleteWallet = (id) => {
    Swal.fire({
      ...swalTheme(),
      title: "Hapus dompet?",
      text: "Data dompet ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      customClass: {
        popup: "rounded-3xl",
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
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <WalletHeader
        wallets={wallets}
        totalBalance={totalBalance}
        totalWallets={wallets.length}
        onOpenAddModal={() => setShowAddModal(true)}
        getThemeProps={getThemeProps}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={{ ...wallet, theme: getThemeProps(wallet.type) }}
            totalBalance={totalBalance}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteWallet}
          />
        ))}

        {wallets.length === 0 && (
          <div className="glass col-span-full rounded-3xl border-dashed p-10 text-center">
            <p className="text-base font-bold text-main">Belum ada dompet</p>
            <p className="mt-1 text-sm text-subtle">Tambahkan rekening, e-wallet, atau aset pertamamu.</p>
          </div>
        )}
      </div>

      <WalletModal
        isOpen={showAddModal}
        title="Tambah dompet / aset"
        submitLabel="Simpan dompet"
        formData={newWallet}
        setFormData={setNewWallet}
        onSubmit={handleAddWallet}
        onClose={() => setShowAddModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <WalletModal
        isOpen={showEditModal}
        title="Edit dompet / aset"
        submitLabel="Perbarui dompet"
        formData={editWallet}
        setFormData={setEditWallet}
        onSubmit={handleUpdateWallet}
        onClose={() => setShowEditModal(false)}
        formatRupiahInput={formatRupiahInput}
      />
    </div>
  );
}