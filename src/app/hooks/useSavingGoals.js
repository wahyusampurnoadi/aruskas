"use client";

import { useState, useEffect } from "react";

export default function useSavingGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulasi/Fetch data awal dari database/localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("saving_goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    } else {
      // Data default jika kosong
      setGoals([
        {
          id: "1",
          name: "Motor Vario 160",
          target: 31500000,
          current: 0,
        },
      ]);
    }
    setLoading(false);
  }, []);

  // Simpan ke localStorage / database setiap kali state goals berubah
  const saveAndSetGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem("saving_goals", JSON.stringify(newGoals));
  };

  // 1. TAMBAH TARGET
  const addGoal = async (newGoal) => {
    const createdGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: Number(newGoal.target) || 0,
      current: Number(newGoal.current) || 0,
    };
    const updated = [...goals, createdGoal];
    saveAndSetGoals(updated);
  };

  // 2. SETOR TABUNGAN (DENGAN UPDATE STATE LOKAL SECARA INSTAN)
  const depositGoal = async (id, amount, currentAmount) => {
    const addAmount = Number(amount) || 0;
    if (addAmount <= 0) return;

    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const newCurrent = (Number(goal.current) || 0) + addAmount;
        return { ...goal, current: newCurrent };
      }
      return goal;
    });

    saveAndSetGoals(updatedGoals);
  };

  // 3. EDIT TARGET
  const updateGoal = async (id, updatedData) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, ...updatedData } : goal
    );
    saveAndSetGoals(updatedGoals);
  };

  // 4. HAPUS TARGET
  const deleteGoal = async (id) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    saveAndSetGoals(updatedGoals);
  };

  return {
    goals,
    loading,
    addGoal,
    depositGoal,
    updateGoal,
    deleteGoal,
  };
}