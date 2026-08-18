import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase"; // Sesuaikan lokasi konfigurasi Firebase Admin / Firestore Anda
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      custom_field1: userId, // Opsional: tempat menyimpan ID user jika dikirim saat buat transaksi
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      return NextResponse.json(
        { error: "Server Key tidak ditemukan." },
        { status: 500 }
      );
    }

    // 1. Verifikasi Keamanan Signature Key (SHA512)
    const hashPayload = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const calculatedSignature = crypto
      .createHash("sha512")
      .update(hashPayload)
      .digest("hex");

    if (calculatedSignature !== signature_key) {
      console.error("Signature Key tidak valid!");
      return NextResponse.json(
        { error: "Signature key tidak cocok." },
        { status: 403 }
      );
    }

    // 2. Evaluasi Status Pembayaran
    let isSuccess = false;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        isSuccess = true;
      }
    } else if (transaction_status === "settlement") {
      isSuccess = true;
    }

    // 3. Update Status Pengguna di Firestore jika Pembayaran Berhasil
    if (isSuccess) {
      // Dapatkan User ID dari order_id jika tidak menggunakan custom_field
      // Misal order_id formatnya: "ORDER-USERID-TIMESTAMP"
      const targetUserId = userId || order_id.split("-")[1];

      if (targetUserId) {
        const userRef = doc(db, "users", targetUserId);
        
        // Tentukan durasi aktif (misal 1 bulan atau 1 tahun berdasarkan order_id / item)
        const isYearly = order_id.includes("YEARLY");
        const expiryDate = new Date();
        
        if (isYearly) {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        }

        // Update data status akun pengguna
        await updateDoc(userRef, {
          isPro: true,
          planType: isYearly ? "yearly" : "monthly",
          proActiveUntil: expiryDate.toISOString(),
          updatedAt: new Date().toISOString(),
        });

        console.log(`User ${targetUserId} berhasil di-upgrade ke PRO.`);
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      console.log(`Transaksi ${order_id} gagal/batal dengan status: ${transaction_status}`);
    }

    // Response 200 OK ke Midtrans untuk mengonfirmasi callback telah diterima
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}