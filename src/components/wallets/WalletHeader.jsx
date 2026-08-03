import { Sparkles, Plus, TrendingUp, Wallet } from "lucide-react";

export default function WalletHeader({ totalBalance, totalWallets, onOpenAddModal }) {
  return (
    <div className="relative w-full rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Wallet Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Kelola Dompet & Aset
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Atur dan pantau semua aliran dana dari bank, e-wallet, hingga investasi seperti saham, crypto, dan properti.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dompet</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Seluruh Saldo & Aset
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              Aktif
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Rp {totalBalance.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Akumulasi saldo terhitung dari seluruh dompet & instrumen investasi terhubung.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Status Alokasi
            </span>
            <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 tracking-tight">
              {totalWallets} Akun / Aset Aktif
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Tersedia untuk transaksi harian dan portofolio investasi.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Wallet className="w-7 h-7" />
          </div>
        </div>
      </div>
    </div>
  );
}