import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebaseAdmin"; // Sesuaikan lokasi helper Firebase Admin kamu

export async function POST(req) {
  try {
    // Inisialisasi Firebase Admin
    initAdmin();

    const body = await req.json();
    const { uid, newEmail } = body;

    if (!uid || !newEmail) {
      return NextResponse.json(
        { error: "UID dan email baru wajib diisi!" },
        { status: 400 }
      );
    }

    // Perbarui email pengguna di Firebase Auth secara instan
    await getAuth().updateUser(uid, {
      email: newEmail,
      emailVerified: true,
    });

    return NextResponse.json({ success: true, message: "Email berhasil diperbarui" });
  } catch (error) {
    console.error("API Update Email Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui email di server" },
      { status: 500 }
    );
  }
}