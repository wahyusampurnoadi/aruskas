"use client";

import { Sparkles, RefreshCw, TrendingUp, Target, Wallet, Calendar } from "lucide-react";

const formatInputDisplay = (val) => {
  if (val === "" || val === null || val === undefined) return "";
  return new Intl.NumberFormat("id-ID").format(val);
};

function MoneyField({ icon: Icon, iconClass, label, badge, prefix, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-xs font-semibold text-main">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon size={14} className={iconClass} />}
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">{badge}</span>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-subtle">
          {prefix}
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-glass w-full rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold"
        />
      </div>
    </div>
  );
}

export default function Form({
  mode,
  targetAmount,
  setTargetAmount,
  currentSavings,
  setCurrentSavings,
  monthlyContribution,
  setMonthlyContribution,
  targetMonths,
  setTargetMonths,
  annualReturn,
  setAnnualReturn,
  onReset,
}) {
  const handleInputChange = (e, setter) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setter(rawValue === "" ? "" : parseInt(rawValue, 10));
  };

  const handlePercentChange = (e, setter) => {
    let val = e.target.value.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setter(val);
  };

  return (
    <section className="glass flex h-full flex-col rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
        <div className="flex items-center gap-3">
          <div className="chip flex h-10 w-10 items-center justify-center rounded-xl text-accent">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-main">Parameter simulasi</h2>
            <p className="text-[11px] text-subtle">Masukkan estimasi angka keuangan Anda</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="btn-ghost inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>

      {/* Field */}
      <div className="flex flex-1 flex-col justify-between gap-6 pt-6">
        <div className="space-y-6">
          <MoneyField
            icon={Target}
            iconClass="text-accent"
            label="Target dana impian"
            badge="Wajib diisi"
            prefix="Rp"
            placeholder="1.000.000.000"
            value={formatInputDisplay(targetAmount)}
            onChange={(e) => handleInputChange(e, setTargetAmount)}
          />

          <MoneyField
            icon={Wallet}
            iconClass="text-accent"
            label="Tabungan awal / modal saat ini"
            prefix="Rp"
            placeholder="500.000"
            value={formatInputDisplay(currentSavings)}
            onChange={(e) => handleInputChange(e, setCurrentSavings)}
          />

          {mode === "target" ? (
            <MoneyField
              icon={Wallet}
              iconClass="text-accent"
              label="Kemampuan tabungan rutin / bulan"
              prefix="Rp"
              placeholder="1.000.000"
              value={formatInputDisplay(monthlyContribution)}
              onChange={(e) => handleInputChange(e, setMonthlyContribution)}
            />
          ) : (
            <MoneyField
              icon={Calendar}
              iconClass="text-accent"
              label="Target waktu selesai"
              prefix="Bln"
              placeholder="12"
              value={formatInputDisplay(targetMonths)}
              onChange={(e) => handleInputChange(e, setTargetMonths)}
            />
          )}

          {/* Return investasi (opsional) */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-main">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" />
                Estimasi return investasi / tahun
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">Opsional</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Contoh: 6"
                value={annualReturn}
                onChange={(e) => handlePercentChange(e, setAnnualReturn)}
                className="input-glass w-full rounded-xl py-3.5 pl-4 pr-12 text-sm font-semibold"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-subtle">
                %
              </span>
            </div>
          </div>
        </div>

        <p className="rounded-2xl bg-[var(--glass-hover)] p-4 text-xs leading-relaxed text-muted">
          Isi target dan kemampuan menabung untuk melihat estimasi waktu. Return investasi bersifat opsional
          dan dihitung majemuk per bulan.
        </p>
      </div>
    </section>
  );
}