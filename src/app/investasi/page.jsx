"use client";

import { useState, useMemo, useEffect } from "react";
import { FaChartPie, FaPlus, FaBitcoin, FaGem, FaBuilding, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import ModalInvestasi from "./ModalInvestasi";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "@/components/LoadingScreen";

const Avatar = ({ name }) => (
  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border border-white/20">
    {name ? name.charAt(0).toUpperCase() : "?"}
  </div>
);

export default function InvestasiPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. STATE HOOKS
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Saham");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", amount: "", currentVal: "" });
  
  const [investments, setInvestments] = useState([
    { id: 1, name: "BBCA", type: "Saham", amount: 5000000, currentVal: 5500000 },
    { id: 2, name: "ANTAM", type: "Emas", amount: 2000000, currentVal: 2100000 },
    { id: 3, name: "Bitcoin", type: "Crypto", amount: 3000000, currentVal: 3450000 },
    { id: 4, name: "ASII", type: "Saham", amount: 3000000, currentVal: 2800000 },
    { id: 5, name: "Ethereum", type: "Crypto", amount: 1500000, currentVal: 1800000 },
  ]);

  // 2. EFFECT HOOKS
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("my_investments");
    if (savedData) {
      setInvestments(JSON.parse(savedData));
    }
  }, []);
  
  useEffect(() => {
    if (investments.length > 0) {
      localStorage.setItem("my_investments", JSON.stringify(investments));
    }
  }, [investments]);

  // 3. LOGIC HANDLERS
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleSaveInvestment = () => {
    if (!formData.name || !formData.amount || !formData.currentVal) {
      alert("Mohon isi semua data!");
      return;
    }
    if (editingId) {
      setInvestments(prev => 
        prev.map(inv => 
          inv.id === editingId 
            ? { ...inv, name: formData.name, amount: parseInt(formData.amount), currentVal: parseInt(formData.currentVal) }
            : inv
        )
      );
    } else {
      const newEntry = {
        id: Date.now(),
        name: formData.name,
        type: activeTab,
        amount: parseInt(formData.amount),
        currentVal: parseInt(formData.currentVal),
      };
      setInvestments(prev => [...prev, newEntry]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", amount: "", currentVal: "" });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus aset ini?")) {
      setInvestments(investments.filter(inv => inv.id !== id));
    }
  };

  const handleEdit = (inv) => {
    setEditingId(inv.id);
    setFormData({ name: inv.name, amount: inv.amount, currentVal: inv.currentVal });
    setIsModalOpen(true);
  };

  const filteredInvestments = investments.filter(inv => inv.type === activeTab);

  // 4. MEMO HOOK
  const stats = useMemo(() => {
    const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0);
    const totalCurrent = investments.reduce((sum, item) => sum + item.currentVal, 0);
    const getValByType = (type) => investments.filter(i => i.type === type).reduce((sum, item) => sum + item.currentVal, 0);

    return {
      totalInvested,
      totalCurrent,
      totalProfit: totalCurrent - totalInvested,
      profitPercentage: totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0,
      allocation: {
        saham: totalCurrent > 0 ? (getValByType("Saham") / totalCurrent) * 100 : 0,
        emas: totalCurrent > 0 ? (getValByType("Emas") / totalCurrent) * 100 : 0,
        crypto: totalCurrent > 0 ? (getValByType("Crypto") / totalCurrent) * 100 : 0,
      }
    };
  }, [investments]);

  // 5. CONDITIONAL RENDER (Harus setelah semua Hook terpanggil)
  if (loading) return <LoadingScreen />;

  // 6. MAIN RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl bg-black/40 border-white/10 shadow-lg" : "bg-transparent border-transparent"} border-b`}>
        <div className="max-w-7xl mx-auto p-5 px-8 md:px-12 flex justify-between items-center">
          <h1 className="font-bold text-xl flex items-center gap-2"> 
            <img src="/logo-aruskas.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span>Arus<span className="text-blue-500">Kas</span></span>
          </h1>

          <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <Link href="/dashboard" className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname === "/dashboard" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}>
              🏠 Dashboard
              {pathname === "/dashboard" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-blue-500 rounded-full"></span>}
            </Link>
            <Link href="/investasi" className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname === "/investasi" ? "text-blue-400" : "text-gray-400 hover:text-white"}`}>
              📈 Investasi
              {pathname === "/investasi" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-blue-500 rounded-full"></span>}
            </Link>
          </nav>            

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar name={user?.displayName || user?.email} />
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold">{user?.displayName || "User"}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm cursor-pointer font-medium">Logout</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 space-y-8 pb-32 md:pb-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Investasi<span className="text-blue-500">Ku</span></h2>
          <p className="text-gray-400 text-sm">Kelola portofolio aset investasimu berdasarkan kategori.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-xs font-medium uppercase">Total Modal</p>
            <h3 className="text-white text-2xl font-bold mt-1">Rp {stats.totalInvested.toLocaleString("id-ID")}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-xs font-medium uppercase">Nilai Saat Ini</p>
            <h3 className="text-blue-400 text-2xl font-bold mt-1">Rp {stats.totalCurrent.toLocaleString("id-ID")}</h3>
          </div>
          <div className={`bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl border-l-4 ${stats.totalProfit >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <p className="text-gray-400 text-xs font-medium uppercase">Total Profit/Loss</p>
            <h3 className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{stats.profitPercentage.toFixed(2)}%
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
              {[{ name: "Saham", icon: <FaBuilding /> }, { name: "Emas", icon: <FaGem /> }, { name: "Crypto", icon: <FaBitcoin /> }].map((tab) => (
                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer transition ${activeTab === tab.name ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-bold">Rincian Aset {activeTab}</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer">
                  <FaPlus size={10} /> Tambah {activeTab}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Instrumen</th>
                      <th className="px-6 py-4 text-center">Value</th>
                      <th className="px-6 py-4 text-center">Return</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInvestments.length > 0 ? filteredInvestments.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-white/[0.03] transition">
                        <td className="px-6 py-4 font-bold">{inv.name}</td>
                        <td className="px-6 py-4 text-center">Rp {inv.currentVal.toLocaleString("id-ID")}</td>
                        <td className={`px-6 py-4 text-center font-bold ${inv.currentVal - inv.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>{((inv.currentVal - inv.amount) / inv.amount * 100).toFixed(1)}%</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100">
                            <button onClick={() => handleEdit(inv)} className="p-2 hover:text-blue-400 cursor-pointer"><FaEdit /></button>
                            <button onClick={() => handleDelete(inv.id)} className="p-2 hover:text-red-400 cursor-pointer"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">Belum ada data {activeTab}.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><FaChartPie className="text-purple-500" /> Alokasi</h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
              {[
                { label: "Saham", val: stats.allocation.saham, color: "bg-blue-500", icon: <FaBuilding className="text-blue-500"/> },
                { label: "Emas", val: stats.allocation.emas, color: "bg-yellow-500", icon: <FaGem className="text-yellow-500"/> },
                { label: "Crypto", val: stats.allocation.crypto, color: "bg-orange-500", icon: <FaBitcoin className="text-orange-500"/> }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-gray-400">{item.icon} {item.label}</span>
                    <span>{item.val.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full transition-all`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <div className="bg-black/60 backdrop-blur-lg border border-white/10 p-2 rounded-2xl flex justify-around items-center shadow-2xl">
          
          {/* Tombol Dashboard */}
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/dashboard" 
                ? "bg-blue-500/10 text-blue-500" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
          </Link>
          
          {/* Tombol Investasi */}
          <Link 
            href="/investasi" 
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/investasi" 
                ? "bg-blue-500/10 text-blue-500" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-xl">📈</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Investasi</span>
          </Link>

        </div>
      </div>

      <ModalInvestasi isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveInvestment} activeTab={activeTab} formData={formData} setFormData={setFormData} />
    </div>
  );
}