"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; 

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      alert("Nama wajib diisi");
      return;
    }
    if (!email || password.length < 6) {
      alert("Email wajib diisi & password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name.trim() });
      alert("Akun berhasil dibuat. Silakan login.");
      router.push("/login");
    } catch (error) {
      alert("Gagal daftar. Email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
      
      {/* --- ELEMEN BACKGROUND (Sama dengan Login) --- */}
      {/* Orb Biru di Kanan Atas */}
      <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      {/* Orb Ungu di Kiri Bawah */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      {/* ------------------------------- */}

      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition z-10 group cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Daftar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ArusKas</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Mulai langkah bijak mengelola keuanganmu hari ini.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block ml-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block ml-1">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all pr-12 placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]
              ${loading ? "bg-blue-600/50 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 cursor-pointer"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mendaftarkan...
              </span>
            ) : "Buat Akun Sekarang"}
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-8">
          Sudah punya akun?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-all cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}