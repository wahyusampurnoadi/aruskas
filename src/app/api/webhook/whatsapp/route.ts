import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// Inisialisasi Google Gen AI Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Interface Data Transaksi
interface TransactionData {
  type: 'pengeluaran' | 'pemasukan';
  amount: number;
  category: string;
  description: string;
  payment_method: string;
}

export async function POST(req: Request) {
  try {
    // 1. Ambil data Form Data dari Fonnte
    const formData = await req.formData();
    
    const sender = formData.get('sender') as string;   // Nomor WA Pengirim (contoh: 08123456789)
    const message = formData.get('message') as string; // Pesan Teks
    const isGroup = formData.get('isGroup') === 'true'; // Cek apakah pesan dari grup

    // Abaikan jika pesan kosong atau berasal dari grup WA
    if (!message || isGroup) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    console.log(`[WA Incoming] From: ${sender} | Message: "${message}"`);

    // 2. Extrak data transaksi menggunakan Gemini AI
    const parsedData = await parseTransactionWithGemini(message);

    // 3. Jika AI gagal mengekstrak (bukan teks transaksi atau nominal 0/null)
    if (!parsedData || !parsedData.amount || parsedData.amount <= 0) {
      const warningMsg = 
        '⚠️ *Format Transaksi Tidak Terdeteksi*\n\n' +
        'Silakan ketik dengan kalimat biasa, contoh:\n' +
        '• _"Beli kopi kenangan 15rb pakai QRIS"_\n' +
        '• _"Dapat gaji bulanan 5jt via transfer BCA"_';

      await sendFonnteReply(sender, warningMsg);
      return NextResponse.json({ status: 'unparsed' }, { status: 200 });
    }

    // 4. SIMPAN KE DATABASE (Tambahkan logic database Anda di sini)
    // Contoh:
    // await db.collection('transactions').add({
    //   ...parsedData,
    //   userPhone: sender,
    //   createdAt: new Date(),
    // });

    // 5. Format dan Kirim Balasan Sukses ke WA
    const replyText = 
      `✅ *Transaksi Berhasil Dicatat!*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• *Tipe:* ${parsedData.type === 'pemasukan' ? '🟢 Pemasukan' : '🔴 Pengeluaran'}\n` +
      `• *Nominal:* Rp${parsedData.amount.toLocaleString('id-ID')}\n` +
      `• *Kategori:* ${parsedData.category}\n` +
      `• *Keterangan:* ${parsedData.description}\n` +
      `• *Metode:* ${parsedData.payment_method}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `_Catatan berhasil disimpan ke ArusKas._`;

    await sendFonnteReply(sender, replyText);

    return NextResponse.json({ status: 'success', data: parsedData }, { status: 200 });

  } catch (error) {
    console.error('Error Webhook WhatsApp:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Fungsi untuk ekstraksi pesan menggunakan Gemini API (Structured Output)
 */
async function parseTransactionWithGemini(text: string): Promise<TransactionData | null> {
  try {
    const todayDate = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analisis dan ekstrak data transaksi dari kalimat ini: "${text}". ` +
                `Hari ini adalah tanggal ${todayDate}. ` +
                `Jika kalimat tersebut bukan merupakan pencatatan uang/transaksi, set amount menjadi 0.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              enum: ['pengeluaran', 'pemasukan'],
              description: 'Jenis transaksi, pengeluaran atau pemasukan' 
            },
            amount: { 
              type: Type.NUMBER, 
              description: 'Nominal transaksi dalam angka bersih tanpa huruf/titik/koma (misal 15000)' 
            },
            category: { 
              type: Type.STRING, 
              description: 'Kategori transaksi. Contoh: Makanan & Minuman, Transportasi, Belanja, Tagihan, Gaji, Lainnya' 
            },
            description: { 
              type: Type.STRING, 
              description: 'Rincian atau nama tempat/barang transaksi' 
            },
            payment_method: { 
              type: Type.STRING, 
              description: 'Metode pembayaran yang digunakan (misal: QRIS, Cash, Transfer, BCA, GoPay, dll). Default: Cash' 
            },
          },
          required: ['type', 'amount', 'category', 'description', 'payment_method'],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TransactionData;
    }

    return null;
  } catch (err) {
    console.error('Gemini AI Error:', err);
    return null;
  }
}

/**
 * Fungsi untuk mengirim pesan balasan via Fonnte API
 */
async function sendFonnteReply(targetPhone: string, messageText: string) {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.error('FONNTE_TOKEN belum diisi di environment variables!');
    return;
  }

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: targetPhone,
        message: messageText,
      }),
    });

    const result = await res.json();
    console.log('[Fonnte Response]:', result);
  } catch (err) {
    console.error('Fonnte Send API Error:', err);
  }
}