"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Diimpor jika ingin menggunakan logo file gambar (e.g. /logo.png)
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, ArrowLeft, TrendingUp, ShieldCheck, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || password.length < 6) {
      alert("Email wajib diisi & password minimal 6 karakter");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      alert("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Silakan masukkan email Anda di kolom input terlebih dahulu");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert(`Permintaan reset berhasil!\n\nInstruksi dikirim ke: ${email}`);
    } catch (error) {
      alert("Gagal mengirim email reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#030712] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* ================= SISI KIRI: GRID SEMU & HERO CONTENT (7 COL) ================= */}
      <div className="hidden lg:flex lg:col-span-7 relative p-8 xl:p-12 flex-col justify-between border-r border-white/5 bg-slate-950/90 overflow-hidden">
        
        {/* Pattern Grid Kotak-Kotak Semu */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)"
          }}
        />

        {/* Ambient Glow Sisi Kiri */}
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

        {/* Brand Header / Logo */}
        <div className="relative z-10 flex items-center gap-3">
          
          <Image 
            src="/logo-aruskas.png" 
            alt="Logo ArusKas" 
            width={36} 
            height={36} 
            className="w-9 h-9 object-contain"
          /> 
         

          <span className="text-xl font-extrabold tracking-tight text-white">
            Arus<span className="text-cyan-400">Kas</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Sistem Keuangan Terenkripsi</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
            Kelola Finansial Lebih Cerdas & Terstruktur.
          </h2>

          <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
            Pantau arus kas harian, alokasi tabungan wishlist, dan analisis pengeluaran dalam satu platform yang aman.
          </p>

          <div className="space-y-2.5 pt-1">
            {[
              "Pencatatan Pemasukan & Pengeluaran Realtime",
              "Visualisasi Grafik Finansial Interaktif",
              "Akses Cepat & Proteksi Data Tingkat Tinggi"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs xl:text-sm text-slate-300 font-medium">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <p className="text-[11px] text-slate-400 font-medium">Total Akurasi</p>
              <p className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                99.9% <TrendingUp size={15} className="text-emerald-400" />
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <p className="text-[11px] text-slate-400 font-medium">Keamanan Data</p>
              <p className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                AES-256 <Lock size={15} className="text-cyan-400" />
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-[11px] text-slate-500 font-mono tracking-wider uppercase">
          © 2026 ArusKas App • All rights reserved
        </div>
      </div>

      {/* ================= SISI KANAN: FORM & 2 BULATAN CAHAYA (5 COL) ================= */}
      <div className="lg:col-span-5 relative flex flex-col justify-center items-center p-6 sm:p-10 bg-slate-950/40 backdrop-blur-2xl overflow-hidden">
        
        {/* CSS Keyframes Animasi Pergerakan Pelan */}
        <style jsx>{`
          @keyframes floatTopLeft {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, 50px) scale(1.1); }
          }
          @keyframes floatBottomRight {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-40px, -50px) scale(1.1); }
          }
          .animate-glow-tl {
            animation: floatTopLeft 14s ease-in-out infinite;
          }
          .animate-glow-br {
            animation: floatBottomRight 16s ease-in-out infinite;
          }
        `}</style>

        {/* 1. BULATAN CAHAYA ATAS KIRI */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-[360px] h-[360px] bg-cyan-500/20 rounded-full blur-[110px] animate-glow-tl" />

        {/* 2. BULATAN CAHAYA BAWAH KANAN */}
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-[360px] h-[360px] bg-blue-600/25 rounded-full blur-[110px] animate-glow-br" />

        {/* Tombol Beranda */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 right-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs transition z-20 group cursor-pointer px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Beranda
        </button>

        {/* Form Container */}
        <div className="w-full max-w-sm space-y-6 relative z-10">
          
          <div>
            <h1 className="text-2xl xl:text-3xl font-black text-white tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 text-xs xl:text-sm mt-1.5">Masukkan kredensial akun Anda untuk melanjutkan.</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block ml-0.5">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all placeholder:text-slate-600 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block ml-0.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all pr-10 placeholder:text-slate-600 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleForgotPassword}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition bg-transparent cursor-pointer hover:underline"
              >
                Lupa password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer mt-1
                ${loading ? "bg-cyan-600/50 cursor-not-allowed" : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : "Masuk"}
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center font-normal">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-all cursor-pointer"
            >
              Daftar sekarang
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}