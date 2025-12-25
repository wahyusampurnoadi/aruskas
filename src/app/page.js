"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl flex-grow flex flex-col justify-center">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Arus<span className="text-blue-500">Kas</span>
        </h1>

        <p className="mt-4 text-lg text-gray-400">
          Catat pemasukan, pengeluaran, dan investasi  
          <span className="text-white font-medium"> dengan simpel & aman</span>.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* LOGIN */}
          <button
            onClick={() => router.push("/login")}
            className="cursor-pointer px-8 py-4 rounded-xl bg-blue-600 
                       hover:bg-blue-700 hover:scale-105 
                       active:scale-95
                       text-white font-semibold transition-all duration-200
                       shadow-lg shadow-blue-600/30"
          >
            Login
          </button>

          {/* REGISTER */}
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer px-8 py-4 rounded-xl 
                       border border-gray-500 text-white
                       hover:bg-white hover:text-black hover:scale-105
                       active:scale-95
                       transition-all duration-200"
          >
            Daftar Gratis
          </button>
        </div>

        {/* Footer info text */}
        <p className="mt-8 text-sm text-gray-500">
          Gratis untuk fitur dasar • Upgrade kapan saja 🚀
        </p>
      </div>

      {/* --- COPYRIGHT SECTION --- */}
      <footer className="relative z-10 pb-8 text-gray-500 text-sm">
        <p>© 2025 made by <span className="text-gray-300 font-medium">Wahyu Sampurno Adi</span> with <span className="animate-pulse">💖</span></p>
      </footer>
    </div>
  );
}