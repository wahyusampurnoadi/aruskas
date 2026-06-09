"use client";

import React, { useMemo } from 'react';

export default function FinancialTips() {
    const tips = [
      "Simpan minimal 20% dari pendapatanmu untuk tabungan masa depan.",
      "Jangan membeli barang yang tidak kamu butuhkan hanya karena sedang diskon.",
      "Catat setiap pengeluaran kecil, karena yang kecil bisa menjadi besar.",
      "Gunakan rumus 50/30/20: 50% Kebutuhan, 30% Keinginan, 20% Tabungan.",
      "Evaluasi langganan bulananmu, hapus yang sudah tidak digunakan.",
      "Dana darurat minimal adalah 3-6 kali pengeluaran bulananmu.",
      "Berinvestasilah pada leher ke atas (ilmu) sebelum berinvestasi pada aset.",
      "Hutang konsumtif adalah pencuri kebahagiaan masa depanmu."
    ];
  
    // Mengambil satu tips secara acak
    const randomTip = useMemo(() => {
      return tips[Math.floor(Math.random() * tips.length)];
    }, []);
  
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400">💡</span>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Tips Keuangan
          </h3>
        </div>
        <p className="text-gray-200 text-sm italic leading-relaxed">
          "{randomTip}"
        </p>
      </div>
    );
  }