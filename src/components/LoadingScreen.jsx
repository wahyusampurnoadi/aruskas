"use client";

export default function LoadingScreen() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#020617] text-white">
        
        {/* LOGO */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl font-bold">
            Arus<span className="text-blue-500">Kas</span>
          </span>
        </div>
  
        {/* SPINNER */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
  
        {/* TEXT */}
        <p className="mt-6 text-sm text-gray-400 tracking-wide">
          Memuat dashboard keuangan...
        </p>
      </div>
    );
  }