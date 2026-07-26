"use client";

import { useState } from "react";
import { Save, Loader2, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfileTab({ profile, setProfile, onSave, isLoading }) {
  // State ganti password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State toggle show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handler ubah password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Masukkan kata sandi saat ini terlebih dahulu");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password baru minimal terdiri dari 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    setIsChangingPassword(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        // 1. Re-authenticate user dengan password saat ini
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // 2. Update password baru
        await updatePassword(user, newPassword);

        toast.success("Password berhasil diperbarui ✨");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        toast.error("Kata sandi saat ini salah!");
      } else {
        toast.error("Gagal mengubah password: " + error.message);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: INFORMASI PROFIL */}
      <form onSubmit={onSave} className="space-y-6">
        <h2 className="text-xl font-bold border-b border-white/10 pb-4 flex items-center gap-2">
          <span>Informasi Profil</span>
        </h2>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
              placeholder="Masukkan nama..."
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-sm text-white shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </form>

      {/* SECTION 2: GANTI PASSWORD */}
      <form
        onSubmit={handleChangePassword}
        className="space-y-6 pt-6 border-t border-white/10"
      >
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-white">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <span>Ubah Kata Sandi</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Amankan akun kamu dengan memperbarui kata sandi secara berkala.
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          {/* KATA SANDI SAAT INI */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-12 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* KATA SANDI BARU */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-12 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* KONFIRMASI KATA SANDI BARU */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-12 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm text-white border border-white/10 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChangingPassword ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          <span>{isChangingPassword ? "Memproses..." : "Ubah Password"}</span>
        </button>
      </form>
    </div>
  );
}