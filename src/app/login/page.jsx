"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { showPopup } from "@/lib/popup";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

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
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      showPopup({
        type: "error",
        title: "Gagal masuk",
        text: "Email atau password yang kamu masukkan salah.",
        confirmText: "Coba lagi",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showPopup({
        type: "info",
        title: "Masukkan email",
        text: "Isi kolom email terlebih dahulu untuk reset password.",
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      showPopup({
        type: "success",
        title: "Email terkirim",
        text: `Instruksi reset password sudah dikirim ke ${email}.`,
      });
    } catch (error) {
      showPopup({
        type: "error",
        title: "Gagal mengirim",
        text: "Email reset tidak bisa dikirim. Periksa kembali alamat email kamu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heroTitle="Catat setiap rupiah, tanpa ribet."
      heroDescription="Pantau arus kas harian, atur target tabungan, dan lihat kondisi keuanganmu dalam satu tempat yang rapi."
      heading="Masuk"
      subheading="Selamat datang kembali. Masukkan data akunmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
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
              autoComplete="current-password"
              placeholder="••••••••"
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs font-medium text-accent hover:underline"
          >
            Lupa password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>
    </AuthShell>
  );
}