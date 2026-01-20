"use client";

import { useState, useMemo, useEffect } from "react";
import { FaChartPie, FaPlus, FaBitcoin, FaGem, FaBuilding, FaEdit, FaTrash, FaPiggyBank } from 'react-icons/fa';
import Link from 'next/link';
import ModalInvestasi from "./ModalInvestasi";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import useLivePrice from "@/app/hooks/useLivePrice";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import LoadingScreen from "@/components/LoadingScreen";

const Avatar = ({ name }) => (
  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border border-white/20">
    {name ? name.charAt(0).toUpperCase() : "?"}
  </div>
);

export default function InvestasiPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Saham");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    amount: "",
    grams: "",
    coins: "",
    lots: ""
  });  
  const [investments, setInvestments] = useState([]);
  const [showNav, setShowNav] = useState(true);

  async function migrateCryptoData(userId) {
    const q = query(
      collection(db, "investments"),
      where("userId", "==", userId),
      where("type", "==", "Crypto")
    );
  
    const snap = await getDocs(q);
  
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
  
      // Skip jika sudah benar
      if (data.coins && data.coins > 0) continue;
  
      // Wajib ada amount & basePrice
      if (!data.amount || !data.basePrice) continue;
  
      // Hitung jumlah coin dari modal
      const coins = data.amount / data.basePrice;
  
      await updateDoc(doc(db, "investments", docSnap.id), {
        coins: Number(coins.toFixed(8)),
        lastUpdated: new Date()
      });
    }
  }  

  async function migrateGoldData(userId) {
    const snap = await getDocs(
      query(
        collection(db, "investments"),
        where("userId", "==", userId),
        where("type", "==", "Emas")
      )
    );
  
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
  
      // Skip jika sudah benar
      if (data.grams) continue;
  
      // Estimasi gram dari modal & basePrice
      if (data.amount && data.basePrice) {
        const estimatedGrams = data.amount / data.basePrice;
  
        await updateDoc(doc(db, "investments", docSnap.id), {
          grams: Number(estimatedGrams.toFixed(3)),
          lastUpdated: new Date()
        });
      }
    }
  }

  useEffect(() => {
  if (user) {
    migrateCryptoData(user.uid);
  }
}, [user]);

  useEffect(() => {
    if (user) {
      migrateGoldData(user.uid);
    }
  }, [user]);
  

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
    let timeoutId;
  
    const handleScroll = () => {
      // 1. Logika untuk background header (scrolled)
      setScrolled(window.scrollY > 10);
  
      // 2. Logika Auto-Hide Navigasi Mobile
      setShowNav(true); // Munculkan kembali saat scroll
      
      // Reset timer setiap kali ada aktivitas scroll
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowNav(false); // Sembunyikan setelah 4 detik tidak ada aktivitas
      }, 1200);
    };
  
    window.addEventListener("scroll", handleScroll);
    
    // Inisialisasi timer pertama kali saat halaman dimuat
    timeoutId = setTimeout(() => setShowNav(false), 2500);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "investments"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(data);
    });
    return () => unsubscribe();
  }, [user]);

  useLivePrice(investments);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleSaveInvestment = async () => {
    if (!formData.name || !formData.amount) {
      alert("Data belum lengkap");
      return;
    }
  
    const payload = {
      name: formData.name,
      type: activeTab,
      amount: Number(formData.amount),
      userId: user.uid,
      lastUpdated: serverTimestamp()
    };
  
    if (activeTab === "Saham") {
      payload.lots = Number(formData.lots);
    }
  
    if (activeTab === "Emas") {
      payload.symbol = "XAU";
      payload.grams = Number(formData.grams);
    }
  
    if (activeTab === "Crypto") {
      payload.symbol = formData.symbol.toLowerCase();
      payload.coins = Number(formData.coins);
    }
  
    try {
      if (editingId) {
        // ✅ EDIT
        await updateDoc(doc(db, "investments", editingId), payload);
      } else {
        // ➕ TAMBAH BARU
        payload.currentVal = 0;
        await addDoc(collection(db, "investments"), payload);
      }
  
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        symbol: "",
        amount: "",
        grams: "",
        coins: "",
        lots: ""
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus aset ini?")) {
      try {
        await deleteDoc(doc(db, "investments", id));
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleEdit = (inv) => {
    setEditingId(inv.id);
    setActiveTab(inv.type);
    setFormData({
      name: inv.name || "",
      symbol: inv.symbol || "",
      amount: inv.amount || "",
      grams: inv.grams || "",
      coins: inv.coins || "",
      lots: inv.lots || ""
    });
    setIsModalOpen(true);
  };
  

  const filteredInvestments = investments.filter(inv => inv.type === activeTab);
  const totalValuePerAsset = filteredInvestments.reduce((sum, inv) => sum + (inv.currentVal || 0), 0);

  const stats = useMemo(() => {
    const totalInvested = investments.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalCurrent = investments.reduce((sum, item) => sum + (item.currentVal || 0), 0);
    const getValByType = (type) => investments.filter(i => i.type === type).reduce((sum, item) => sum + (item.currentVal || 0), 0);
    return {
      totalInvested,
      totalCurrent,
      totalProfit: totalCurrent - totalInvested,
      profitPercentage: totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0,
      allocation: {
        saham: totalCurrent > 0 ? (getValByType("Saham") / totalCurrent) * 100 : 0,
        emas: totalCurrent > 0 ? (getValByType("Emas") / totalCurrent) * 100 : 0,
        crypto: totalCurrent > 0 ? (getValByType("Crypto") / totalCurrent) * 100 : 0,
        deposito: totalCurrent > 0 ? (getValByType("Deposito") / totalCurrent) * 100 : 0,
      }
    };
  }, [investments]);

  if (loading) return <LoadingScreen />;

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

      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-10 space-y-8 pb-32 md:pb-10">
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
          <div className={`bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl border-l-4 ${stats.totalProfit >= 0 ? 'border-l-green-500' : 'border-l-red-500'} flex flex-col justify-between`}>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Profit/Loss</p>
          
          {/* Container untuk Persen dan Rupiah di satu baris */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            {/* Persentase Besar */}
            <h3 className={`text-2xl md:text-3xl font-extrabold leading-none ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{stats.profitPercentage.toFixed(2)}%
            </h3>
            
            {/* Nominal Rupiah di Sebelahnya */}
            <p className={`text-sm md:text-base font-semibold leading-none ${stats.totalProfit >= 0 ? 'text-green-500/80' : 'text-red-500/80'}`}>
              ({stats.totalProfit >= 0 ? '+' : '-'} Rp {Math.abs(stats.totalProfit).toLocaleString("id-ID")})
            </p>
          </div>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full overflow-x-auto no-scrollbar">
              {[
                { name: "Saham", icon: <FaBuilding /> }, 
                { name: "Emas", icon: <FaGem /> }, 
                { name: "Crypto", icon: <FaBitcoin /> },
                { name: "Deposito", icon: <FaPiggyBank /> }
              ].map((tab) => (
                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer transition whitespace-nowrap ${activeTab === tab.name ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                <h2 className="text-sm md:text-lg font-bold">Rincian {activeTab}</h2>
                <p className="text-[10px] md:text-xs text-blue-400 font-medium">
                  Total: Rp {totalValuePerAsset.toLocaleString("id-ID")}
                </p>
                </div>
                <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    symbol: "",
                    amount: "",
                    grams: "",
                    coins: "",
                    lots: ""
                  });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] md:text-xs font-bold transition cursor-pointer"
              >
                <FaPlus size={10} /> Tambah <span className="hidden sm:inline">{activeTab}</span>
              </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[9px] md:text-[10px] tracking-widest">
                    <tr>
                      <th className="px-3 py-4 md:px-6">Instrumen</th>
                      <th className="px-2 py-4 md:px-6 text-center">Value</th>
                      <th className="px-2 py-4 md:px-6 text-center">Return</th>
                      <th className="px-3 py-4 md:px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInvestments.length > 0 ? filteredInvestments.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-white/[0.03] transition">
                        <td className="px-3 py-4 md:px-6 font-bold text-xs md:text-sm max-w-[80px] md:max-w-none truncate">{inv.name}
                        {/* SAHAM */}
                        {inv.type === "Saham" && inv.lots && (
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                            {inv.lots} lot
                          </div>
                        )}

                        {/* EMAS */}
                        {inv.type === "Emas" && inv.grams && (
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                            {inv.grams} gram
                          </div>
                        )}

                        {/* ✅ CRYPTO (INI NO. 3) */}
                        {inv.type === "Crypto" && inv.coins && (
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                            {inv.coins} {inv.symbol?.toUpperCase()}
                          </div>
                        )}    
                        </td>
                        <td className="px-2 py-4 md:px-6 text-center text-[11px] md:text-sm whitespace-nowrap">{/* Baris Atas: Nilai Saat Ini */}
                          <div className="text-[11px] md:text-sm">
                            Rp {inv.currentVal?.toLocaleString("id-ID")}
                          </div>
                          
                          {/* Baris Bawah: Nominal Profit/Loss */}
                          <div className={`text-[9px] md:text-[10px] mt-0.5 font-medium ${
                            inv.currentVal - inv.amount >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {inv.currentVal - inv.amount >= 0 ? '+' : '-'} 
                            Rp {Math.abs(inv.currentVal - inv.amount).toLocaleString("id-ID")}
                          </div></td>
                        <td className={`px-2 py-4 md:px-6 text-center font-bold text-[11px] md:text-sm ${inv.currentVal - inv.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>{((inv.currentVal - inv.amount) / inv.amount * 100).toFixed(1)}%</td>
                        <td className="px-3 py-4 md:px-6 text-right">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <button onClick={() => handleEdit(inv)} className="p-2 hover:text-blue-400 cursor-pointer"><FaEdit size={14}/></button>
                            <button onClick={() => handleDelete(inv.id)} className="p-2 hover:text-red-400 cursor-pointer"><FaTrash size={14}/></button>
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
                { label: "Crypto", val: stats.allocation.crypto, color: "bg-orange-500", icon: <FaBitcoin className="text-orange-500"/> },
                { label: "Deposito", val: stats.allocation.deposito, color: "bg-emerald-500", icon: <FaPiggyBank className="text-emerald-500"/> }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-gray-400">{item.icon} {item.label}</span>
                    <span>{item.val.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] transition-all duration-500 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}>
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 p-2 rounded-2xl flex justify-around items-center shadow-2xl">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/dashboard" ? "bg-blue-500/10 text-blue-500" : "text-gray-400"
            }`}>
              <span className="text-xl">🏠</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
            </Link>
            
            <Link href="/investasi" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              pathname === "/investasi" ? "bg-blue-500/10 text-blue-500" : "text-gray-400"
            }`}>
              <span className="text-xl">📈</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Investasi</span>
            </Link>
          </div>
        </div>

      <ModalInvestasi isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveInvestment} activeTab={activeTab} formData={formData} setFormData={setFormData} />
    </div>
  );
}