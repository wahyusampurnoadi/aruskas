"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Instagram,
  Wallet,
  Target,
  ShieldCheck,
  PenLine,
  LineChart,
  Sparkles,
  Zap,
  Lock,
  Check,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const MARQUEE_ITEMS = [
  "Catat",
  "Pantau",
  "Capai",
  "Realtime",
  "Wishlist",
  "Estimasi cerdas",
  "Aman & privat",
  "Grafik periode",
];

const FEATURES = [
  {
    key: "realtime",
    icon: Wallet,
    title: "Arus kas realtime",
    short: "Transaksi langsung terlihat.",
    desc: "Catat pemasukan dan pengeluaran dalam hitungan detik, lalu lihat dampaknya pada ringkasan dan grafik periodemu.",
    points: ["Input cepat dengan kategori", "Filter bulanan atau rentang tanggal", "Ekspor laporan ke Excel dan PDF"],
    tone: "from-cyan-400 to-blue-500",
  },
  {
    key: "target",
    icon: Target,
    title: "Target tabungan",
    short: "Impian punya jalur jelas.",
    desc: "Tambahkan impian ke wishlist, lalu biarkan ArusKas menghitung berapa lama lagi atau berapa yang perlu ditabung tiap bulan.",
    points: ["Simulasi waktu tercapai", "Hitung tabungan rutin per bulan", "Progres target yang mudah dipantau"],
    tone: "from-emerald-400 to-teal-500",
  },
  {
    key: "secure",
    icon: ShieldCheck,
    title: "Keamanan data",
    short: "Hanya kamu yang bisa melihat.",
    desc: "Setiap akun terpisah dan data hanya bisa diakses setelah masuk. Datamu tidak ditampilkan di halaman publik.",
    points: ["Akun dilindungi kata sandi", "Data terpisah per pengguna", "Tidak ada angka nyata di halaman publik"],
    tone: "from-indigo-400 to-purple-500",
  },
];

const STEPS = [
  { icon: PenLine, title: "Catat", desc: "Input transaksi dalam hitungan detik." },
  { icon: LineChart, title: "Pantau", desc: "Lihat ringkasan dan grafik periodemu." },
  { icon: Target, title: "Capai", desc: "Atur target dan biarkan estimasinya dihitung." },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] py-4 sm:py-5">
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap sm:gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-subtle sm:gap-10 sm:text-sm sm:tracking-[0.25em]"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* Fitur: di HP chip horizontal, di desktop daftar vertikal */
function FeatureShowcase() {
  const [active, setActive] = useState(FEATURES[0].key);
  const current = FEATURES.find((f) => f.key === active);
  const Icon = current.icon;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-subtle sm:text-xs">Fitur utama</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-main sm:mt-3 sm:text-4xl">
          Semua yang kamu butuhkan, <span className="text-gradient">tanpa yang berlebihan.</span>
        </h2>

        {/* Mobile: chip horizontal */}
        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          {FEATURES.map((f) => {
            const isActive = f.key === active;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive ? "btn-primary" : "tile text-muted"
                }`}
              >
                {f.title}
              </button>
            );
          })}
        </div>

        {/* Desktop: daftar vertikal */}
        <div className="mt-8 hidden space-y-2 lg:block">
          {FEATURES.map((f) => {
            const FIcon = f.icon;
            const isActive = f.key === active;
            return (
              <button
                key={f.key}
                type="button"
                onMouseEnter={() => setActive(f.key)}
                onFocus={() => setActive(f.key)}
                onClick={() => setActive(f.key)}
                className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                  isActive ? "glass" : "hover:bg-[var(--glass-hover)]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive ? `text-on-accent bg-linear-to-br ${f.tone}` : "chip text-subtle"
                  }`}
                >
                  <FIcon size={18} />
                </span>
                <span className="flex-1">
                  <span className={`block text-base font-bold ${isActive ? "text-main" : "text-muted"}`}>
                    {f.title}
                  </span>
                  <span className="block text-xs text-subtle">{f.short}</span>
                </span>
                <ArrowRight
                  size={16}
                  className={`shrink-0 transition-all duration-300 ${
                    isActive ? "translate-x-0 text-accent opacity-100" : "-translate-x-2 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative lg:col-span-7">
        <div
          aria-hidden
          className="animate-float-a pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        />
        <div className="glass-strong relative min-h-[260px] overflow-hidden rounded-[24px] p-6 sm:min-h-[360px] sm:rounded-[28px] sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex h-full flex-col"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${current.tone} text-on-accent shadow-xl sm:h-16 sm:w-16`}
              >
                <Icon size={22} className="sm:hidden" />
                <Icon size={28} className="hidden sm:block" />
              </div>

              <h3 className="mt-6 text-xl font-black tracking-tight text-main sm:mt-8 sm:text-3xl">{current.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">{current.desc}</p>

              <ul className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
                {current.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm font-medium text-main">
                    <span className="chip flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-accent">
                      <Check size={13} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* Cara kerja: daftar vertikal di HP, tiga kolom di layar lebih besar */
function Timeline() {
  return (
    <div className="relative">
      {/* Garis penghubung vertikal (HP) */}
      <div className="absolute bottom-6 left-6 top-6 w-px bg-[var(--line)] sm:hidden" />
      {/* Garis penghubung horizontal (desktop) */}
      <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent sm:block" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              {...fadeUp(i * 0.12)}
              className="relative flex items-start gap-4 sm:flex-col sm:items-start sm:gap-0"
            >
              <div className="relative z-10 flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-0">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-accent">
                  <Icon size={18} />
                </span>
              </div>
              <div className="min-w-0 pt-1 sm:mt-5 sm:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-subtle">0{i + 1}</span>
                  <p className="text-base font-bold text-main sm:text-xl">{s.title}</p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted sm:mt-2 sm:max-w-xs">{s.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* Pratinjau antarmuka tanpa data nyata */
function AppPreview() {
  const navItems = [LayoutDashboard, Wallet, Target, Settings];

  return (
    <motion.div {...fadeUp(0)} className="relative">
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="glass-strong relative overflow-hidden rounded-[24px] sm:rounded-[28px]">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3 sm:px-5 sm:py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="tile ml-4 hidden h-6 flex-1 max-w-xs rounded-lg sm:block" />
        </div>

        <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[160px_1fr]">
          <aside className="flex flex-col gap-2 border-r border-[var(--line)] p-2.5 sm:p-4">
            <div className="mb-1 h-7 w-7 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 sm:mb-2 sm:h-8 sm:w-8" />
            {navItems.map((Icon, i) => (
              <span
                key={i}
                className={`flex h-8 items-center justify-center rounded-lg sm:h-9 sm:justify-start sm:gap-3 sm:rounded-xl sm:px-3 ${
                  i === 0 ? "nav-active" : "text-subtle"
                }`}
              >
                <Icon size={15} />
                <span className="hidden h-1.5 w-14 rounded-full bg-[var(--track)] sm:block" />
              </span>
            ))}
          </aside>

          <div className="space-y-3 p-3 sm:space-y-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="tile rounded-xl p-3 sm:rounded-2xl sm:p-4">
                  <div className="h-2 w-10 rounded-full bg-[var(--track)] sm:w-12" />
                  <div className="mt-2.5 h-3.5 w-16 rounded-md bg-[var(--track)] sm:mt-3 sm:h-4 sm:w-20" />
                </div>
              ))}
            </div>

            <div className="tile rounded-xl p-3 sm:rounded-2xl sm:p-4">
              <div className="flex items-center justify-between">
                <div className="h-2 w-14 rounded-full bg-[var(--track)] sm:w-16" />
                <div className="h-2 w-8 rounded-full bg-[var(--track)]" />
              </div>
              <svg viewBox="0 0 300 90" className="mt-3 h-16 w-full sm:mt-4 sm:h-20" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="previewFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 70 C 40 60, 60 78, 100 52 S 170 40, 200 30 S 260 22, 300 12 L300 90 L0 90 Z"
                  fill="url(#previewFill)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
                <motion.path
                  d="M0 70 C 40 60, 60 78, 100 52 S 170 40, 200 30 S 260 22, 300 12"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3">
                  <span className="chip h-7 w-7 shrink-0 rounded-lg sm:h-8 sm:w-8" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-2/5 rounded-full bg-[var(--track)]" />
                    <div className="h-1.5 w-1/4 rounded-full bg-[var(--track)] opacity-60" />
                  </div>
                  <div className="h-2 w-8 rounded-full bg-[var(--track)] sm:w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-5 lg:gap-14">
      <motion.div {...fadeUp(0)} className="lg:col-span-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-subtle sm:text-xs">Lihat sekilas</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-main sm:mt-3 sm:text-4xl">
          Tampilan yang tenang, <span className="text-gradient">fokus pada angkamu.</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
          Sidebar sederhana, kartu yang rapi, dan grafik yang langsung menunjukkan arah keuanganmu.
        </p>
      </motion.div>

      <div className="lg:col-span-3">
        <AppPreview />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute -top-40 left-[8%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/25 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute top-[40%] -right-40 h-[24rem] w-[24rem] rounded-full bg-indigo-500/20 blur-3xl sm:h-[32rem] sm:w-[32rem]"
      />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-aruskas.png"
              alt="Logo ArusKas"
              width={28}
              height={28}
              className="h-7 w-7 object-contain sm:h-[30px] sm:w-[30px]"
              priority
            />
            <span className="text-sm font-extrabold tracking-tight text-main sm:text-base">
              Arus<span className="text-accent">Kas</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-muted transition hover:text-main sm:inline-flex"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary inline-flex items-center rounded-xl px-3.5 py-2 text-xs font-semibold sm:px-4 sm:text-sm"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-accent sm:gap-2 sm:px-4 sm:text-xs"
        >
          <Sparkles size={12} />
          Aplikasi pencatat keuangan pribadi
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-main sm:mt-8 sm:text-7xl"
        >
          Arus uang kamu,
          <br />
          <span className="text-gradient">lebih terarah.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-6 sm:text-lg"
        >
          Catat arus kas, atur tabungan, dan wujudkan impianmu dengan cara yang sederhana, aman, dan realtime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:w-auto sm:flex-row"
        >
          <Link
            href="/register"
            className="btn-primary group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold sm:w-auto"
          >
            Mulai gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="btn-ghost inline-flex w-full items-center justify-center rounded-2xl px-7 py-3.5 text-sm font-semibold sm:w-auto"
          >
            Saya sudah punya akun
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-subtle sm:mt-12 sm:gap-x-6 sm:text-xs"
        >
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-accent" /> Ringan & cepat</span>
          <span className="flex items-center gap-1.5"><Lock size={12} className="text-accent" /> Data privat</span>
          <span className="flex items-center gap-1.5"><LineChart size={12} className="text-accent" /> Grafik otomatis</span>
        </motion.div>
      </main>

      {/* MARQUEE */}
      <motion.div {...fadeUp(0)} className="relative z-10">
        <Marquee />
      </motion.div>

      {/* FITUR */}
      <motion.section {...fadeUp(0)} className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <FeatureShowcase />
      </motion.section>

      {/* CARA KERJA */}
      <motion.section {...fadeUp(0)} className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-16 sm:px-6 sm:pb-24">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-subtle sm:text-xs">
          Cara kerja
        </p>
        <h2 className="mx-auto mt-2 max-w-md text-center text-2xl font-black tracking-tight text-main sm:mt-3 sm:text-4xl">
          Tiga langkah menuju kebiasaan yang lebih sehat.
        </h2>
        <div className="mt-8 sm:mt-16">
          <Timeline />
        </div>
      </motion.section>

      {/* PRATINJAU ANTARMUKA */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24">
        <PreviewSection />
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-auto px-5 pb-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-[11px] text-subtle sm:flex-row sm:gap-4 sm:pt-8 sm:text-xs">
          <p className="font-mono uppercase tracking-widest">ArusKas App • v2.0</p>
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            Developed by
            <a
              href="https://instagram.com/wahyu_smprna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
            >
              <Instagram className="h-3.5 w-3.5" />
              @wahyu_smprna
            </a>
          </p>
          <p>© 2026 Wahyu Sampurno Adi</p>
        </div>
      </footer>
    </div>
  );
}