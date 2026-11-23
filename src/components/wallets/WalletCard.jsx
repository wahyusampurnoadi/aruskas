"use client";

import { motion } from "framer-motion";
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
  const cls = "h-5 w-5";
  switch (type) {
    case "Bank": return <Landmark className={cls} />;
    case "E-Wallet": return <CreditCard className={cls} />;
    case "Cash": return <Banknote className={cls} />;
    case "Saham": return <TrendingUp className={cls} />;
    case "Crypto": return <Bitcoin className={cls} />;
    case "Deposito": return <Lock className={cls} />;
    case "Obligasi": return <FileText className={cls} />;
    case "Reksadana": return <PieChart className={cls} />;
    case "Properti": return <Building2 className={cls} />;
    default: return <Wallet className={cls} />;
  }
};

export default function WalletCard({ wallet, totalBalance, onEdit, onDelete }) {
  const share = totalBalance > 0 ? (wallet.balance / totalBalance) * 100 : 0;
  const theme = wallet.theme;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition duration-300 hover:-translate-y-1"
    >
      {/* Garis aksen atas */}
      <div className={`absolute inset-x-0 top-0 h-1 ${theme.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.icon}`}>
            {renderWalletIcon(wallet.type)}
          </span>
          <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${theme.badge}`}>
            {theme.label}
          </span>
        </div>

        {/* Aksi: selalu terlihat */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onEdit(wallet)}
            title="Edit dompet"
            aria-label="Edit dompet"
            className="btn-icon inline-flex h-8 w-8 items-center justify-center rounded-lg"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(wallet.id)}
            title="Hapus dompet"
            aria-label="Hapus dompet"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <h3 className="truncate text-lg font-bold tracking-tight text-main">{wallet.name}</h3>
        <p className="mt-1 truncate font-mono text-xs tracking-wider text-subtle">{wallet.accountNumber}</p>
      </div>

      <div className="mt-auto pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle">Saldo / nilai aset</p>
        <p className="mt-1.5 break-words text-2xl font-black tracking-tight text-main">
          Rp {wallet.balance.toLocaleString("id-ID")}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="text-subtle">Alokasi portofolio</span>
            <span className="font-bold text-main">{share.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--track)]">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${theme.bar}`}
              style={{ width: `${Math.min(share, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}