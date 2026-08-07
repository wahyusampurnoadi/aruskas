import Groq from "groq-sdk";
import Tesseract from "tesseract.js";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "File gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Ekstraksi teks dari gambar menggunakan Tesseract.js OCR
    let ocrText = "";
    try {
      const { data } = await Tesseract.recognize(buffer, "ind+eng");
      ocrText = data.text || "";
    } catch (ocrError) {
      console.warn("Tesseract OCR gagal:", ocrError.message);
    }

    // 2. Ekstraksi menggunakan AI Groq Llama-3.3-70b-versatile jika GROQ_API_KEY tersedia
    const apiKey = process.env.GROQ_API_KEY;
    let extractedData = null;

    if (apiKey && ocrText.trim().length > 0) {
      try {
        const groq = new Groq({ apiKey });

        const prompt = `
Berikut adalah teks hasil ekstraksi OCR dari bukti transfer/struk pembayaran/screenshot e-wallet/bon belanja:

"""
${ocrText}
"""

Tugasmu adalah menganalisis teks di atas dan mengekstrak data keuangan berikut menjadi JSON MURNI (tanpa format markdown \`\`\`json):

{
  "amount": 100000,
  "merchantName": "Nama Toko / Penerima / Bank",
  "date": "YYYY-MM-DD",
  "type": "expense",
  "category": "Kategori"
}

Aturan Ekstraksi Presisi:
- "amount": Nominal total transaksi angka saja tanpa titik/koma/Rp. (misal: "Rp 100.000" atau "100.000" -> 100000). Cari angka terbesar yang merepresentasikan total pembayaran / transfer.
- "merchantName": Nama toko, merchant, penerima transfer, atau bank. Jika bukti transfer, buat ringkas misal "Transfer BCA - NamaPenerima" atau "Transfer Ke NamaPenerima".
- "type": "expense" jika pengeluaran/transfer keluar, "income" jika pemasukan/gaji/transfer masuk.
- "date": Format tanggal YYYY-MM-DD dari struk. Jika tanggal tidak ditemukan di teks, gunakan tanggal hari ini: ${new Date().toISOString().split("T")[0]}.
- "category": WAJIB pilih salah satu kategori yang paling sesuai dari daftar berikut:
  ['Makanan & Minuman', 'Transportasi', 'Belanja', 'Tagihan & Utilitas', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya'].
  - Jika struk makanan/warung/cafe/kopi/resto -> 'Makanan & Minuman'
  - Jika bukti transfer bank/e-wallet/rekening/listrik/wifi -> 'Tagihan & Utilitas' atau 'Belanja'
  - Jika bensin/spbu/gojek/grab/parkir -> 'Transportasi'
  - Jika minimarket/indomaret/alfamart/tokopedia/shopee -> 'Belanja'
`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        });

        const rawJsonText = completion.choices[0]?.message?.content
          ?.replace(/```json|```/g, "")
          ?.trim();

        if (rawJsonText) {
          extractedData = JSON.parse(rawJsonText);
        }
      } catch (aiError) {
        console.warn("Groq AI Parsing Gagal, menggunakan Smart Regex fallback:", aiError.message);
      }
    }

    // 3. Fallback Smart Regex Parser jika AI tidak mengembalikan data
    if (!extractedData || !extractedData.amount) {
      extractedData = parseSmartRegex(ocrText);
    }

    // Pastikan nominal valid
    if (extractedData && extractedData.amount) {
      extractedData.amount = Math.abs(Number(extractedData.amount)) || 0;
    }

    return Response.json({
      success: true,
      data: extractedData,
      rawOcrText: ocrText.slice(0, 300),
    });
  } catch (error) {
    console.error("Scan Receipt Error:", error);
    return Response.json(
      { error: error.message || "Gagal memproses gambar struk" },
      { status: 500 }
    );
  }
}

/**
 * Smart Regex Parser untuk membaca nominal, kategori, dan deskripsi dari teks OCR
 */
function parseSmartRegex(text) {
  const cleanText = text || "";
  const lowerText = cleanText.toLowerCase();

  // 1. Ekstraksi Nominal (Cari angka nominal terbesar seperti Rp 100.000 atau 100.000)
  let detectedAmount = 0;

  // Pattern A: Rp 100.000 / Rp100.000 / IDR 100.000
  const rpMatches = [...cleanText.matchAll(/(?:rp|idr)\s*[\.:]?\s*([0-9]{1,3}(?:\.[0-9]{3})+|[0-9]+)/gi)];
  for (const match of rpMatches) {
    const rawNum = match[1].replace(/\./g, "").replace(/,/g, "");
    const val = parseInt(rawNum, 10);
    if (!isNaN(val) && val > detectedAmount) {
      detectedAmount = val;
    }
  }

  // Pattern B: Angka berformat ribuan umum (misal: 100.000 atau 50.000)
  if (detectedAmount === 0) {
    const numMatches = [...cleanText.matchAll(/\b([0-9]{1,3}(?:\.[0-9]{3})+)\b/g)];
    for (const match of numMatches) {
      const rawNum = match[1].replace(/\./g, "");
      const val = parseInt(rawNum, 10);
      if (!isNaN(val) && val > 500 && val > detectedAmount) {
        detectedAmount = val;
      }
    }
  }

  // 2. Deteksi Kategori
  let category = "Lainnya";
  let type = "expense";

  if (
    lowerText.includes("transfer") ||
    lowerText.includes("bca") ||
    lowerText.includes("bri") ||
    lowerText.includes("mandiri") ||
    lowerText.includes("gopay") ||
    lowerText.includes("ovo") ||
    lowerText.includes("dana") ||
    lowerText.includes("shopeepay")
  ) {
    category = "Tagihan & Utilitas";
  } else if (
    lowerText.includes("resto") ||
    lowerText.includes("makan") ||
    lowerText.includes("kopi") ||
    lowerText.includes("bakso") ||
    lowerText.includes("ayam") ||
    lowerText.includes("cafe") ||
    lowerText.includes("warung") ||
    lowerText.includes("food")
  ) {
    category = "Makanan & Minuman";
  } else if (
    lowerText.includes("spbu") ||
    lowerText.includes("pertamina") ||
    lowerText.includes("gojek") ||
    lowerText.includes("grab") ||
    lowerText.includes("bensin") ||
    lowerText.includes("parkir")
  ) {
    category = "Transportasi";
  } else if (
    lowerText.includes("indomaret") ||
    lowerText.includes("alfamart") ||
    lowerText.includes("tokopedia") ||
    lowerText.includes("shopee") ||
    lowerText.includes("supermarket") ||
    lowerText.includes("toko")
  ) {
    category = "Belanja";
  }

  // 3. Deteksi Nama Merchant / Penerima
  let merchantName = "Struk / Transfer Terdeteksi";
  
  // Cari baris dengan "Ke:" atau "Penerima:" atau "Nama:"
  const recipientMatch = cleanText.match(/(?:ke|penerima|tujuan|nama|merchant)\s*[\.:]?\s*([A-Za-z0-9\s]{3,30})/i);
  if (recipientMatch && recipientMatch[1]) {
    merchantName = `Transfer - ${recipientMatch[1].trim()}`;
  } else if (lowerText.includes("bca")) {
    merchantName = "Transfer Bank BCA";
  } else if (lowerText.includes("gopay")) {
    merchantName = "Transaksi GoPay";
  } else if (lowerText.includes("ovo")) {
    merchantName = "Transaksi OVO";
  } else if (lowerText.includes("dana")) {
    merchantName = "Transaksi DANA";
  }

  return {
    amount: detectedAmount || 0,
    merchantName,
    date: new Date().toISOString().split("T")[0],
    type,
    category,
  };
}