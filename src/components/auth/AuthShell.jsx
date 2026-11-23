"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wallet, ShieldCheck, Target, TrendingUp } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

// Ilustrasi kaca melayang (tanpa data nyata)
function HeroArt() {
  return (
    <div className="relative h-full w-full">
      {/* Cahaya latar */}
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute left-[12%] top-[14%] h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute bottom-[18%] right-[8%] h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"
      />

      {/* Kartu utama: cincin progres */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="glass-strong absolute left-[10%] top-[12%] w-[62%] rounded-3xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="chip flex h-10 w-10 items-center justify-center rounded-xl text-accent">
            <Target size={18} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-subtle">
            Target
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--track)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="314"
              strokeDashoffset="110"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="space-y-2.5">
            <div className="h-2.5 w-24 rounded-full bg-[var(--track)]" />
            <div className="h-2 w-16 rounded-full bg-[var(--track)] opacity-70" />
            <div className="h-2 w-20 rounded-full bg-[var(--track)] opacity-50" />
          </div>
        </div>
      </motion.div>

      {/* Kartu grafik garis */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="glass absolute bottom-[14%] right-[8%] w-[58%] rounded-3xl p-5"
      >
        <div className="flex items-center gap-2">
          <div className="chip flex h-8 w-8 items-center justify-center rounded-lg text-emerald-500">
            <TrendingUp size={15} />
          </div>
          <div className="h-2 w-20 rounded-full bg-[var(--track)]" />
        </div>
        <svg viewBox="0 0 220 70" className="mt-4 h-16 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 52 C 30 44, 55 58, 85 38 S 140 30, 165 20 S 200 26, 220 10 L220 70 L0 70 Z"
            fill="url(#lineFill)"
          />
          <path
            d="M0 52 C 30 44, 55 58, 85 38 S 140 30, 165 20 S 200 26, 220 10"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Ikon dompet melayang */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass absolute right-[12%] top-[8%] flex h-16 w-16 items-center justify-center rounded-2xl text-accent"
      >
        <Wallet size={26} />
      </motion.div>

      {/* Badge keamanan */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass absolute left-[6%] bottom-[44%] flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-main"
      >
        <ShieldCheck size={14} className="text-emerald-500" />
        Terenkripsi
      </motion.div>
    </div>
  );
}

export default function AuthShell({
  heroTitle,
  heroDescription,
  heading,
  subheading,
  footer,
  children,
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel form */}
      <div className="relative flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-aruskas.png"
              alt="Logo ArusKas"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="text-base font-extrabold tracking-tight text-main">
              Arus<span className="text-accent">Kas</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black tracking-tight text-main">{heading}</h1>
            <p className="mt-2 text-sm text-muted">{subheading}</p>

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
          </div>
        </div>

        <p className="text-center text-[11px] text-subtle">
          © 2026 ArusKas App • All rights reserved
        </p>
      </div>

      {/* Panel hero (desktop) */}
      <aside className="relative m-3 hidden overflow-hidden rounded-3xl lg:flex">
        <div className="glass-strong relative flex w-full flex-col overflow-hidden rounded-3xl">
          {/* Area ilustrasi */}
          <div className="relative flex-1 min-h-[420px]">
            <HeroArt />
          </div>

          {/* Teks hero */}
          <div className="relative border-t border-[var(--line)] p-10">
            <h2 className="max-w-md text-3xl font-black leading-tight tracking-tight text-main">
              {heroTitle}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {heroDescription}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}