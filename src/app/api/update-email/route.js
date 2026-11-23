import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    initAdmin();

    // Wajib login: ambil token dari header Authorization
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    // UID diambil dari token yang terverifikasi, bukan dari body
    const decoded = await getAuth().verifyIdToken(token);

    const body = await req.json();
    const newEmail = body?.newEmail?.trim();

    if (!newEmail) {
      return NextResponse.json({ error: "Email baru wajib diisi!" }, { status: 400 });
    }

    await getAuth().updateUser(decoded.uid, {
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