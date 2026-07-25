"use client";

import { useState } from "react";

// Perbaiki path import komponen ke @/components/wishlist/
import SavingGoalStats from "@/components/wishlist/SavingGoalStats";
import SavingGoalChart from "@/components/wishlist/SavingGoalChart";
import SavingGoalList from "@/components/wishlist/SavingGoalList";
import AddGoalModal from "@/components/wishlist/AddGoalModal";
import DepositModal from "@/components/wishlist/DepositModal";
import EditGoalModal from "@/components/wishlist/EditGoalModal";
import DeleteGoalModal from "@/components/wishlist/DeleteGoalModal"; // Import dari folder components
import SavingGoalSummary from "@/components/wishlist/SavingGoalSummary";
import useSavingGoals from "@/app/hooks/useSavingGoals";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

export default function WishlistPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState(null);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState(null);
  const [selectedGoalToDelete, setSelectedGoalToDelete] = useState(null); // State Modal Hapus

  const {
    goals = [],
    loading,
    addGoal,
    deleteGoal,
    updateGoal,
    depositGoal,
  } = useSavingGoals();

  if (loading) {
    return <LoadingScreen />;
  }

  const totalTarget = goals.reduce(
    (sum, goal) => sum + (Number(goal.target) || 0),
    0
  );

  const handleAddGoal = async (newGoal) => {
    await addGoal(newGoal);
  };

  // Handler Buka Modal Hapus
  const handleOpenDeleteModal = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) setSelectedGoalToDelete(goal);
  };

  const handleConfirmDelete = async (id) => {
    await deleteGoal(id);
    setSelectedGoalToDelete(null);
  };

  const handleOpenDepositModal = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) setSelectedGoalForDeposit(goal);
  };

  const handleConfirmDeposit = async (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    await depositGoal(id, amount, Number(goal.current) || 0);
    setSelectedGoalForDeposit(null);
  };

  const handleOpenEditModal = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) setSelectedGoalForEdit(goal);
  };

  const handleConfirmEdit = async (id, updatedData) => {
    await updateGoal(id, updatedData);
    setSelectedGoalForEdit(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 p-3 sm:p-6">
      
      {/* HERO BANNER GLASSMORPHISM */}
      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-cyan-500/30 hover:shadow-cyan-500/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl transition-all duration-700 group-hover:bg-cyan-500/20 group-hover:scale-110 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl transition-all duration-700 group-hover:bg-blue-600/20 group-hover:scale-110 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wide backdrop-blur-md">
              <span className="animate-pulse">🎯</span> FINANCIAL GOALS
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Target Wishlist
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Kelola tujuan keuangan dan pantau perkembangan seluruh tabungan impianmu secara terukur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Total Alokasi Target
              </p>
              <div className="flex items-baseline gap-1.5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-black">
                <span className="text-xl sm:text-2xl font-bold">Rp</span>
                <span className="text-3xl sm:text-4xl tracking-tight">
                  {totalTarget.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpenAddModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span className="text-lg leading-none">+</span> Tambah Target
            </button>
          </div>
        </div>
      </div>

      <SavingGoalStats goals={goals} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <SavingGoalChart goals={goals} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <SavingGoalSummary goals={goals} />
        </div>
      </div>

      <SavingGoalList
        goals={goals}
        onDeposit={handleOpenDepositModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <AddGoalModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddGoal}
      />

      <DepositModal
        open={Boolean(selectedGoalForDeposit)}
        goal={selectedGoalForDeposit}
        onClose={() => setSelectedGoalForDeposit(null)}
        onConfirm={handleConfirmDeposit}
      />

      <EditGoalModal
        open={Boolean(selectedGoalForEdit)}
        goal={selectedGoalForEdit}
        onClose={() => setSelectedGoalForEdit(null)}
        onUpdate={handleConfirmEdit}
      />

      {/* MODAL HAPUS KUSTOM */}
      <DeleteGoalModal
        open={Boolean(selectedGoalToDelete)}
        goal={selectedGoalToDelete}
        onClose={() => setSelectedGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}