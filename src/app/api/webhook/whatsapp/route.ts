import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
// @ts-ignore
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface TransactionData {
  type: 'pengeluaran' | 'pemasukan';
  amount: number;
  category: string;
  description: string;
  payment_method: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const sender = body.sender || body.pengirim;   // Nomor WA Pengirim
    const message = body.message || body.pesan;     // Teks Pesan
    const isGroup = body.isGroup === true || body.isGroup === 'true';

    if (!message || isGroup) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    console.log(`[WA Incoming] From: ${sender} | Message: "${message}"`);

    // 1. Parse Teks menggunakan Gemini AI
    const parsedData = await parseTransactionWithGemini(message);

    if (!parsedData || !parsedData.amount || parsedData.amount <= 0) {
      await sendFonnteReply(
        sender, 
        '⚠️ *Format Transaksi Tidak Terdeteksi*\n\nContoh: _"Beli nasi goreng 20rb di abang-abang"_'
      );
      return NextResponse.json({ status: 'unparsed' }, { status: 200 });
    }

    // 2. Simpan Data Transaksi ke Firebase Firestore
    try {
      await addDoc(collection(db, 'transactions'), {
        type: parsedData.type,
        amount: parsedData.amount,
        category: parsedData.category,
        description: parsedData.description,
        paymentMethod: parsedData.payment_method,
        senderPhone: sender,
        source: 'whatsapp',
        createdAt: serverTimestamp(),
      });
      console.log('✅ Data berhasil disimpan ke Firestore!');
    } catch (dbError) {
      console.error('❌ Gagal menyimpan ke Firestore:', dbError);
    }

    // 3. Kirim Balasan ke WhatsApp User
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

async function parseTransactionWithGemini(text: string): Promise<TransactionData | null> {
  try {
    const todayDate = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analisis dan ekstrak data transaksi dari kalimat ini: "${text}". Hari ini tanggal ${todayDate}. Jika bukan transaksi, set amount ke 0.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['pengeluaran', 'pemasukan'] },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            payment_method: { type: Type.STRING },
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

async function sendFonnteReply(targetPhone: string, messageText: string) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) return;

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: token },
      body: new URLSearchParams({
        target: targetPhone,
        message: messageText,
      }),
    });
  } catch (err) {
    console.error('Fonnte Send API Error:', err);
  }
}