"use client";

import { useState, useEffect } from "react";
import { 
  Crown, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  XCircle, 
  AlertTriangle,
  Zap,
  Check,
  X,
  ShieldCheck,
  Loader2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PremiumTab({ userPlan: propUserPlan, subscriptionInfo, onSuccessUpgrade }) {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // State Modal & Pembayaran
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loadingPayment, setLoadingPayment] = useState(false);

  // State Pembatalan
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Synchronize status user dari Firestore secara Real-time
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoadingUser(false);
        });

        return () => unsubscribeDoc();
      } else {
        setLoadingUser(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const isPro = userData?.isPro === true || propUserPlan === "pro" || propUserPlan === "premium";

  const handleSubscribe = async () => {
    setLoadingPayment(true);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();

      if (!response.ok || !data.snapToken) {
        throw new Error(data.error || "Gagal mendapatkan token transaksi.");
      }

      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: async function () {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                  isPro: true,
                  updatedAt: new Date(),
                });
              }

              toast.success("Pembayaran berhasil! Akun Anda aktif sebagai PRO ✨");
              if (onSuccessUpgrade) onSuccessUpgrade();
              setShowPlansModal(false);
            } catch (err) {
              console.error("Gagal memperbarui status user:", err);
              toast.error("Pembayaran sukses, namun gagal mengaktifkan PRO secara otomatis.");
            }
          },
          onPending: function () {
            toast.info("Menunggu penyelesaian pembayaran Anda...");
          },
          onError: function () {
            toast.error("Pembayaran gagal diproses. Silakan coba lagi.");
          },
          onClose: function () {
            toast.warning("Transaksi dibatalkan.");
          },
        });
      } else {
        toast.error("Sistem pembayaran belum siap. Silakan refresh halaman.");
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat memproses langganan.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleToggleCancelSubscription = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const newCancelStatus = !userData?.isCanceled;
        
        await updateDoc(userRef, {
          isCanceled: newCancelStatus,
          updatedAt: new Date()
        });

        toast.info(newCancelStatus ? "Langganan berhasil dibatalkan" : "Langganan diaktifkan kembali");
      }
    } catch (error) {
      toast.error("Gagal mengubah status langganan");
    } finally {
      setShowCancelModal(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Memuat informasi langganan...</p>
      </div>
    );
  }

  // TAMPILAN AKUN FREE
  if (!isPro) {
    return (
      <div className="space-y-6">
        {/* HEADER TAB */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Informasi Langganan</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tingkatkan ke paket PRO untuk membuka semua fitur eksklusif ArusKas.
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 bg-slate-900/80 text-slate-300 border border-slate-700/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Paket Gratis
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-amber-500/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-amber-300" /> Rekomendasi Fitur
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
              Kelola Keuangan Lebih Cerdas dengan <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">ArusKas PRO</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Otomatisasi pencatatan dengan AI Scan Struk tanpa batas, analisis mendalam, serta bebas dari iklan.
            </p>
            <button
              type="button"
              onClick={() => setShowPlansModal(true)}
              className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>Berlangganan PRO — Rp 19.000/bln</span>
            </button>
          </div>
        </div>

        {/* LIST FITUR */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Manfaat Fitur Premium:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Unlimited Scan Struk & Transfer AI",
              "Pemrosesan AI Super Cepat",
              "Ekspor Laporan (PDF & Excel)",
              "Pengalaman Bebas Iklan",
              "Dukungan Prioritas 24/7"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-900/50 border border-white/5 p-3.5 rounded-2xl backdrop-blur-md">
                <div className="p-1 rounded-full bg-amber-400/10 text-amber-400">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-xs font-medium text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN AKUN PRO
  return (
    <div className="space-y-6">
      {/* HEADER TAB */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <span>Informasi Langganan Premium</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola status paket aktif dan perpanjangan akun Anda.
          </p>
        </div>

        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border shadow-sm ${
          userData?.isCanceled 
            ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
        }`}>
          <span className={`w-2 h-2 rounded-full ${userData?.isCanceled ? "bg-rose-400" : "bg-emerald-400 animate-pulse"}`} />
          {userData?.isCanceled ? "Berakhir di Akhir Periode" : "Paket Aktif"}
        </span>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Tipe Paket</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-base font-extrabold text-white">
            {userData?.planType || subscriptionInfo?.planType || "ArusKas PRO"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akses penuh ke semua fitur</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Mulai</span>
            <div className="p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-base font-extrabold text-white">
            {userData?.updatedAt?.toDate 
              ? new Date(userData.updatedAt.toDate()).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
              : subscriptionInfo?.startDate || "Aktif"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tanggal aktivasi paket</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Perpanjangan</span>
            <div className="p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-base font-extrabold text-white">
            {userData?.isCanceled ? "Nonaktif" : "Otomatis"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {userData?.isCanceled ? "Tidak akan ditagih lagi" : "Diperpanjang secara berkala"}
          </p>
        </div>
      </div>

      {/* FITUR EKSKLUSIF PRO */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Manfaat Fitur Aktif Anda
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Unlimited Scan Struk & Transfer AI",
            "Prioritas Kecepatan Gemini AI",
            "Ekspor Laporan (PDF & Excel)",
            "Bebas dari Iklan",
            "Prioritas Dukungan Pelanggan (24/7)"
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl backdrop-blur-md">
              <div className="p-1 rounded-full bg-emerald-400/10 text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-xs font-medium text-slate-200">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER MANAJEMEN LANGGANAN */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Manajemen Pembatalan</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Anda dapat membatalkan atau mengaktifkan kembali perpanjangan kapan saja.
          </p>
        </div>

        {!userData?.isCanceled ? (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <XCircle size={15} />
            Batalkan Langganan
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleCancelSubscription}
            className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Crown size={15} />
            Aktifkan Kembali Langganan
          </button>
        )}
      </div>

      {/* MODAL PILIHAN PAKET */}
      {showPlansModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPlansModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                <Crown className="w-8 h-8 fill-amber-400/20" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                ArusKas <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">PRO</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                Pilih paket langganan yang sesuai dengan kebutuhan finansial Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setSelectedPlan("monthly")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  selectedPlan === "monthly"
                    ? "bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10"
                    : "bg-slate-950/50 border-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Bulanan</span>
                <div className="text-lg font-black text-white">
                  Rp 19.000<span className="text-[10px] font-normal text-slate-400">/bln</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan("yearly")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  selectedPlan === "yearly"
                    ? "bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10"
                    : "bg-slate-950/50 border-white/10 hover:border-white/20"
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[9px] font-extrabold text-slate-950 rounded-full">
                  Hemat 30%
                </span>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tahunan</span>
                <div className="text-lg font-black text-white">
                  Rp 159.000<span className="text-[10px] font-normal text-slate-400">/thn</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loadingPayment}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loadingPayment ? (
                <span>Menyiapkan Pembayaran...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Aktivasi ArusKas PRO Sekarang</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pembayaran aman via Midtrans</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CANCEL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 bg-amber-400/10 rounded-2xl border border-amber-400/20">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Batalkan Langganan?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin membatalkan perpanjangan otomatis? Fitur PRO Anda tetap aktif hingga akhir periode pembayaran saat ini.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleToggleCancelSubscription}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}