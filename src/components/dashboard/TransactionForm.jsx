"use client";

import { useState } from "react";
import { Upload, X, Eye, Sparkles, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
}) {
  const [activeTab, setActiveTab] = useState("scan");
  const [scanning, setScanning] = useState(false);

  // Helper untuk Kompresi Gambar di Sisi Client
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // Pembatasan lebar maksimum
          const scaleSize = MAX_WIDTH / img.width;

          if (scaleSize < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.7 // Kualitas kompresi 70%
          );
        };
      };
    });
  };

  // Handler Pemrosesan Gambar via Groq AI
  const handleAIScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file awal maksimal 5 MB");
      return;
    }

    setScanning(true);

    try {
      // 1. Kompresi gambar terlebih dahulu
      const compressedFile = await compressImage(file);

      // Set preview & file di state parent
      setImageFile(compressedFile);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(compressedFile);

      // 2. Siapkan FormData
      const formData = new FormData();
      formData.append("file", compressedFile);

      // 3. Eksekusi request scan ke backend
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        const {
          amount: aiAmount,
          merchantName,
          date,
          type: aiType,
          category: aiCategory,
        } = result.data;

        if (aiType) setType(aiType);
        if (aiAmount) {
          setAmount(new Intl.NumberFormat("id-ID").format(Number(aiAmount)));
        }
        if (date) setTransactionDate(date);
        if (merchantName) setNote(merchantName);
        if (aiCategory) setCategory(aiCategory);

        toast.success("Data berhasil diekstrak oleh AI! ✨");
        setActiveTab("manual"); // Pindah ke form manual untuk review
      } else {
        toast.error(result.error || "AI gagal membaca detail struk.");
        setActiveTab("manual");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan/server.");
      setActiveTab("manual");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Switcher Tab Mode */}
      <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("scan")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "scan"
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Scan Struk (AI)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "manual"
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Form Manual</span>
        </button>
      </div>

      {/* TAB 1: SCAN STRUK VIA AI */}
      {activeTab === "scan" && (
        <div className="p-6 border border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl bg-indigo-950/10 flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[220px]">
          {scanning ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-semibold text-indigo-200">
                Groq AI sedang membaca struk...
              </p>
              <p className="text-[10px] text-slate-400">
                Mengekstrak nominal, tanggal, & keterangan
              </p>
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
                Format JPG, PNG (Max 5MB, dikompres otomatis)
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