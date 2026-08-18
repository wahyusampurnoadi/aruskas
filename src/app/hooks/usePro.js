"use client";

import { useAuth } from "@/context/AuthContext";

export function usePro() {
  const { userData, loading } = useAuth();

  // Memastikan status boolean isPro
  const isPro = Boolean(userData?.isPro);

  return {
    isPro,
    isLoading: loading,
    userData,
  };
}