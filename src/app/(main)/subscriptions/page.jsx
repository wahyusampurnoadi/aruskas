"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import SubscriptionModal from "@/components/subscriptions/SubscriptionModal";
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  calculateNextDueDate,
} from "@/lib/subscriptions";
import { createTransaction } from "@/lib/transactions";

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: "sub1",
    name: "Netflix Premium 4K",
    type: "expense",
    amount: 186000,
    category: "Hiburan",
    walletName: "BCA Utama",
    frequency: "monthly",
    nextDueDate: "2026-08-15",
    status: "active",
  },
  {
    id: "sub2",
    name: "Wifi Indihome / Biznet",
    type: "expense",
    amount: 385000,
    category: "Tagihan Rumah",
    walletName: "GoPay / E-Wallet",
    frequency: "monthly",
    nextDueDate: "2026-08-10",
    status: "active",
  },
  {
    id: "sub3",
    name: "Gaji Utama Bulanan",
    type: "income",
    amount: 8500000,
    category: "Gaji",
    walletName: "BCA Utama",
    frequency: "monthly",
    nextDueDate: "2026-08-25",
    status: "active",
  },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'active' | 'paused' | 'expense' | 'income'

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    amount: "",
    category: "Langganan",
    walletName: "BCA Utama",
    frequency: "monthly",
    nextDueDate: new Date().toISOString().split("T")[0],
  });

  const [editData, setEditData] = useState({
    id: "",
    name: "",
    type: "expense",
    amount: "",
    category: "Langganan",
    walletName: "BCA Utama",
    frequency: "monthly",
    nextDueDate: "",
  });

  const formatRupiahInput = (value) => {
    if (!value && value !== 0) return "";
    const cleanNumber = value.toString().replace(/\D/g, "");
    if (!cleanNumber) return "";
    return parseInt(cleanNumber, 10).toLocaleString("id-ID");
  };

  const parseRupiahInput = (formattedValue) => {
    if (!formattedValue && formattedValue !== 0) return 0;
    const cleanNumber = formattedValue.toString().replace(/\D/g, "");
    return cleanNumber ? parseInt(cleanNumber, 10) : 0;
  };

  // Load subscriptions
  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const firestoreSubs = await getAllSubscriptions(user.uid);
          if (firestoreSubs && firestoreSubs.length > 0) {
            setSubscriptions(firestoreSubs);
          } else {
            const saved = localStorage.getItem("aruskas_subscriptions");
            setSubscriptions(saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTIONS);
          }
        } catch (e) {
          console.error("Error loading subscriptions:", e);
          const saved = localStorage.getItem("aruskas_subscriptions");
          setSubscriptions(saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTIONS);
        }
      } else {
        const saved = localStorage.getItem("aruskas_subscriptions");
        setSubscriptions(saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTIONS);
      }
      setIsHydrated(true);
    }

    loadData();
  }, [user]);

  // LocalStorage sync
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("aruskas_subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions, isHydrated]);

  // Handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const amountNum = parseRupiahInput(formData.amount);
    const payload = {
      name: formData.name,
      type: formData.type,
      amount: amountNum,
      category: formData.category,
      walletName: formData.walletName,
      frequency: formData.frequency,
      nextDueDate: formData.nextDueDate,
      status: "active",
    };

    if (user?.uid) {
      try {
        const id = await createSubscription(user.uid, payload);
        setSubscriptions([{ id, ...payload }, ...subscriptions]);
      } catch (err) {
        console.error(err);
        setSubscriptions([{ id: Date.now().toString(), ...payload }, ...subscriptions]);
      }
    } else {
      setSubscriptions([{ id: Date.now().toString(), ...payload }, ...subscriptions]);
    }

    setFormData({
      name: "",
      type: "expense",
      amount: "",
      category: "Langganan",
      walletName: "BCA Utama",
      frequency: "monthly",
      nextDueDate: new Date().toISOString().split("T")[0],
    });
    setShowAddModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Langganan baru berhasil ditambahkan.",
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

  const handleOpenEdit = (item) => {
    setEditData({
      id: item.id,
      name: item.name,
      type: item.type,
      amount: formatRupiahInput(item.amount),
      category: item.category,
      walletName: item.walletName,
      frequency: item.frequency,
      nextDueDate: item.nextDueDate,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseRupiahInput(editData.amount);

    const payload = {
      name: editData.name,
      type: editData.type,
      amount: amountNum,
      category: editData.category,
      walletName: editData.walletName,
      frequency: editData.frequency,
      nextDueDate: editData.nextDueDate,
    };

    if (user?.uid) {
      try {
        await updateSubscription(user.uid, editData.id, payload);
      } catch (e) {
        console.error(e);
      }
    }

    setSubscriptions(
      subscriptions.map((s) => (s.id === editData.id ? { ...s, ...payload } : s))
    );
    setShowEditModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Data langganan berhasil diperbarui.",
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

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "active" ? "paused" : "active";

    if (user?.uid) {
      try {
        await updateSubscription(user.uid, item.id, { ...item, status: newStatus });
      } catch (e) {
        console.error(e);
      }
    }

    setSubscriptions(
      subscriptions.map((s) => (s.id === item.id ? { ...s, status: newStatus } : s))
    );
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Langganan?",
      text: "Data langganan berulang ini akan dihapus.",
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user?.uid) {
          try {
            await deleteSubscription(user.uid, id);
          } catch (e) {
            console.error(e);
          }
        }
        setSubscriptions(subscriptions.filter((s) => s.id !== id));
      }
    });
  };

  const handlePayNow = async (item) => {
    const isExpense = item.type === "expense";
    const actionLabel = isExpense ? "Pembayaran" : "Pencatatan Pemasukan";
    const formattedAmount = `Rp ${Number(item.amount || 0).toLocaleString("id-ID")}`;

    Swal.fire({
      title: `${actionLabel} ${item.name}?`,
      html: `Transaksi sebesar <strong class="text-violet-400 font-bold">${formattedAmount}</strong> akan dicatat ke dompet <strong class="text-cyan-400">${item.walletName || "BCA Utama"}</strong> dan tanggal jatuh tempo berikutnya akan diatur otomatis.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Catat Sekarang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#1e293b",
      background: "#0b1329",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
        title: "text-white font-bold",
        htmlContainer: "text-slate-300 text-sm",
        confirmButton: "rounded-xl font-bold px-5 py-2.5",
        cancelButton: "rounded-xl font-bold px-5 py-2.5",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nextDate = calculateNextDueDate(item.nextDueDate, item.frequency);

        // 1. Record kas transaction
        if (user?.uid) {
          try {
            await createTransaction(user.uid, {
              title: `[Rutin] ${item.name}`,
              amount: Number(item.amount) || 0,
              type: item.type || "expense",
              category: item.category || "Langganan",
              walletName: item.walletName || "BCA Utama",
              transactionDate: new Date(),
              notes: `Pembayaran otomatis transaksi berulang: ${item.name}`,
            });
          } catch (e) {
            console.error("Gagal mencatat transaksi kas:", e);
          }
        }

        // 2. Update next due date in subscription
        if (user?.uid) {
          try {
            await updateSubscription(user.uid, item.id, { ...item, nextDueDate: nextDate });
          } catch (e) {
            console.error(e);
          }
        }

        setSubscriptions(
          subscriptions.map((s) => (s.id === item.id ? { ...s, nextDueDate: nextDate } : s))
        );

        Swal.fire({
          title: "Transaksi Dicatat!",
          text: `${item.name} sebesar ${formattedAmount} berhasil dicatat. Jatuh tempo berikutnya: ${nextDate}.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#0b1329",
          color: "#ffffff",
          customClass: {
            popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
          },
        });
      }
    });
  };

  // Calculations
  const monthlyTotal = subscriptions
    .filter((s) => s.type === "expense" && s.status === "active")
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;

  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const dueSoonCount = subscriptions.filter((s) => {
    if (s.status !== "active" || !s.nextDueDate) return false;
    const dueDate = new Date(s.nextDueDate);
    return dueDate >= today && dueDate <= next7Days;
  }).length;

  // Filtered List
  const filteredSubscriptions = subscriptions.filter((item) => {
    if (filterTab === "active") return item.status === "active";
    if (filterTab === "paused") return item.status === "paused";
    if (filterTab === "expense") return item.type === "expense";
    if (filterTab === "income") return item.type === "income";
    return true;
  });

  if (!isHydrated) return null;

  return (
    <div className="w-full space-y-8">
      <SubscriptionHeader
        monthlyTotal={monthlyTotal}
        activeCount={activeCount}
        dueSoonCount={dueSoonCount}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "all", label: "Semua Langganan" },
          { key: "active", label: "Aktif" },
          { key: "paused", label: "Dijeda" },
          { key: "expense", label: "Pengeluaran Rutin" },
          { key: "income", label: "Pemasukan Rutin" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterTab === tab.key
                ? "bg-violet-500/20 border border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                : "bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              item={sub}
              onPayNow={handlePayNow}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl">
          <p className="text-sm text-slate-400 font-medium">
            Belum ada data langganan dalam kategori ini.
          </p>
        </div>
      )}

      {/* Modals */}
      <SubscriptionModal
        isOpen={showAddModal}
        title="Tambah Langganan Baru"
        submitLabel="Simpan Langganan"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <SubscriptionModal
        isOpen={showEditModal}
        title="Edit Data Langganan"
        submitLabel="Perbarui Data"
        formData={editData}
        setFormData={setEditData}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
        formatRupiahInput={formatRupiahInput}
      />
    </div>
  );
}
