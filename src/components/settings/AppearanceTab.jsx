"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, Palette } from "lucide-react";
import { toast } from "sonner";

export default function AppearanceTab({
  hideBalanceByDefault = false,
  setHideBalanceByDefault = () => {},
}) {
  const [currency, setCurrency] = useState("IDR");

  // Membaca mata uang tersimpan di localStorage saat komponen dimuat
  useEffect(() => {
    const savedCurrency = localStorage.getItem("app_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Handler untuk merubah mata uang & memicu sinkronisasi global
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("app_currency", newCurrency);

    // Memicu custom event agar komponen lain ter-update secara real-time
    window.dispatchEvent(new Event("currencyChange"));

    toast.success(`Mata uang utama diubah ke ${newCurrency} ✨`);
  };

  const currencyOptions = [
    { code: "IDR", symbol: "Rp", label: "Rupiah (IDR)" },
    { code: "USD", symbol: "$", label: "Dollar (USD)" },
    { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER TAB */}
      <h2 className="text-xl font-bold border-b border-white/10 pb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-cyan-400" />
        <span>Tampilan & Privasi</span>
      </h2>

      {/* PENGATURAN MATA UANG */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Mata Uang Utama
        </label>
        <p className="text-xs text-slate-400">
          Pilih mata uang default yang akan digunakan di seluruh modul catatan dan laporan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {currencyOptions.map((item) => {
            const isSelected = currency === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleCurrencyChange(item.code)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-cyan-600/20 border-cyan-500 text-cyan-400 font-bold shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {item.symbol}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIVASI SALDO */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Pengaturan Privasi
        </label>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-white/5">
          <div>
            <p className="text-sm font-semibold text-white">
              Sembunyikan Saldo Utama
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Sembunyikan angka saldo secara otomatis saat membuka aplikasi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHideBalanceByDefault(!hideBalanceByDefault)}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              hideBalanceByDefault
                ? "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {hideBalanceByDefault ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}