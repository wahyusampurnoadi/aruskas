"use client";

import { Calculator as CalcIcon, Sparkles } from "lucide-react";

const MODES = [
  { key: "target", label: "Hitung estimasi waktu" },
  { key: "monthly", label: "Hitung tabungan bulanan" },
];

export default function Header({ mode, setMode }) {
  return (
    <header className="glass relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl p-6 sm:p-8 md:flex-row md:items-center">
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <div className="relative z-10 space-y-3">
        <span className="chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-accent">
          <CalcIcon size={14} />
          Simulasi & perencanaan
          <Sparkles size={12} />
        </span>

        <h1 className="text-2xl font-black tracking-tight text-main sm:text-3xl lg:text-4xl">
          Kalkulator <span className="text-gradient">finansial</span>
        </h1>

        <p className="max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
          Simulasikan target tabungan dan waktu pencapaian dana impian Anda secara presisi.
        </p>
      </div>

      {/* Switcher mode */}
      <div className="tile relative z-10 flex w-full gap-1 self-start rounded-2xl p-1.5 md:w-auto md:self-auto">
        {MODES.map((m) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 md:flex-none ${
                active ? "btn-primary" : "nav-item"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}