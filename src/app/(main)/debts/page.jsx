"use client";

import { useState, useEffect } from "react";
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

export default function DebtsPage() {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [debts, setDebts] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'piutang' | 'hutang' | 'unpaid' | 'paid'

  // Modals state
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

  // Load debts from Firestore or localStorage
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

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("aruskas_debts", JSON.stringify(debts));
    }
  }, [debts, isHydrated]);

  // Handlers
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
      title: "Berhasil!",
      text: "Catatan hutang/piutang berhasil ditambahkan.",
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

    setDebts(
      debts.map((d) => (d.id === editData.id ? { ...d, ...payload } : d))
    );
    setShowEditModal(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Data hutang/piutang berhasil diperbarui.",
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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Catatan?",
      text: "Data hutang/piutang ini akan dihapus permanen.",
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
    const newStatus =
      newPaidAmount >= totalAmount ? "paid" : "partially_paid";

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

    setDebts(
      debts.map((d) => (d.id === debtId ? { ...d, ...updatePayload } : d))
    );

    // Optionally record kas transaction
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
      title: "Pembayaran Dicatat!",
      text: `Pembayaran sebesar Rp ${amountPaid.toLocaleString("id-ID")} berhasil disimpan.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: "#0b1329",
      color: "#ffffff",
      customClass: {
        popup: "rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl",
      },
    });
  };

  // Calculations
  const totalPiutang = debts
    .filter((d) => d.type === "piutang")
    .reduce((sum, d) => sum + Math.max(0, (Number(d.amount) || 0) - (Number(d.paidAmount) || 0)), 0);

  const totalHutang = debts
    .filter((d) => d.type === "hutang")
    .reduce((sum, d) => sum + Math.max(0, (Number(d.amount) || 0) - (Number(d.paidAmount) || 0)), 0);

  // Filtered List
  const filteredDebts = debts.filter((item) => {
    const total = Number(item.amount) || 0;
    const paid = Number(item.paidAmount) || 0;
    const isPaidOff = paid >= total;

    if (filterTab === "piutang") return item.type === "piutang";
    if (filterTab === "hutang") return item.type === "hutang";
    if (filterTab === "unpaid") return !isPaidOff;
    if (filterTab === "paid") return isPaidOff;
    return true;
  });

  if (!isHydrated) return null;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <DebtHeader
        totalPiutang={totalPiutang}
        totalHutang={totalHutang}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "all", label: "Semua Catatan" },
          { key: "piutang", label: "Piutang Saya" },
          { key: "hutang", label: "Hutang Saya" },
          { key: "unpaid", label: "Belum Lunas" },
          { key: "paid", label: "Lunas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterTab === tab.key
                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredDebts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl">
          <p className="text-sm text-slate-400 font-medium">
            Tidak ada catatan hutang/piutang dalam kategori ini.
          </p>
        </div>
      )}

      {/* Modals */}
      <DebtModal
        isOpen={showAddModal}
        title="Tambah Catatan Hutang / Piutang"
        submitLabel="Simpan Catatan"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
        formatRupiahInput={formatRupiahInput}
      />

      <DebtModal
        isOpen={showEditModal}
        title="Edit Data Hutang / Piutang"
        submitLabel="Perbarui Catatan"
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
