"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { showPopup } from "@/lib/popup";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showPopup({
        type: "warning",
        title: "Nama belum diisi",
        text: "Tulis nama lengkapmu terlebih dahulu.",
      });
      return;
    }

    if (!email || password.length < 6) {
      showPopup({
        type: "warning",
        title: "Data belum lengkap",
        text: "Isi email dan password minimal 6 karakter.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name.trim() });

      await showPopup({
        type: "success",
        title: "Akun berhasil dibuat",
        text: "Selamat datang di ArusKas. Silakan masuk untuk mulai mencatat.",
        confirmText: "Masuk sekarang",
      });

      router.push("/login");
    } catch (error) {
      showPopup({
        type: "error",
        title: "Gagal mendaftar",
        text: "Email mungkin sudah terdaftar. Coba gunakan email lain.",
        confirmText: "Oke",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heroTitle="Mulai kebiasaan keuangan yang lebih sehat."
      heroDescription="Gratis dan sederhana. Atur arus kas, wishlist tabungan, dan langganan rutin tanpa biaya tersembunyi."
      heading="Buat akun"
      subheading="Isi data di bawah untuk memulai."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-main">
            Nama lengkap
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Masukkan nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-main">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-main">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass w-full rounded-xl px-4 py-3 pr-11 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-subtle transition hover:text-main"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar sekarang"
          )}
        </button>
      </form>
    </AuthShell>
  );
}