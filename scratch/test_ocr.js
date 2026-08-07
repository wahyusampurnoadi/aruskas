const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function parseReceiptText(ocrText) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
  Berikut adalah teks mentah hasil OCR dari bukti transfer/struk pembayaran/screenshot e-wallet:

  """
  ${ocrText}
  """

  Tugasmu: Ekstrak informasi penting dari teks tersebut dan kembalikan HANYA JSON MURNI (tanpa markdown \`\`\`json):
  {
    "amount": 100000,
    "merchantName": "Nama Toko / Penerima",
    "date": "YYYY-MM-DD",
    "type": "expense",
    "category": "Kategori"
  }

  Aturan Ekstraksi:
  - "amount": Angka nominal transaksi total (tanpa titik, tanpa Rp, tanpa koma). Cari angka utama seperti Rp 100.000 -> 100000.
  - "merchantName": Nama penerima transfer, toko, atau nama layanan. Jika transfer bank, tulis misal "Transfer BCA - NamaPenerima".
  - "type": "expense" (jika pengeluaran/transfer keluar) atau "income" (jika transfer masuk/gaji/cashback).
  - "date": Tanggal transaksi format YYYY-MM-DD. Jika tidak ada, gunakan tanggal hari ini.
  - "category": Pilih salah satu yang paling cocok dari: ['Makanan & Minuman', 'Transportasi', 'Belanja', 'Tagihan & Utilitas', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya'].
  `;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }]
  });

  const rawText = completion.choices[0].message.content.replace(/```json|```/g, "").trim();
  return JSON.parse(rawText);
}

// Simulated OCR Text from Bukti Transfer 100.000
const sampleTransferText = `
Bukti Transfer
BCA Mobile
Nominal: Rp 100.000
Ke: Wahyu Sampurno
No Rekening: 1234567890
Tanggal: 07/08/2026
Status: Berhasil
`;

parseReceiptText(sampleTransferText).then((res) => {
  console.log("Parsed Result:", res);
});
