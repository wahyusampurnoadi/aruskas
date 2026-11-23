"use client";

import { useState, useRef } from "react";
import { Upload, X, Eye, Sparkles, FileText, Loader2, Lock, Crown, Calendar, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cropAndCompressImage } from "@/lib/utils";
import { usePro } from "@/app/hooks/usePro";
import { auth } from "@/lib/firebase";

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

const EXPENSE_LABEL = { Wishlist: "Target Wishlist" };

// Format YYYY-MM-DD menjadi DD/MM/YYYY untuk tampilan
const formatDisplayDate = (isoDateStr) => {
  if (!isoDateStr) return "DD/MM/YYYY";
  const [year, month, day] = isoDateStr.split("-");
  return `${day}/${month}/${year}`;
};

/* ---------- Pilihan segmen (tab & jenis transaksi) ---------- */
function Segment({ options, value, onChange }) {
  return (
    <div className="tile grid grid-cols-2 gap-1 rounded-2xl p-1">
      {options.map((opt) => {
        const active = value === opt.key;
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
              active ? opt.activeClass : "text-subtle hover:text-main"
            }`}
          >
            {Icon && <Icon size={14} className="shrink-0" />}
            <span className="whitespace-nowrap">{opt.label}</span>
            {opt.badge}
          </button>
        );
      })}
    </div>
  );
}

const PRO_BADGE = (
  <span className="flex items-center gap-1 rounded-md bg-linear-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-slate-950">
    <Crown className="h-2.5 w-2.5 fill-slate-950" />
    PRO
  </span>
);

const TAB_OPTIONS = [
  {
    key: "scan",
    label: "Scan struk (AI)",
    icon: Sparkles,
    badge: PRO_BADGE,
    activeClass: "btn-primary shadow-md",
  },
  {
    key: "manual",
    label: "Form manual",
    icon: FileText,
    activeClass: "btn-primary shadow-md",
  },
];

const TYPE_OPTIONS = [
  {
    key: "income",
    label: "Pemasukan",
    activeClass: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm",
  },
  {
    key: "expense",
    label: "Pengeluaran",
    activeClass: "bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-sm",
  },
];

/* ---------- Form ---------- */
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
  const hiddenDateInputRef = useRef(null);
  const abortControllerRef = useRef(null);

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

      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

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

  const categoryOptions = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-5">
      {/* Tab mode */}
      <Segment options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} />

      {/* TAB 1: SCAN STRUK AI */}
      {activeTab === "scan" && (
        <div className="tile flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-dashed p-6 text-center">
          {!isPro ? (
            <div className="flex flex-col items-center gap-4">
              <span className="chip flex h-14 w-14 items-center justify-center rounded-2xl text-amber-500">
                <Lock className="h-6 w-6" />
              </span>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-main">Fitur eksklusif ArusKas PRO</p>
                <p className="mx-auto max-w-[280px] text-xs leading-relaxed text-subtle">
                  Otomatis catat transaksi cukup dengan mengunggah foto struk belanja atau resi transfer.
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgradeClick}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <Crown className="h-3.5 w-3.5 fill-slate-950" />
                Upgrade ke Pro
              </button>
            </div>
          ) : scanning ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-semibold text-main">AI sedang membaca struk...</p>
              <p className="text-xs text-subtle">Estimasi 10–20 detik. Mengekstrak nominal, tanggal, dan keterangan.</p>
              <button
                type="button"
                onClick={handleCancelScan}
                className="mt-1 text-xs font-semibold text-rose-500 hover:underline"
              >
                Batalkan
              </button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer flex-col items-center gap-3">
              <span className="chip flex h-14 w-14 items-center justify-center rounded-2xl text-accent">
                <Upload className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-main">Unggah struk atau screenshot transfer</p>
                <p className="text-xs text-subtle">Format JPG atau PNG, maksimal 10 MB, dikompres otomatis.</p>
              </div>
              <span className="btn-primary mt-1 inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold">
                Pilih foto
              </span>
              <input type="file" accept="image/*" onChange={handleAIScan} className="hidden" />
            </label>
          )}
        </div>
      )}

      {/* TAB 2: FORM MANUAL */}
      {activeTab === "manual" && (
        <form ref={formRef} onSubmit={submit} className="space-y-5">
          <Segment
            options={TYPE_OPTIONS}
            value={type}
            onChange={(next) => {
              setType(next);
              setCategory("");
            }}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Kolom kiri: data */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-main">Tanggal</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => hiddenDateInputRef.current?.showPicker?.() || hiddenDateInputRef.current?.click()}
                      className="input-glass flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm"
                    >
                      <span>{formatDisplayDate(transactionDate)}</span>
                      <Calendar className="h-3.5 w-3.5 text-subtle" />
                    </button>
                    <input
                      ref={hiddenDateInputRef}
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-main">Nominal (Rp)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-main">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-glass w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-sm"
                  required
                >
                  <option value="" disabled>
                    -- Pilih kategori --
                  </option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {type === "expense" ? EXPENSE_LABEL[c] || c : c}
                    </option>
                  ))}
                </select>
              </div>

              {type === "expense" && category === "Wishlist" && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-amber-500">Target wishlist</label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="input-glass w-full cursor-pointer rounded-xl border-amber-500/30 px-3.5 py-2.5 text-sm"
                    required
                  >
                    <option value="" disabled>
                      -- Pilih goal wishlist --
                    </option>
                    {goals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <label className="mb-1.5 block text-xs font-semibold text-main">Catatan / keterangan</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis catatan transaksi..."
                  rows={3}
                  className="input-glass w-full flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Kolom kanan: bukti */}
            <div className="flex flex-col">
              <label className="mb-1.5 block text-xs font-semibold text-main">Bukti transaksi (opsional)</label>

              {imagePreview ? (
                <div className="group relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--glass-hover)]">
                  <img
                    src={imagePreview}
                    alt="Pratinjau bukti"
                    className="max-h-full max-w-full cursor-pointer object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                    onClick={() => onPreviewClick && onPreviewClick(imagePreview)}
                  />
                  <button
                    type="button"
                    onClick={() => onPreviewClick && onPreviewClick(imagePreview)}
                    className="btn-ghost absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Lihat penuh
                  </button>
                  <button
                    type="button"
                    aria-label="Hapus bukti"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-md transition hover:bg-rose-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="tile flex min-h-[200px] flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-dashed p-5 text-center transition hover:border-accent">
                  <span className="chip flex h-12 w-12 items-center justify-center rounded-2xl text-accent">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-main">Unggah struk atau bukti</p>
                    <p className="text-[11px] text-subtle">Format PNG atau JPG, maksimal 2 MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="btn-primary w-full rounded-xl py-3 text-sm font-semibold"
          >
            {uploading ? "Menyimpan..." : editingId ? "Perbarui transaksi" : "Simpan transaksi"}
          </button>
        </form>
      )}
    </div>
  );
}