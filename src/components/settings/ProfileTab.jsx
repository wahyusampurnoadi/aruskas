"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Camera,
  User,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfileTab({ profile, setProfile, onSave, isLoading }) {
  // State upload foto profil
  const [uploadingImage, setUploadingImage] = useState(false);

  // State ganti password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State toggle show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handler Upload Foto Profil ke Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (Maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB!");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar (JPG, PNG, WEBP)!");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "YOUR_UPLOAD_PRESET"
    );

    try {
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setProfile((prev) => ({ ...prev, photoURL: data.secure_url }));
        toast.success("Foto profil diunggah! Klik Simpan Perubahan.");
      } else {
        throw new Error(data.error?.message || "Gagal mengunggah gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handler Hapus Foto Profil (Mengembalikan ke Inisial Huruf)
  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, photoURL: "" }));
    toast.info("Foto profil dihapus. Klik Simpan Perubahan untuk mengonfirmasi.");
  };

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
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        toast.success("Password berhasil diperbarui ✨");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
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

        {/* COMPONENT GANTI / HAPUS FOTO PROFIL */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-950/40 border border-white/5 max-w-md">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cyan-600/30 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-2xl shadow-inner">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : profile.name ? (
                <span>{profile.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="w-8 h-8 text-cyan-400" />
              )}
            </div>

            {/* Spinner Overlay saat Uploading */}
            {uploadingImage && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            )}

            {/* Tombol Upload */}
            <label
              htmlFor="photo-upload"
              className="absolute -bottom-1 -right-1 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl cursor-pointer shadow-lg transition-all active:scale-95 border border-white/20"
              title="Ganti Foto Profil"
            >
              <Camera className="w-4 h-4" />
              <input
                id="photo-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">Foto Profil</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Format JPG, PNG, atau WEBP (Maksimal 2MB).
            </p>

            {/* Tombol Hapus Foto (Hanya muncul jika ada foto) */}
            {profile.photoURL && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* INPUT NAMA & EMAIL */}
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
          disabled={isLoading || uploadingImage}
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