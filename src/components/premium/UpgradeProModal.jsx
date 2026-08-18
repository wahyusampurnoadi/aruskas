"use client";

import { useState } from "react";
import { X, Crown, Check, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function UpgradeProModal({ isOpen, onClose, onSuccessUpgrade }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
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
          onSuccess: async function (result) {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                // Sync status Pro langsung ke Firestore saat bayar sukses
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, {
                  isPro: true,
                  updatedAt: new Date(),
                });
              }

              toast.success("Pembayaran berhasil! Akun Anda aktif sebagai PRO ✨");
              if (onSuccessUpgrade) onSuccessUpgrade();
              onClose();
            } catch (err) {
              console.error("Gagal memperbarui status user:", err);
              toast.error("Pembayaran sukses, namun gagal mengaktifkan PRO secara otomatis.");
            }
          },
          onPending: function (result) {
            toast.info("Menunggu penyelesaian pembayaran Anda...");
          },
          onError: function (result) {
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
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in md:pl-64">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 mb-1">
            <Crown className="w-8 h-8 fill-amber-400/20" />
          </div>
          <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
            ArusKas <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">PRO</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
            Buka akses penuh ke seluruh fitur cerdas pengelolaan keuangan tanpa batas.
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
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[9px] font-extrabold text-slate-950 rounded-full shadow-sm">
              Hemat 30%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tahunan</span>
            <div className="text-lg font-black text-white">
              Rp 159.000<span className="text-[10px] font-normal text-slate-400">/thn</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-2xl border border-white/5 mb-6">
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span><strong>Unlimited</strong> Scan Struk & Transfer AI</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Prioritas kecepatan pemrosesan Gemini AI</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Ekspor Laporan Keuangan (PDF & Excel)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Bebas dari segala bentuk iklan</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
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
          <span>Pembayaran aman & dapat dibatalkan kapan saja</span>
        </div>
      </div>
    </div>
  );
}