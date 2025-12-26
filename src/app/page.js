"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] overflow-hidden selection:bg-blue-500/30">
      
      {/* 1. ADVANCED ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Dasar */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Garis Laser Horizontal Berjalan */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-slow opacity-20" />
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-fast opacity-20" />
        </div>

        {/* Garis Laser Vertikal Berjalan */}
        <div className="absolute inset-0 flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative w-[1px] h-full bg-white/5">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-fall shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                   style={{ animationDelay: `${i * 1.5}s` }} />
            </div>
          ))}
        </div>

        {/* Cahaya Latar Belakang */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 text-center px-6 max-w-4xl mx-auto flex-grow flex flex-col items-center pt-28 pb-12">
        
        {/* Badge Intro */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase"
        >
          TOP SYSTEM FINANCIAL
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter"
        >
          Arus<span className="relative inline-block text-blue-500">
            Kas
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 animate-pulse" />
          </span>
        </motion.h1>

        <motion.p className="mt-8 text-gray-400 max-w-md text-sm md:text-base leading-relaxed tracking-widest opacity-80">
          Platform pencatatan finansial dan aset untukmu<br />
          <span className="text-white">AMAN • REALTIME • ELEGAN</span>
        </motion.p>

        {/* 3. Buttons with Moving Border Effect */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
          <div className="group relative p-[2px] rounded-2xl overflow-hidden bg-white/10">
            {/* Lampu border berputar */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-transparent to-cyan-400 animate-spin-slow group-hover:animate-spin-fast" style={{ margin: '-100%' }} />
            <button
              onClick={() => router.push("/login")}
              className="relative px-12 py-4 rounded-2xl bg-[#030712] text-white font-bold flex items-center gap-2 hover:bg-transparent transition-all cursor-pointer"
            >
              MULAI SEKARANG <ArrowRight size={18} />
            </button>
          </div>

          <button
            onClick={() => router.push("/register")}
            className="px-12 py-4 rounded-2xl border border-gray-800 text-gray-400 font-bold hover:text-white hover:border-white transition-all tracking-widest text-sm cursor-pointer"
          >
            DAFTAR GRATIS
          </button>
        </div>

        {/* 4. Feature Cards with Infinite Glow Trace */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {[
            { icon: <Wallet size={24} />, title: "Dompet", color: "from-blue-500" },
            { icon: <TrendingUp size={24} />, title: "Berkembang", color: "from-emerald-500" },
            { icon: <ShieldCheck size={24} />, title: "Aman", color: "from-purple-500" },
          ].map((item, i) => (
            <div key={i} className="relative group p-[1px] rounded-2xl overflow-hidden">
              {/* Garis lampu berjalan di pinggir kartu */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} to-transparent animate-shimmer`} style={{ width: '200%' }} />
              
              <div className="relative p-8 rounded-2xl bg-[#030712]/90 backdrop-blur-xl flex flex-col items-center">
                <div className="mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-white text-xs font-black tracking-[0.2em] uppercase">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Minimal Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 opacity-40">
          <p className="text-white text-[9px] tracking-[0.4em] uppercase">Update v2.0</p>
          <p className="text-white text-[9px] tracking-[0.2em] uppercase">© 2025 Wahyu Sampurno Adi</p>
        </div>
      </footer>

      {/* KEYFRAMES ANIMATION */}
      <style jsx global>{`
        @keyframes scan-slow {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 0.2; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes scan-fast {
          0% { transform: translateY(100vh); opacity: 0; }
          50% { opacity: 0.2; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes fall {
          0% { transform: translateY(-20%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-scan-slow { animation: scan-slow 12s linear infinite; }
        .animate-scan-fast { animation: scan-fast 8s linear infinite; }
        .animate-fall { animation: fall 4s linear infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
        .animate-spin-fast { animation: spin-slow 2s linear infinite; }
      `}</style>
    </div>
  );
}