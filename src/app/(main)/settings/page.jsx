"use client";

import { useState, useEffect } from "react";
import { User, Palette, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ProfileTab from "@/components/settings/ProfileTab";
import AppearanceTab from "@/components/settings/AppearanceTab";
import DataTab from "@/components/settings/DataTab";

export default function SettingsPage({ user: initialUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // State Profil User
  const [profile, setProfile] = useState({
    name: initialUser?.displayName || "",
    email: initialUser?.email || "",
  });

  // State Preferensi Tampilan
  const [hideBalanceByDefault, setHideBalanceByDefault] = useState(false);

  // Mendengarkan perubahan state Auth agar data terisi otomatis
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setProfile({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Simpan Perubahan Profil ke Firebase Auth
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
        });

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

  // Daftar Tab Sidebar Settings (Preferensi Keuangan telah dihapus)
  const tabs = [
    {
      id: "profile",
      label: "Profil & Akun",
      icon: User,
    },
    {
      id: "appearance",
      label: "Tampilan & Privasi",
      icon: Palette,
    },
    {
      id: "data",
      label: "Data & Keamanan",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen text-white p-4 md:p-6 lg:p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Pengaturan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola profil akun, tampilan aplikasi, dan keamanan data ArusKas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR NAVIGATION SETTINGS */}
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

        {/* CONTENT AREA */}
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
              setHideBalanceByDefault={setHideBalanceByDefault}
            />
          )}

          {activeTab === "data" && <DataTab />}
        </div>
      </div>
    </div>
  );
}