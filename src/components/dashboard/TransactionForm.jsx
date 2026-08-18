"use client";

import { useState, useRef } from "react";
import { Upload, X, Eye, Sparkles, FileText, Loader2, Lock, Crown } from "lucide-react";
import { toast } from "sonner";
import { cropAndCompressImage } from "@/lib/utils";
import { usePro } from "@/app/hooks/usePro";
import { auth } from "@/lib/firebase";

export default function TransactionForm({
  formRef,
  submit,
  editingId,
  type,
  setType,
  transactionDate,
  setTransactionDate,
  amount,
  setAmount,
  handleAmountChange,
  category,
  setCategory,
  note,
  setNote,
  handleFileUpload,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  uploading,
  goals = [],
  selectedGoalId,
  setSelectedGoalId,
  onPreviewClick,
  onUpgradeClick,
}) {
  const { isPro } = usePro();

  const [activeTab, setActiveTab] = useState("scan");
  const [scanning, setScanning] = useState(false);
  
  const abortControllerRef = useRef(null);

  const INCOME_CATEGORIES = ["Gaji", "Bonus", "Freelance", "Investasi", "Lainnya"];
  const EXPENSE_CATEGORIES = [
    "Makanan & Minuman",
    "Transportasi",
    "Belanja",
    "Tagihan & Utilitas",
    "Hiburan",
    "Kesehatan",
    "Pendidikan",
    "Wishlist",
    "Lainnya",
  ];

  const handleAIScan = async (e) => {
    if (!isPro) {
      toast.error("Fitur Scan Struk AI khusus untuk pengguna ArusKas Pro!");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file awal maksimal 10 MB");
      return;
    }

    // Ambil Firebase ID Token pengguna yang sedang aktif
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Sesi Anda berakhir. Silakan login kembali!");
      return;
    }

    setScanning(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const idToken = await currentUser.getIdToken();
      const processedFile = await cropAndCompressImage(file);

      setImageFile(processedFile);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(processedFile);

      const formData = new FormData();
      formData.append("file", processedFile);

      // Kirim ID Token di header Authorization
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

      // Penanganan jika server mengembalikan HTML (Error 500/404)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengembalikan respons non-JSON. Periksa log server.");
      }

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        const {
          amount: aiAmount,
          merchantName,
          date,
          type: aiType,
          category: aiCategory,
        } = result.data;

        const targetType = aiType || "income";
        setType(targetType);

        if (aiAmount !== undefined && aiAmount !== null) {
          setAmount(new Intl.NumberFormat("id-ID").format(Number(aiAmount)));
        }

        if (date) setTransactionDate(date);
        if (merchantName) setNote(merchantName);

        const validCategories =
          targetType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        
        if (aiCategory && validCategories.includes(aiCategory)) {
          setCategory(aiCategory);
        } else {
          setCategory(targetType === "income" ? "Freelance" : "Lainnya");
        }

        toast.success("Data berhasil diekstrak oleh AI! ✨");
        setActiveTab("manual");
      } else {
        toast.error(result.error || "AI gagal membaca detail struk.");
        setActiveTab("manual");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        toast.info("Pemindaian struk dibatalkan.");
      } else {
        console.error(err);
        toast.error(err.message || "Terjadi kesalahan jaringan/server.");
        setActiveTab("manual");
      }
    } finally {
      setScanning(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setScanning(false);
  };

  return (
    <div className="space-y-4">
      {/* Switcher Tab Mode */}
      <div className="grid grid-cols-2 bg-slate-950/80 p-1.5 rounded-xl border border-white/10 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab("scan")}
          className={`px-2 py-2 sm:px-3 sm:py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
            activeTab === "scan"
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="whitespace-nowrap text-[11px] sm:text-xs">Scan Struk (AI)</span>
          <span className="px-1 py-0.5 sm:px-1.5 text-[8px] sm:text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold rounded-md flex items-center gap-0.5 shrink-0 uppercase">
            <Crown className="w-2.5 h-2.5 fill-slate-950" />
            PRO
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-2 py-2 sm:px-3 sm:py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
            activeTab === "manual"
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="whitespace-nowrap text-[11px] sm:text-xs">Form Manual</span>
        </button>
      </div>

      {/* TAB 1: SCAN STRUK VIA AI */}
      {activeTab === "scan" && (
        <div className="p-6 border border-dashed border-indigo-500/30 rounded-2xl bg-indigo-950/10 flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[220px] relative overflow-hidden">
          {!isPro ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  Fitur Eksklusif ArusKas PRO
                </h4>
                <p className="text-[10px] text-slate-400 max-w-[260px]">
                  Otomatis catat transaksi cukup dengan unggah foto struk belanja atau resi transfer.
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgradeClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Upgrade Ke Pro</span>
              </button>
            </div>
          ) : scanning ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-semibold text-indigo-200">
                AI sedang membaca struk... (estimasi 10-20 detik)
              </p>
              <p className="text-[10px] text-slate-400">
                Mengekstrak nominal, tanggal, & keterangan
              </p>
              <button
                type="button"
                onClick={handleCancelScan}
                className="mt-2 text-[11px] text-rose-400 hover:underline cursor-pointer"
              >
                Batal
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
              <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 mb-2 border border-indigo-500/30">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white mb-0.5">
                Upload Struk / Screenshot Transfer
              </span>
              <span className="text-[10px] text-slate-400 mb-3">
                Format JPG, PNG (Max 10MB, dikompres otomatis)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all shadow-md">
                Pilih Foto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAIScan}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* TAB 2: FORM MANUAL */}
      {activeTab === "manual" && (
        <form ref={formRef} onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === "income"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === "expense"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pengeluaran
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    -- Pilih Kategori --
                  </option>
                  {type === "income" ? (
                    <>
                      <option value="Gaji" className="bg-slate-900 text-white">Gaji</option>
                      <option value="Bonus" className="bg-slate-900 text-white">Bonus</option>
                      <option value="Freelance" className="bg-slate-900 text-white">Freelance</option>
                      <option value="Investasi" className="bg-slate-900 text-white">Investasi</option>
                      <option value="Lainnya" className="bg-slate-900 text-white">Lainnya</option>
                    </>
                  ) : (
                    <>
                      <option value="Makanan & Minuman" className="bg-slate-900 text-white">Makanan & Minuman</option>
                      <option value="Transportasi" className="bg-slate-900 text-white">Transportasi</option>
                      <option value="Belanja" className="bg-slate-900 text-white">Belanja</option>
                      <option value="Tagihan & Utilitas" className="bg-slate-900 text-white">Tagihan & Utilitas</option>
                      <option value="Hiburan" className="bg-slate-900 text-white">Hiburan</option>
                      <option value="Kesehatan" className="bg-slate-900 text-white">Kesehatan</option>
                      <option value="Pendidikan" className="bg-slate-900 text-white">Pendidikan</option>
                      <option value="Wishlist" className="bg-slate-900 text-white">Target Wishlist</option>
                      <option value="Lainnya" className="bg-slate-900 text-white">Lainnya</option>
                    </>
                  )}
                </select>
              </div>

              {type === "expense" && category === "Wishlist" && (
                <div>
                  <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                    Target Wishlist
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-amber-500/30 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">
                      -- Pilih Goal Wishlist --
                    </option>
                    {goals.map((goal) => (
                      <option key={goal.id} value={goal.id} className="bg-slate-900 text-white">
                        {goal.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan transaksi..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="space-y-3 flex flex-col justify-between h-full">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Bukti Transaksi (Opsional)
                </label>

                {imagePreview ? (
                  <div className="relative group w-full h-[152px] rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain p-2 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => onPreviewClick && onPreviewClick(imagePreview)}
                    />
                    <div 
                      onClick={() => onPreviewClick && onPreviewClick(imagePreview)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                    >
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/20 text-white text-xs backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Full</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 w-full h-[152px] border border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 transition-all cursor-pointer text-slate-400 hover:text-white p-4 text-center">
                    <Upload className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-medium">Unggah Struk / Bukti</span>
                    <span className="text-[10px] text-slate-500">Format PNG, JPG (Max 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-auto"
              >
                {uploading ? "Menyimpan..." : editingId ? "Perbarui Transaksi" : "Simpan Transaksi"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}