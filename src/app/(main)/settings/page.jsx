"use client";

import { useState, useEffect } from "react";
import { User, Palette, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import * as XLSX from "xlsx-js-style";

import ProfileTab from "@/components/settings/ProfileTab";
import AppearanceTab from "@/components/settings/AppearanceTab";
import DataTab from "@/components/settings/DataTab";

export default function SettingsPage({ user: initialUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // State Profil User
  const [profile, setProfile] = useState({
    name: initialUser?.displayName || "",
    email: initialUser?.email || "",
    photoURL: initialUser?.photoURL || "",
  });

  // State Preferensi Tampilan (Membaca dari localStorage)
  const [hideBalanceByDefault, setHideBalanceByDefault] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hideBalanceByDefault") === "true";
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setProfile({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // FUNGSI TOGGLE PRIVASI SALDO (Simpan ke LocalStorage & Memicu Event Global)
  const handleToggleHideBalance = () => {
    const newValue = !hideBalanceByDefault;
    setHideBalanceByDefault(newValue);
    localStorage.setItem("hideBalanceByDefault", String(newValue));

    // Memicu event agar komponen lain (seperti Dashboard / Topbar) mendeteksi perubahan seketika
    window.dispatchEvent(new Event("storage_hide_balance"));

    if (newValue) {
      toast.success("Saldo utama disembunyikan secara default ✨");
    } else {
      toast.info("Saldo utama ditampilkan secara default");
    }
  };

  // FUNGSI EKSPOR EXCEL DENGAN BORDER & ALIGNMENT
  const handleExportExcel = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Pengguna tidak ditemukan");
      return;
    }

    setIsExporting(true);
    try {
      let docsList = [];

      // 1. Ambil data transaksi dari Firestore
      const q1 = query(
        collection(db, "transactions"),
        where("userId", "==", currentUser.uid)
      );
      const snap1 = await getDocs(q1);
      snap1.forEach((doc) => docsList.push(doc.data()));

      if (docsList.length === 0) {
        const q2 = query(
          collection(db, "transactions"),
          where("uid", "==", currentUser.uid)
        );
        const snap2 = await getDocs(q2);
        snap2.forEach((doc) => docsList.push(doc.data()));
      }

      if (docsList.length === 0) {
        const subColRef = collection(
          db,
          "users",
          currentUser.uid,
          "transactions"
        );
        const snap3 = await getDocs(subColRef);
        snap3.forEach((doc) => docsList.push(doc.data()));
      }

      if (docsList.length === 0) {
        toast.info("Tidak ada data transaksi untuk diekspor");
        return;
      }

      // Helper function konversi tanggal
      const parseToDate = (targetDate) => {
        if (!targetDate) return new Date(0);
        if (typeof targetDate.toDate === "function") return targetDate.toDate();
        if (targetDate.seconds) return new Date(targetDate.seconds * 1000);
        const parsed = new Date(targetDate);
        return isNaN(parsed.getTime()) ? new Date(0) : parsed;
      };

      // 2. URUTKAN DATA DARI TANGGAL TERBARU KE TERLAMA
      docsList.sort((a, b) => {
        const dateA = parseToDate(a.date || a.transactionDate || a.createdAt);
        const dateB = parseToDate(b.date || b.transactionDate || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // 3. SUSUN SHEET DATA DENGAN BARIS PEMBATAS BULAN
      const rows = [];
      let currentMonthYear = "";
      const merges = [];
      const monthHeaderRows = [];

      docsList.forEach((data) => {
        const dateObj = parseToDate(
          data.date || data.transactionDate || data.createdAt
        );

        if (dateObj.getTime() !== 0) {
          const monthYear = dateObj
            .toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })
            .toUpperCase();

          if (monthYear !== currentMonthYear) {
            currentMonthYear = monthYear;

            // Baris kosong pemisah antar bulan
            if (rows.length > 0) {
              rows.push({
                Tanggal: "",
                Kategori: "",
                Tipe: "",
                Jumlah: "",
                Catatan: "",
              });
            }

            const headerRowIdx = rows.length + 1; // +1 untuk baris header tabel utama
            monthHeaderRows.push(headerRowIdx);

            merges.push({
              s: { r: headerRowIdx, c: 0 },
              e: { r: headerRowIdx, c: 4 },
            });

            rows.push({
              Tanggal: `=== ${currentMonthYear} ===`,
              Kategori: "",
              Tipe: "",
              Jumlah: "",
              Catatan: "",
            });
          }
        }

        const formattedDate =
          dateObj.getTime() !== 0
            ? dateObj.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "-";

        rows.push({
          Tanggal: formattedDate,
          Kategori: data.category || "-",
          Tipe: data.type === "income" ? "Pemasukan" : "Pengeluaran",
          Jumlah: data.amount || 0,
          Catatan: data.note || "-",
        });
      });

      // 4. Generate Worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);

      if (merges.length > 0) {
        worksheet["!merges"] = merges;
      }

      // Lebar kolom
      worksheet["!cols"] = [
        { wch: 22 }, // Tanggal / Header Bulan
        { wch: 25 }, // Kategori
        { wch: 16 }, // Tipe
        { wch: 18 }, // Jumlah
        { wch: 45 }, // Catatan
      ];

      // Definisikan Style Border Tipis
      const thinBorder = {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } },
      };

      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

      // Apply Style ke Semua Sel
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { t: "s", v: "" };
          }

          const cell = worksheet[cellAddress];

          // Header Utama Tabel (Baris 1)
          if (R === 0) {
            cell.s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "0F172A" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: thinBorder,
            };
            continue;
          }

          // Header Bulan
          if (monthHeaderRows.includes(R)) {
            cell.s = {
              font: { bold: true, color: { rgb: "0F766E" } },
              fill: { fgColor: { rgb: "CCFBF1" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: thinBorder,
            };
            continue;
          }

          // Data Transaksi
          cell.s = {
            border: thinBorder,
            alignment: {
              vertical: "center",
              horizontal: C === 4 ? "left" : "center", // Catatan Rata Kiri, sisanya Rata Tengah
            },
          };
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");

      XLSX.writeFile(
        workbook,
        `ArusKas_Riwayat_Transaksi_${Date.now()}.xlsx`
      );

      toast.success("Berhasil mengekspor data transaksi! ✨");
    } catch (error) {
      console.error("Gagal ekspor Excel:", error);
      toast.error("Gagal mengekspor data: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // FUNGSI RESET DATA (Placeholder)
  const handleResetData = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus seluruh data transaksi? Aksi ini tidak dapat dibatalkan!"
      )
    ) {
      toast.error("Fitur reset data belum dihubungkan ke database.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: profile.name,
          photoURL: profile.photoURL || "",
        });

        await currentUser.reload();
        toast.success("Profil berhasil diperbarui ✨");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil & Akun", icon: User },
    { id: "appearance", label: "Tampilan & Privasi", icon: Palette },
    { id: "data", label: "Data & Keamanan", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen text-white p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Pengaturan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola profil akun, tampilan aplikasi, dan keamanan data ArusKas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              onSave={handleSaveProfile}
              isLoading={loading}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceTab
              hideBalanceByDefault={hideBalanceByDefault}
              setHideBalanceByDefault={handleToggleHideBalance}
            />
          )}

          {activeTab === "data" && (
            <DataTab
              onExport={handleExportExcel}
              onReset={handleResetData}
              isExporting={isExporting}
            />
          )}
        </div>
      </div>
    </div>
  );
}