export async function GET() {
    try {
      const API_KEY = process.env.METAL_API_KEY;
  
      if (!API_KEY) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      const res = await fetch(
        `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=USD&currencies=XAU,IDR`
      );
  
      if (!res.ok) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      const json = await res.json();
  
      if (!json?.rates?.IDR || !json?.rates?.XAU) {
        return Response.json({ price: null }, { status: 200 });
      }
  
      const hargaPerGram =
        (json.rates.IDR / json.rates.XAU) / 31.1035;
  
      return Response.json({
        price: Math.round(hargaPerGram)
      });
    } catch {
      return Response.json({ price: null }, { status: 200 });
    }
  }
  