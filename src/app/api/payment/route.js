import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { plan } = await request.json();

    // Tentukan harga berdasarkan pilihan paket
    const grossAmount = plan === "yearly" ? 159000 : 19000;
    const itemDetails = [
      {
        id: `ARUSKAS-PRO-${plan.toUpperCase()}`,
        price: grossAmount,
        quantity: 1,
        name: `ArusKas PRO (${plan === "yearly" ? "1 Tahun" : "1 Bulan"})`,
      },
    ];

    // Payload pendaftaran transaksi ke Midtrans
    const payload = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      credit_card: {
        secure: true,
      },
    };

    // Header Basic Auth dengan Midtrans Server Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

    const response = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error_messages }, { status: 400 });
    }

    return NextResponse.json({ snapToken: data.token });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat transaksi payment." },
      { status: 500 }
    );
  }
}