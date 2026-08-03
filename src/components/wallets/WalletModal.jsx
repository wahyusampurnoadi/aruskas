import { X } from "lucide-react";

export default function WalletModal({
  isOpen,
  title,
  submitLabel,
  formData,
  setFormData,
  onSubmit,
  onClose,
  formatRupiahInput,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0b1329] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nama Dompet / Aset
            </label>
            <input
              type="text"
              placeholder="Contoh: BCA Utama, Bibit, Rumah BSD"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tipe Dompet / Kategori
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Cash">Cash / Tunai</option>
              <option value="Saham">Saham</option>
              <option value="Crypto">Crypto</option>
              <option value="Deposito">Deposito</option>
              <option value="Obligasi">Obligasi</option>
              <option value="Reksadana">Reksadana</option>
              <option value="Properti">Properti</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nomor Rekening / Keterangan Akun
            </label>
            <input
              type="text"
              placeholder="Opsional (No Rekening / RDN / Sub-Rekening)"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Saldo / Nilai Aset (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formData.balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: formatRupiahInput(e.target.value),
                })
              }
              required
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}