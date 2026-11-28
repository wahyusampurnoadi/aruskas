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
  X,
  ShieldCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const PRO_FEATURES_FREE = [
  "Unlimited Scan Struk & Transfer AI",
  "Pemrosesan AI Super Cepat",
  "Ekspor Laporan (PDF & Excel)",
  "Pengalaman Bebas Iklan",
  "Dukungan Prioritas 24/7",
];

const PRO_FEATURES_ACTIVE = [
  "Unlimited Scan Struk & Transfer AI",
  "Prioritas Kecepatan Gemini AI",
  "Ekspor Laporan (PDF & Excel)",
  "Bebas dari Iklan",
  "Prioritas Dukungan Pelanggan (24/7)",
];

/* Kartu metrik kecil untuk paket aktif */
function MetricTile({ label, value, hint, Icon, accent = false }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accent ? "text-amber-500" : "text-subtle"}`}>
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            accent ? "bg-amber-500/15 text-amber-500" : "chip text-muted"
          }`}
        >
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-4 text-base font-bold text-main">{value}</p>
      <p className="mt-1 text-[11px] text-subtle">{hint}</p>
    </div>
  );
}

/* Baris fitur dengan centang */
function FeatureItem({ text }) {
  return (
    <div className="tile flex items-center gap-3 rounded-2xl p-3.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <CheckCircle2 size={15} />
      </span>
      <span className="text-xs font-medium text-main">{text}</span>
    </div>
  );
}

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
          updatedAt: new Date(),
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
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-subtle">Memuat informasi langganan...</p>
      </div>
    );
  }

  /* ---------- Modal pilihan paket ---------- */
  const plansModal = showPlansModal && (
    <div className="fixed inset-y-0 left-0 right-0 z-[10001] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm lg:left-[280px]">
      <div className="glass-strong relative w-full max-w-md overflow-hidden rounded-[28px] p-6 sm:p-7">
        <button
          type="button"
          onClick={() => setShowPlansModal(false)}
          aria-label="Tutup"
          className="btn-icon absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Crown className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-main">
            ArusKas <span className="text-gradient">PRO</span>
          </h3>
          <p className="mx-auto max-w-[280px] text-xs leading-relaxed text-subtle">
            Pilih paket langganan yang sesuai dengan kebutuhan finansial Anda.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {[
            { key: "monthly", label: "Bulanan", price: "Rp 19.000", unit: "/bln" },
            { key: "yearly", label: "Tahunan", price: "Rp 159.000", unit: "/thn", badge: "Hemat 30%" },
          ].map((plan) => {
            const active = selectedPlan === plan.key;
            return (
              <button
                key={plan.key}
                type="button"
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative cursor-pointer rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-amber-500/60 bg-amber-500/10 shadow-md shadow-amber-500/10"
                    : "tile border-transparent hover:border-[var(--line)]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold text-white">
                    {plan.badge}
                  </span>
                )}
                <span className="mb-1 block text-[11px] font-semibold text-subtle">{plan.label}</span>
                <div className="text-lg font-black text-main">
                  {plan.price}
                  <span className="text-[10px] font-normal text-subtle">{plan.unit}</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loadingPayment}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 py-3 text-xs font-extrabold text-white shadow-xl shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] disabled:opacity-50"
        >
          {loadingPayment ? (
            <span>Menyiapkan Pembayaran...</span>
          ) : (
            <>
              <Zap className="h-4 w-4 fill-white" />
              <span>Aktivasi ArusKas PRO Sekarang</span>
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-subtle">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Pembayaran aman via Midtrans</span>
        </div>
      </div>
    </div>
  );

  /* ---------- Modal pembatalan ---------- */
  const cancelModal = showCancelModal && (
    <div className="fixed inset-y-0 left-0 right-0 z-[10001] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm lg:left-[280px]">
      <div className="glass-strong w-full max-w-md space-y-4 rounded-[28px] p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <AlertTriangle size={18} />
          </span>
          <h3 className="text-base font-bold text-main">Batalkan Langganan?</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Apakah Anda yakin ingin membatalkan perpanjangan otomatis? Fitur PRO Anda tetap aktif hingga akhir periode pembayaran saat ini.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowCancelModal(false)}
            className="btn-ghost flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleToggleCancelSubscription}
            className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );

  /* ---------- Tampilan akun FREE ---------- */
  if (!isPro) {
    return (
      <div className="space-y-6">
        {/* Header tab */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-main">
              <Crown className="h-5 w-5 text-amber-500" />
              <span>Informasi Langganan</span>
            </h2>
            <p className="mt-1 text-xs text-subtle">
              Tingkatkan ke paket PRO untuk membuka semua fitur eksklusif ArusKas.
            </p>
          </div>
          <span className="chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-subtle" />
            Paket Gratis
          </span>
        </div>

        {/* Banner rekomendasi */}
        <div className="glass relative overflow-hidden rounded-[24px] p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div className="relative max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
              <Zap className="h-3 w-3 fill-amber-500" /> Rekomendasi Fitur
            </span>
            <h3 className="text-2xl font-black leading-tight tracking-tight text-main">
              Kelola Keuangan Lebih Cerdas dengan{" "}
              <span className="text-gradient">ArusKas PRO</span>
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              Otomatisasi pencatatan dengan AI Scan Struk tanpa batas, analisis mendalam, serta bebas dari iklan.
            </p>
            <button
              type="button"
              onClick={() => setShowPlansModal(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:from-amber-400 hover:to-orange-400 active:scale-[0.98]"
            >
              <Crown className="h-4 w-4 fill-white" />
              <span>Berlangganan PRO — Rp 19.000/bln</span>
            </button>
          </div>
        </div>

        {/* Daftar manfaat */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Manfaat Fitur Premium
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PRO_FEATURES_FREE.map((feature) => (
              <FeatureItem key={feature} text={feature} />
            ))}
          </div>
        </div>

        {plansModal}
      </div>
    );
  }

  /* ---------- Tampilan akun PRO ---------- */
  const statusActive = !userData?.isCanceled;

  return (
    <div className="space-y-6">
      {/* Header tab */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-main">
            <Crown className="h-5 w-5 fill-amber-500/20 text-amber-500" />
            <span>Informasi Langganan Premium</span>
          </h2>
          <p className="mt-1 text-xs text-subtle">Kelola status paket aktif dan perpanjangan akun Anda.</p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            statusActive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
              : "border-rose-500/30 bg-rose-500/10 text-rose-500"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${statusActive ? "animate-pulse bg-emerald-500" : "bg-rose-500"}`} />
          {statusActive ? "Paket Aktif" : "Berakhir di Akhir Periode"}
        </span>
      </div>

      {/* Kartu metrik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile
          label="Tipe Paket"
          value={userData?.planType || subscriptionInfo?.planType || "ArusKas PRO"}
          hint="Akses penuh ke semua fitur"
          Icon={CreditCard}
          accent
        />
        <MetricTile
          label="Tanggal Mulai"
          value={
            userData?.updatedAt?.toDate
              ? new Date(userData.updatedAt.toDate()).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : subscriptionInfo?.startDate || "Aktif"
          }
          hint="Tanggal aktivasi paket"
          Icon={Calendar}
        />
        <MetricTile
          label="Status Perpanjangan"
          value={userData?.isCanceled ? "Nonaktif" : "Otomatis"}
          hint={userData?.isCanceled ? "Tidak akan ditagih lagi" : "Diperpanjang secara berkala"}
          Icon={Clock}
        />
      </div>

      {/* Manfaat aktif */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Manfaat Fitur Aktif Anda
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PRO_FEATURES_ACTIVE.map((feature) => (
            <FeatureItem key={feature} text={feature} />
          ))}
        </div>
      </div>

      {/* Manajemen pembatalan */}
      <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-xs font-semibold text-main">Manajemen Pembatalan</h4>
          <p className="mt-0.5 text-[11px] text-subtle">
            Anda dapat membatalkan atau mengaktifkan kembali perpanjangan kapan saja.
          </p>
        </div>

        {!userData?.isCanceled ? (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-500 transition hover:bg-rose-500/15 active:scale-95"
          >
            <XCircle size={15} />
            Batalkan Langganan
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggleCancelSubscription}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-500 transition hover:bg-amber-500/15 active:scale-95"
          >
            <Crown size={15} />
            Aktifkan Kembali Langganan
          </button>
        )}
      </div>

      {plansModal}
      {cancelModal}
    </div>
  );
}