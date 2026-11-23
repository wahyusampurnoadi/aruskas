"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/dashboard/Sidebar";

const LOADING_STATES = [
  "Menghubungkan ke ArusKas...",
  "Memverifikasi sesi pengguna...",
  "Menyiapkan data keuangan...",
];

// Durasi minimum tampilan preloading (ms)
const MINIMUM_LOADING_TIME = 1800;

export default function MainLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isRedirecting = useRef(false);

  const [statusIndex, setStatusIndex] = useState(0);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  // Pastikan preloading tampil minimal durasi tertentu
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingDone(true), MINIMUM_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Proteksi route: alihkan ke /login jika tidak ada user
  useEffect(() => {
    if (!authLoading && !user && !isRedirecting.current) {
      isRedirecting.current = true;
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Rotasi teks status preloading
  useEffect(() => {
    if (authLoading || !minLoadingDone) {
      const interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % LOADING_STATES.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [authLoading, minLoadingDone]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isPreloadingActive = authLoading || !minLoadingDone;

  if (isPreloadingActive) {
    return (
      <div className="relative flex min-h-dvh select-none flex-col items-center justify-center overflow-hidden px-6">
        <div aria-hidden className="animate-float-a pointer-events-none absolute h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
        <div aria-hidden className="animate-float-b pointer-events-none absolute h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute h-20 w-20 rounded-3xl border border-cyan-500/40"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute h-20 w-20 rounded-3xl border border-blue-500/30"
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            />

            <motion.div
              className="glass-strong relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-tr from-cyan-500 via-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/30"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="h-9 w-9 text-on-accent drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-black tracking-wider text-main">
              Arus<span className="text-accent">Kas</span>
            </h1>

            <div className="relative flex h-6 items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-medium tracking-wide text-muted"
                >
                  {LOADING_STATES[statusIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh">
      {/* Midtrans Snap SDK */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <Sidebar user={user} onLogout={logout} />

      <div className="relative min-h-dvh lg:ml-[280px]">
        {/* Pola grid latar */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_80%)]"
        />

        <main className="relative z-10 w-full p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}