export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const coin = searchParams.get("coin") || "bitcoin";
  
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=idr`,
      { next: { revalidate: 30 } }
    );
  
    const data = await res.json();
    return Response.json({ price: data[coin]?.idr || 0 });
  }
  