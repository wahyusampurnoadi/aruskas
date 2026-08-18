// lib/utils.js

/**
 * Format angka ke format mata uang (IDR, USD, EUR, GBP)
 */
export function formatCurrency(amount, currency = "IDR") {
  const num = Number(amount) || 0;

  let convertedAmount = num;
  let locale = "id-ID";
  let curr = "IDR";

  // Asumsi data asli di database dalam bentuk Rupiah (IDR)
  // Lakukan konversi jika mata uang bukan IDR
  if (currency === "USD") {
    const exchangeRateUSD = 16000; // Kurs USD (1 USD = Rp 16.000)
    convertedAmount = num / exchangeRateUSD;
    locale = "en-US";
    curr = "USD";
  } else if (currency === "EUR") {
    const exchangeRateEUR = 17500; // Kurs EUR
    convertedAmount = num / exchangeRateEUR;
    locale = "de-DE";
    curr = "EUR";
  } else if (currency === "GBP") {
    const exchangeRateGBP = 20000; // Kurs GBP
    convertedAmount = num / exchangeRateGBP;
    locale = "en-GB";
    curr = "GBP";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(convertedAmount);
}

/**
 * Memotong dan kompresi gambar di browser sebelum diunggah ke Groq AI API
 */
export async function cropAndCompressImage(file, cropArea = null) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.src = objectUrl;

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Gunakan koordinat crop jika ada, jika tidak ambil 100% dimensi gambar
      const width = cropArea?.width || image.width;
      const height = cropArea?.height || image.height;
      const x = cropArea?.x || 0;
      const y = cropArea?.y || 0;

      canvas.width = width;
      canvas.height = height;

      // Render ulang gambar pada area canvas
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Gagal mengolah gambar"));
          const processedFile = new File([blob], file.name, {
            type: file.type || "image/png",
          });
          resolve(processedFile);
        },
        file.type || "image/png",
        0.92 // Kualitas gambar 92% agar tajam dibaca Vision AI
      );
    };

    image.onerror = (err) => reject(err);
  });
}