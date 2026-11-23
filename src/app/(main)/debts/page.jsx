"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import DebtHeader from "@/components/debts/DebtHeader";
import DebtCard from "@/components/debts/DebtCard";
import DebtModal from "@/components/debts/DebtModal";
import DebtPaymentModal from "@/components/debts/DebtPaymentModal";
import {
  getAllDebts,
  createDebt,
  updateDebt,
  deleteDebt,
} from "@/lib/debts";
import { createTransaction } from "@/lib/transactions";

const DEFAULT_DEBTS = [
  {
    id: "d1",
    type: "piutang",
    personName: "Budi Santoso",
    amount: 350000,
    paidAmount: 100000,
    dueDate: "2026-08-15",
    notes: "Pinjam uang kas untuk beli perlengkapan event",
    status: "partially_paid",
  },
  {
    id: "d2",
    type: "hutang",
    personName: "Toko Komputer Jaya",
    amount: 1200000,
    paidAmount: 600000,
    dueDate: "2026-08-20",
    notes: "Cicilan ke-2 pembelian RAM & SSD",
    status: "partially_paid",
  },
];

const FILTERS = [
  { key: "all", label: "Semua catatan" },
  { key: "piutang", label: "Piutang saya" },
  { key: "hutang", label: "Hutang saya" },
  { key: "unpaid", label: "Belum lunas" },
  { key: "paid", label: "Lunas" },
];

const swalTheme = () => {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#f1f5f9" : "#0f172a",
    customClass: { popup: "rounded-3xl" },
  };
};

export default function DebtsPage() {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [debts, setDebts] = useState([]);
  const [filterTab, setFilterTab] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const [selectedDebt, setSelectedDebt] = useState(null);

  const [formData, setFormData] = useState({
    type: "piutang",
    personName: "",
    amount: "",
    paidAmount: "",
    dueDate: "",
    notes: "",
  });

  const [editData, setEditData] = useState({
    id: "",
    type: "piutang",
    personName: "",
    amount: "",
    paidAmount: "",
    dueDate: "",
    notes: "",
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

  // Muat dari Firestore atau localStorage
  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const firestoreDebts = await getAllDebts(user.uid);
          if (firestoreDebts && firestoreDebts.length > 0) {
            setDebts(firestoreDebts);
          } else {
            const saved = localStorage.getItem("aruskas_debts");
            setDebts(saved ? JSON.parse(saved) : DEFAULT_DEBTS);
          }
        } catch (e) {
          console.error("Error loading debts:", e);
          const saved = localStorage.getItem("aruskas_debts");
          setDebts(saved ? JSON.parse(saved) : DEFAULT_DEBTS);
        }
      } else {
        const saved = localStorage.getItem("aruskas_debts");
        setDebts(saved ? JSON.parse(saved) : DEFAULT_DEBTS);
      }
      setIsHydrated(true);
    }

    loadData();
  }, [user]);

  // Sinkron ke localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("aruskas_debts", JSON.stringify(debts));
    }
  }, [debts, isHydrated]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.personName || !formData.amount) return;

    const amountNum = parseRupiahInput(formData.amount);
    const paidNum = parseRupiahInput(formData.paidAmount);

    const payload = {
      type: formData.type,
      personName: formData.personName,
      amount: amountNum,
      paidAmount: paidNum,
      dueDate: formData.dueDate,
      notes: formData.notes,
    };

    if (user?.uid) {
      try {
        const id = await createDebt(user.uid, payload);
        setDebts([{ id, ...payload }, ...debts]);
      } catch (err) {
        console.error("Gagal menyimpan ke Firestore:", err);
        const newLocal = { id: Date.now().toString(), ...payload };
        setDebts([newLocal, ...debts]);
      }
    } else {
      const newLocal = { id: Date.now().toString(), ...payload };
      setDebts([newLocal, ...debts]);
    }

    setFormData({
      type: "piutang",
      personName: "",
      amount: "",
      paidAmount: "",
      dueDate: "",
      notes: "",
    });
    setShowAddModal(false);

    Swal.fire({
      ...swalTheme(),
      title: "Berhasil!",
      text: "Catatan hutang/piutang berhasil ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleOpenEdit = (item) => {
    setEditData({
      id: item.id,
      type: item.type,
      personName: item.personName,
      amount: formatRupiahInput(item.amount),
      paidAmount: formatRupiahInput(item.paidAmount),
      dueDate: item.dueDate || "",
      notes: item.notes || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseRupiahInput(editData.amount);
    const paidNum = parseRupiahInput(editData.paidAmount);

    const payload = {
      type: editData.type,
      personName: editData.personName,
      amount: amountNum,
      paidAmount: paidNum,
      dueDate: editData.dueDate,
      notes: editData.notes,
    };

    if (user?.uid) {
      try {
        await updateDebt(user.uid, editData.id, payload);
      } catch (err) {
        console.error("Gagal update Firestore:", err);
      }
    }

    setDebts(debts.map((d) => (d.id === editData.id ? { ...d, ...payload } : d)));
    setShowEditModal(false);

    Swal.fire({
      ...swalTheme(),
      title: "Berhasil!",
      text: "Data hutang/piutang berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      ...swalTheme(),
      title: "Hapus catatan?",
      text: "Data hutang/piutang ini akan dihapus permanen.",
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user?.uid) {
          try {
            await deleteDebt(user.uid, id);
          } catch (e) {
            console.error(e);
          }
        }
        setDebts(debts.filter((d) => d.id !== id));
      }
    });
  };

  const handleOpenPay = (item) => {
    setSelectedDebt(item);
    setShowPayModal(true);
  };

  const handleConfirmPayment = async ({
    debtId,
    amountPaid,
    recordTransaction,
    walletName,
    debtItem,
  }) => {
    const newPaidAmount = (Number(debtItem.paidAmount) || 0) + amountPaid;
    const totalAmount = Number(debtItem.amount) || 0;
    const newStatus = newPaidAmount >= totalAmount ? "paid" : "partially_paid";

    const updatePayload = {
      ...debtItem,
      paidAmount: newPaidAmount,
      status: newStatus,
    };

    if (user?.uid) {
      try {
        await updateDebt(user.uid, debtId, updatePayload);
      } catch (err) {
        console.error(err);
      }
    }

    setDebts(debts.map((d) => (d.id === debtId ? { ...d, ...updatePayload } : d)));

    // Opsional: catat juga ke transaksi kas
    if (recordTransaction && user?.uid) {
      try {
        const isPiutang = debtItem.type === "piutang";
        await createTransaction(user.uid, {
          title: `${isPiutang ? "Pembayaran Piutang" : "Pelunasan Hutang"}: ${debtItem.personName}`,
          amount: amountPaid,
          type: isPiutang ? "income" : "expense",
          category: isPiutang ? "Piutang" : "Hutang",
          walletName: walletName || "BCA Utama",
          transactionDate: new Date(),
          notes: `Pembayaran untuk ${debtItem.personName}`,
        });
      } catch (e) {
        console.error("Error creating kas transaction:", e);
      }
    }

    setShowPayModal(false);
    setSelectedDebt(null);

    Swal.fire({
      ...swalTheme(),
      title: "Pembayaran dicatat!",
      text: `Pembayaran sebesar Rp ${amountPaid.toLocaleString("id-ID")} berhasil disimpan.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const totalPiutang = debts
    .filter((d) => d.type === "piutang")
    .reduce((sum, d) => sum + Math.max(0, (Number(d.amount) || 0) - (Number(d.paidAmount) || 0)), 0);

  const totalHutang = debts
    .filter((d) => d.type === "hutang")
    .reduce((sum, d) => sum + Math.max(0, (Number(d.amount) || 0) - (Number(d.paidAmount) || 0)), 0);

  const isPaidOffItem = (item) => (Number(item.paidAmount) || 0) >= (Number(item.amount) || 0);

  // Jumlah per filter (untuk badge di pill)
  const counts = useMemo(
    () => ({
      all: debts.length,
      piutang: debts.filter((d) => d.type === "piutang").length,
      hutang: debts.filter((d) => d.type === "hutang").length,
      unpaid: debts.filter((d) => !isPaidOffItem(d)).length,
      paid: debts.filter((d) => isPaidOffItem(d)).length,
    }),
    [debts]
  );

  const filteredDebts = debts.filter((item) => {
    if (filterTab === "piutang") return item.type === "piutang";
    if (filterTab === "hutang") return item.type === "hutang";
    if (filterTab === "unpaid") return !isPaidOffItem(item);
    if (filterTab === "paid") return isPaidOffItem(item);
    return true;
  });

  if (!isHydrated) return null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <DebtHeader
        totalPiutang={totalPiutang}
        totalHutang={totalHutang}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Filter pill */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((tab) => {
          const active = filterTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                active ? "btn-primary" : "tile text-muted hover:text-main"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-[var(--glass-hover)] text-subtle"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Daftar kartu: tinggi seragam */}
      {filteredDebts.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDebts.map((debt) => (
            <DebtCard
              key={debt.id}
              item={debt}
              onPay={handleOpenPay}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center gap-2 rounded-[28px] border-dashed p-12 text-center">
          <p className="text-base font-bold text-main">Belum ada catatan</p>
          <p className="text-sm text-subtle">Tidak ada catatan hutang atau piutang pada kategori ini.</p>
        </div>
      )}

      <DebtModal
        isOpen={showAddModal}
        title="Tambah catatan hutang / piutang"
        submitLabel="Simpan catatan"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <DebtModal
        isOpen={showEditModal}
        title="Edit data hutang / piutang"
        submitLabel="Perbarui catatan"
        formData={editData}
        setFormData={setEditData}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <DebtPaymentModal
        isOpen={showPayModal}
        debtItem={selectedDebt}
        onConfirmPayment={handleConfirmPayment}
        onClose={() => setShowPayModal(false)}
        formatRupiahInput={formatRupiahInput}
        parseRupiahInput={parseRupiahInput}
      />
    </div>
  );
}