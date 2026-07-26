"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Wallet, TrendingUp, ShieldCheck, ArrowRight, Instagram, Sparkles, ChevronRight } from "lucide-react";

// Komponen Card dengan Efek 3D Tilt Interaktif
function FeatureCard3D({ icon, title, description, color, badge }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative group rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-200 hover:border-white/20 shadow-2xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
    >
      {/* Glow effect di bawah kartu */}
      <div
        className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${color} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
      />

      <div style={{ transform: "translateZ(40px)" }} className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {badge}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-sm text-slate-400 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-slate-100 overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* 1. TOP MARQUEE BANNER */}
      <div className="relative z-50 mx-auto mt-4 w-[92%] max-w-7xl overflow-hidden rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-indigo-500/10 pointer-events-none" />
        <div className="relative py-2.5">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] text-xs font-medium text-slate-300">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-8 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  Project Developed by
                  <a
                    href="https://instagram.com/wahyu_smprna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1.5 inline-flex items-center gap-1 font-semibold text-cyan-300 transition-all hover:text-white hover:underline"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    @wahyu_smprna
                  </a>
                  • Support project ini di IG ❤️
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ADVANCED 3D GRID & LIGHTING BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Perspective Grid Line Floor */}
        <div 
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)"
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 text-center px-6 max-w-5xl mx-auto flex-grow flex flex-col items-center pt-16 pb-16">
        
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Finansial Management System v2.0
        </motion.div>

        {/* Main Brand Title: ArusKas */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-white mb-2"
        >
          Arus
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            Kas
          </span>
        </motion.h1>

        {/* Tagline / Sub-heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-200 max-w-3xl leading-snug"
        >
          Kelola Finansial Tanpa Rasa Ragu
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-slate-400 max-w-2xl text-base sm:text-lg leading-relaxed font-normal"
        >
          Platform pencatatan arus kas, alokasi tabungan, dan manajemen aset secara <span className="text-slate-200 font-medium">realtime</span>, <span className="text-slate-200 font-medium">aman</span>, dan <span className="text-slate-200 font-medium">terstruktur</span>.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md"
        >
          <button
            onClick={() => router.push("/login")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] cursor-pointer"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-slate-300 font-semibold hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            Daftar Gratis <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </motion.div>

        {/* 4. 3D INTERACTIVE CARDS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full perspective-1000"
        >
          <FeatureCard3D
            icon={<Wallet className="w-6 h-6" />}
            title="Arus Kas Realtime"
            description="Pantau seluruh pengeluaran dan pemasukan harian dengan grafik interaktif dan instan."
            color="from-cyan-500 to-blue-500"
            badge="Catatan Harian"
          />
          <FeatureCard3D
            icon={<TrendingUp className="w-6 h-6" />}
            title="Target Tabungan"
            description="Rencanakan target wishlist & impian finansialmu dengan estimasi waktu otomatis."
            color="from-emerald-500 to-teal-500"
            badge="Wishlist Goal"
          />
          <FeatureCard3D
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Keamanan Terjamin"
            description="Penyimpanan data keuangan berbasis enkripsi tinggi yang aman dan privat."
            color="from-indigo-500 to-purple-500"
            badge="Enkripsi Data"
          />
        </motion.div>
      </main>

      {/* 5. MINIMAL FOOTER */}
      <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="font-mono tracking-widest uppercase">ArusKas App • v2.0</p>
          <p>© 2026 Wahyu Sampurno Adi. All rights reserved.</p>
        </div>
      </footer>

      {/* KEYFRAMES & UTILITIES */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}