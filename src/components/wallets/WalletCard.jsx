import {
  Wallet,
  Pencil,
  Trash2,
  Landmark,
  CreditCard,
  Banknote,
  TrendingUp,
  Bitcoin,
  Lock,
  FileText,
  PieChart,
  Building2,
} from "lucide-react";

const renderWalletIcon = (type) => {
  switch (type) {
    case "Bank":
      return <Landmark className="w-5 h-5" />;
    case "E-Wallet":
      return <CreditCard className="w-5 h-5" />;
    case "Cash":
      return <Banknote className="w-5 h-5" />;
    case "Saham":
      return <TrendingUp className="w-5 h-5" />;
    case "Crypto":
      return <Bitcoin className="w-5 h-5" />;
    case "Deposito":
      return <Lock className="w-5 h-5" />;
    case "Obligasi":
      return <FileText className="w-5 h-5" />;
    case "Reksadana":
      return <PieChart className="w-5 h-5" />;
    case "Properti":
      return <Building2 className="w-5 h-5" />;
    default:
      return <Wallet className="w-5 h-5" />;
  }
};

export default function WalletCard({ wallet, totalBalance, onEdit, onDelete }) {
  const percentage =
    totalBalance > 0
      ? ((wallet.balance / totalBalance) * 100).toFixed(1)
      : 0;

  return (
    <div
      className={`group relative rounded-3xl bg-slate-900/40 border border-white/10 ${wallet.theme.borderColor} ${wallet.theme.glowColor} p-6 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between shadow-xl overflow-hidden`}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${wallet.theme.iconBg} border shadow-md`}>
              {renderWalletIcon(wallet.type)}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${wallet.theme.badgeBg}`}>
                {wallet.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(wallet)}
              className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-all cursor-pointer"
              title="Edit Dompet"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(wallet.id)}
              className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition-all cursor-pointer"
              title="Hapus Dompet"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
          {wallet.name}
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-1 tracking-wider">
          {wallet.accountNumber}
        </p>
      </div>

      <div className="mt-8 pt-5 border-t border-white/5 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Saldo / Nilai Aset
          </span>
          <p className="text-2xl font-black text-white mt-1 tracking-tight">
            Rp {wallet.balance.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="text-slate-400">Alokasi Portfolio</span>
            <span className="text-white font-bold">{percentage}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${wallet.theme.barGradient} transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}