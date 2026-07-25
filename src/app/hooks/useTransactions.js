"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTransactionsByDateRange,
  getAllTransactions,
} from "@/lib/transactions";

/**
 * Hook transaksi dashboard:
 * - filter bulanan / custom range
 * - fetch transaksi hanya untuk periode aktif
 * - hitung income / expense / balance
 */
export default function useTransactions(user) {
  const now = new Date();

  const [filterMode, setFilterMode] = useState("monthly");

  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState("");

  /**
   * Tentukan range aktif berdasarkan mode filter
   */
  const activeRange = useMemo(() => {
    // mode custom
    if (filterMode === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    }

    // mode bulanan
    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return { start, end };
  }, [filterMode, month, year, startDate, endDate]);

  const fetchTransactions = useCallback(async () => {
    if (!user?.uid) {
      setTransactions([]);
      setLoadingTransactions(false);
      return;
    }

    try {
      setLoadingTransactions(true);
      setErrorTransactions("");

      const [filteredData, allData] = await Promise.all([
  getTransactionsByDateRange(
    user.uid,
    activeRange.start,
    activeRange.end
  ),
  getAllTransactions(user.uid),
]);

setTransactions(filteredData);
setAllTransactions(allData);
    } catch (error) {
      console.error("Fetch transactions error:", error);
      setErrorTransactions("Gagal mengambil data transaksi.");
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  }, [user?.uid, activeRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const income = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const expense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
  return allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}, [allTransactions]);

const totalExpense = useMemo(() => {
  return allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}, [allTransactions]);

const totalBalance = totalIncome - totalExpense;

  const balance = income - expense;

  const resetToMonthly = () => {
    setFilterMode("monthly");
    setStartDate("");
    setEndDate("");
  };

  const applyCustomRange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setFilterMode("custom");
  };

  return {
    transactions,
    loadingTransactions,
    errorTransactions,

    filterMode,
    setFilterMode,

    month,
    setMonth,
    year,
    setYear,

    startDate,
    setStartDate,
    endDate,
    setEndDate,

    activeRange,
    applyCustomRange,
    resetToMonthly,

    income,
    expense,
    balance,

    totalIncome,
totalExpense,
totalBalance,

    refreshTransactions: fetchTransactions,
  };
}