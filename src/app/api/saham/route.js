export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const kode = searchParams.get("kode");
  
      if (!kode) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      const res = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${kode}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        }
      );
  
      if (!res.ok) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      const json = await res.json();
      const result = json?.quoteResponse?.result?.[0];
  
      if (!result || !result.regularMarketPrice) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      return Response.json({
        price: result.regularMarketPrice
      });
  
    } catch (error) {
      // ❗ JANGAN return 500
      return Response.json({ price: null }, { status: 200 });
    }
  }
  