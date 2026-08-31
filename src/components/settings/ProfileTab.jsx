"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Mail,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
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

  // State modal ubah email
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [showReauthPassword, setShowReauthPassword] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Mounted state untuk React Portal (SSR Safety)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handler Upload Foto Profil ke Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB!");
      return;
    }

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
      console.error("Cloudinary Error:", error);
      toast.error("Gagal mengunggah foto: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handler Hapus Foto Profil
  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, photoURL: "" }));
    toast.info("Foto profil dihapus. Klik Simpan Perubahan untuk mengonfirmasi.");
  };

  // Handler Submit Form Profil (Nama & Email)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    // Jika pengguna mengubah alamat email, minta verifikasi kata sandi terlebih dahulu
    if (currentUser && currentUser.email !== profile.email) {
      setIsEmailModalOpen(true);
      return;
    }

    // Jika email tidak berubah, simpan nama/foto secara normal
    if (onSave) onSave(e);
  };

  // Handler Kirim Link Verifikasi Email Baru
  const handleConfirmEmailChange = async (e) => {
    e.preventDefault();
    if (!reauthPassword) {
      toast.error("Masukkan kata sandi untuk konfirmasi!");
      return;
    }

    setIsVerifyingEmail(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("Sesi pengguna tidak ditemukan. Silakan login ulang.");
      }

      // 1. Re-autentikasi pengguna dengan kata sandi saat ini
      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Kirim email verifikasi ke alamat email baru
      await verifyBeforeUpdateEmail(user, profile.email);

      // 3. Simpan perubahan profil lainnya (nama, foto) ke Firestore jika ada
      if (onSave) await onSave(e);

      toast.success(
        `Link konfirmasi dikirim ke ${profile.email}! Silakan periksa Inbox atau folder Spam.`
      );
      setIsEmailModalOpen(false);
      setReauthPassword("");
    } catch (error) {
      console.error("Update Email Error:", error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Kata sandi yang Anda masukkan salah!");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Sesi Anda telah berakhir. Silakan login ulang!");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email tersebut sudah digunakan oleh akun lain!");
      } else {
        toast.error("Gagal memperbarui email: " + error.message);
      }
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Handler Ubah Password
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
      console.error("Change Password Error:", error);
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
      <form onSubmit={handleProfileSubmit} className="space-y-6">
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

            {uploadingImage && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            )}

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
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
              placeholder="Masukkan email..."
              required
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

      {/* MODAL RE-AUTHENTICATION VIA REACT PORTAL */}
      {mounted &&
        isEmailModalOpen &&
        createPortal(
          <div className="fixed inset-0 left-0 lg:left-64 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5">
              <button
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setReauthPassword("");
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Konfirmasi Perubahan Email
                  </h3>
                  <p className="text-xs text-slate-400">
                    Masukkan kata sandi Anda untuk memverifikasi identitas.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Link konfirmasi akan dikirimkan ke <strong>{profile.email}</strong>.
                </span>
              </div>

              <form onSubmit={handleConfirmEmailChange} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showReauthPassword ? "text" : "password"}
                      value={reauthPassword}
                      onChange={(e) => setReauthPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-12 py-3 text-sm text-white outline-none focus:border-cyan-500 transition"
                      autoFocus
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowReauthPassword(!showReauthPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {showReauthPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailModalOpen(false);
                      setReauthPassword("");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingEmail}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifyingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {isVerifyingEmail ? "Memproses..." : "Konfirmasi Perubahan"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}