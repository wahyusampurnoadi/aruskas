export function formatCurrency(amount, currency = "IDR") {
  const num = Number(amount) || 0;
  
  let convertedAmount = num;
  let locale = "id-ID";
  let curr = "IDR";

  // Asumsi data asli di database dalam bentuk Rupiah (IDR)
  // Lakukan konversi jika mata uang bukan IDR
  if (currency === "USD") {
    const exchangeRateUSD = 16000; // Sesuaikan kurs USD saat ini (misal 1 USD = Rp 16.000)
    convertedAmount = num / exchangeRateUSD;
    locale = "en-US";
    curr = "USD";
  } else if (currency === "EUR") {
    const exchangeRateEUR = 17500; // Sesuaikan kurs EUR
    convertedAmount = num / exchangeRateEUR;
    locale = "de-DE";
    curr = "EUR";
  } else if (currency === "GBP") {
    const exchangeRateGBP = 20000; // Sesuaikan kurs GBP
    convertedAmount = num / exchangeRateGBP;
    locale = "en-GB";
    curr = "GBP";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
    maximumFractionDigits: currency === "IDR" ? 0 : 2, // USD/EUR biasanya pakai 2 angka dibelakang koma
  }).format(convertedAmount);
}