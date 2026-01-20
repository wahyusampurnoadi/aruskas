// investasi/ModalInvestasi.jsx
import { FaTimes } from "react-icons/fa";

export default function ModalInvestasi({
  isOpen,
  onClose,
  onSave,
  activeTab,
  formData,
  setFormData
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDASI UMUM
    if (!formData.name || !formData.amount) {
      alert("Nama dan modal wajib diisi");
      return;
    }

    // VALIDASI EMAS
    if (
      activeTab === "Emas" &&
      (!formData.grams || Number(formData.grams) <= 0)
    ) {
      alert("Jumlah emas (gram) wajib diisi");
      return;
    }

    // VALIDASI SAHAM
    if (
      activeTab === "Saham" &&
      (!formData.lots || Number(formData.lots) <= 0)
    ) {
      alert("Jumlah lot saham wajib diisi");
      return;
    }

    // ✅ VALIDASI CRYPTO (INI YANG BARU)
    if (
      activeTab === "Crypto" &&
      (!formData.coins || Number(formData.coins) <= 0)
    ) {
      alert("Jumlah coin crypto wajib diisi");
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold">Tambah {activeTab}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Nama Instrumen */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
              Nama Instrumen
            </label>
            <input
              required
              type="text"
              placeholder={
                activeTab === "Saham"
                  ? "BBCA"
                  : activeTab === "Crypto"
                  ? "Bitcoin"
                  : "DANA eMAS"
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* SYMBOL */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
              Symbol
            </label>
            <input
              required
              type="text"
              disabled={activeTab === "Emas"}
              placeholder={
                activeTab === "Saham"
                  ? "BBCA.JK"
                  : activeTab === "Crypto"
                  ? "bitcoin"
                  : "XAU"
              }
              className={`w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none
                ${
                  activeTab === "Emas"
                    ? "bg-white/10 border border-white/10 cursor-not-allowed"
                    : "bg-white/5 border border-white/10 focus:border-blue-500"
                }`}
              value={
                activeTab === "Emas"
                  ? "XAU"
                  : formData.symbol || ""
              }
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
            />
            <p className="text-[10px] text-gray-500 mt-1">
              {activeTab === "Saham" && "Contoh: BBCA.JK (Yahoo Finance)"}
              {activeTab === "Crypto" && "Contoh: bitcoin, ethereum (CoinGecko)"}
              {activeTab === "Emas" && "Harga emas global (XAU)"}
            </p>
          </div>

          {/* MODAL */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
              Harga Beli / Modal
            </label>
            <input
              required
              type="number"
              placeholder="Rp"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          {/* GRAM EMAS */}
          {activeTab === "Emas" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
                Jumlah Emas (gram)
              </label>
              <input
                required
                type="number"
                step="0.001"
                placeholder="Contoh: 0.215"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.grams || ""}
                onChange={(e) =>
                  setFormData({ ...formData, grams: e.target.value })
                }
              />
            </div>
          )}

          {/* ✅ JUMLAH COIN CRYPTO (BARU) */}
          {activeTab === "Crypto" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
                Jumlah Coin
              </label>
              <input
                required
                type="number"
                step="0.00000001"
                placeholder="Contoh: 0.007"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.coins || ""}
                onChange={(e) =>
                  setFormData({ ...formData, coins: e.target.value })
                }
              />
            </div>
          )}

          {/* LOT SAHAM */}
          {activeTab === "Saham" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest">
                Jumlah Lot
              </label>
              <input
                required
                type="number"
                placeholder="Contoh: 10"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.lots || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lots: e.target.value })
                }
              />
            </div>
          )}

          {/* INFO */}
          <div className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            Harga akan diperbarui otomatis (LIVE).  
            Tidak perlu input nilai saat ini.
          </div>

          {/* BUTTON */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition text-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition text-white"
            >
              Simpan Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
