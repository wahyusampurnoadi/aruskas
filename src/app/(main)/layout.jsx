"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STATES = [
  "Menghubungkan ke ArusKas...",
  "Memverifikasi sesi pengguna...",
  "Menyiapkan data keuangan..."
];

// Atur durasi minimum tampilan preloading (dalam milidetik)
const MINIMUM_LOADING_TIME = 1800; 

export default function MainLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isRedirecting = useRef(false);
  
  const [statusIndex, setStatusIndex] = useState(0);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  // Timer untuk memastikan preloading tampil minimal durasi tertentu
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, MINIMUM_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  // Proteksi Route: Alihkan ke /login jika auth selesai & user tidak ada
  useEffect(() => {
    if (!authLoading && !user && !isRedirecting.current) {
      isRedirecting.current = true;
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Rotasi Teks Status Preloading
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

  // Preloading tetap aktif hingga Firebase Auth selesai DAN timer minimum terpenuhi
  const isPreloadingActive = authLoading || !minLoadingDone;

  if (isPreloadingActive) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden select-none">
        {/* Soft Ambient Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          
          {/* Central Logo dengan Pulsing Ripple Effect */}
          <div className="relative flex items-center justify-center">
            {/* Gelombang Arus 1 */}
            <motion.div
              className="absolute w-16 h-16 rounded-3xl border border-cyan-500/40"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Gelombang Arus 2 */}
            <motion.div
              className="absolute w-16 h-16 rounded-3xl border border-blue-500/30"
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Core Logo Container */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/25 border border-white/20"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                className="w-8 h-8 text-white drop-shadow-md" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          </div>

          {/* Brand Name & Dynamic Changing Status */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-black tracking-wider text-white">
              Arus<span className="text-cyan-400">Kas</span>
            </h1>

            <div className="h-6 overflow-hidden relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-medium text-slate-400 tracking-wide"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Midtrans Snap SDK */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <Sidebar user={user} onLogout={logout} />

      <div className="relative lg:ml-[280px] min-h-screen">
        {/* Background Grid Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}