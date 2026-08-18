import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Inisialisasi Firebase Admin SDK (Server-side Only)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

// Helper function untuk penundaan waktu (delay)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req) {
  try {
    // 1. Verifikasi Token Autentikasi User dari Client
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Akses ditolak. Token autentikasi tidak ditemukan!" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (authError) {
      return Response.json(
        { error: "Akses ditolak. Token tidak valid atau kedaluwarsa!" },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid;

    // 2. Verifikasi Status Pro Langsung dari Firestore Server (Anti-Bypass Client)
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const isPro = userDoc.exists && userDoc.data()?.isPro === true;

    if (!isPro) {
      return Response.json(
        { error: "Akses ditolak. Fitur Scan Struk AI khusus untuk pengguna ArusKas Pro!" },
        { status: 403 }
      );
    }

    // 3. Proses File Gambar Struk
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "File gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY belum terpasang di environment variable server" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const promptText = `Analisis gambar resi transfer / struk ini. Kembalikan HANYA JSON murni tanpa markdown/formatting.

Format JSON Wajib:
{
  "amount": 250000,
  "merchantName": "Nama pengirim / deskripsi singkat",
  "date": "YYYY-MM-DD",
  "type": "income",
  "category": "Freelance"
}

ATURAN EKSTRAKSI:
1. "amount": Cari nominal angka utama. Hapus "Rp", titik, atau koma. Kirim ANGKA MURNI.
2. "type": Kirim "income" jika transfer masuk/penerimaan uang/gaji. Kirim "expense" jika pembayaran/belanja.
3. "category": Pilih dari ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya'] jika income. Pilih dari ['Makanan & Minuman', 'Transportasi', 'Belanja', 'Tagihan & Utilitas', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Wishlist', 'Lainnya'] jika expense.
4. "merchantName": Catat nama pengirim/penerima atau deskripsi transaksi.
5. "date": Format YYYY-MM-DD. Jika tidak terlihat, gunakan tanggal hari ini: ${new Date().toISOString().split("T")[0]}.`;

    let response = null;
    let retries = 3;
    let delay = 2000;

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        });
        
        break; 
      } catch (err) {
        const isUnavailable =
          err?.status === 503 ||
          err?.message?.includes("503") ||
          err?.message?.includes("high demand") ||
          err?.message?.includes("UNAVAILABLE");

        retries--;

        if (isUnavailable && retries > 0) {
          console.warn(`[Gemini API 503] Server sibuk. Mencoba ulang dalam ${delay / 1000}s... (Sisa retry: ${retries})`);
          await sleep(delay);
          delay *= 1.5;
        } else {
          throw err;
        }
      }
    }

    const rawText = response?.text || "";
    let cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];

    let parsedData = {};
    try {
      parsedData = JSON.parse(cleanJson || "{}");
    } catch {
      parsedData = {};
    }

    const finalAmount = parseInt(String(parsedData.amount || 0).replace(/[^0-9]/g, ""), 10) || 0;

    return Response.json({
      success: true,
      data: {
        amount: finalAmount,
        merchantName: parsedData.merchantName || "Transaksi Baru",
        date: parsedData.date || new Date().toISOString().split("T")[0],
        type: parsedData.type || "income",
        category: parsedData.category || "Lainnya",
      },
    });
  } catch (error) {
    console.error("API Error Scan Receipt:", error);

    const isHighDemand =
      error?.status === 503 ||
      error?.message?.includes("503") ||
      error?.message?.includes("high demand");

    return Response.json(
      {
        error: isHighDemand
          ? "Server AI sedang mengalami lonjakan beban. Silakan coba beberapa saat lagi."
          : error.message || "Gagal memproses gambar pada server",
      },
      { status: error?.status || 500 }
    );
  }
}