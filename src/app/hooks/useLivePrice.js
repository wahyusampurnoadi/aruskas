import { useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Interval aturan:
 * - Crypto  : 1 menit
 * - Saham   : 15 menit
 * - Emas    : 12 jam (hemat API)
 */
const INTERVALS = {
  Crypto: 60 * 1000,
  Saham: 15 * 60 * 1000,
  Emas: 12 * 60 * 60 * 1000
};

export default function useLivePrice(investments = []) {
  const lastRunRef = useRef({});

  useEffect(() => {
    if (!investments.length) return;

    let cancelled = false;

    const updatePrices = async () => {
      for (const inv of investments) {
        try {
          if (!inv.id || !inv.type) continue;

          const now = Date.now();
          const lastRun = lastRunRef.current[inv.id] || 0;
          const interval = INTERVALS[inv.type] || 60 * 60 * 1000;

          // ⏱️ THROTTLE PER ASET
          if (now - lastRun < interval) continue;
          lastRunRef.current[inv.id] = now;

          let price = null;

          /* ================= CRYPTO ================= */
          if (inv.type === "Crypto" && inv.symbol) {
            const res = await fetch(`/api/crypto?symbol=${inv.symbol}`);
            if (!res.ok) continue;

            const json = await res.json();
            price = json.price; // Rp per coin

            if (!price || !inv.coins) continue;

            const currentVal = Math.round(price * inv.coins);

            await updateDoc(doc(db, "investments", inv.id), {
              basePrice: price,
              currentVal,
              lastUpdated: serverTimestamp()
            });
          }

          /* ================= SAHAM ================= */
          if (inv.type === "Saham" && inv.symbol && inv.lots) {
            const res = await fetch(`/api/saham?kode=${inv.symbol}`);
            if (!res.ok) continue;

            const json = await res.json();
            price = json.price; // Rp per lembar

            if (!price) continue;

            const lembar = inv.lots * 100;
            const currentVal = Math.round(price * lembar);

            await updateDoc(doc(db, "investments", inv.id), {
              basePrice: price,
              currentVal,
              lastUpdated: serverTimestamp()
            });
          }

          /* ================= EMAS ================= */
          if (inv.type === "Emas" && inv.grams) {
            const res = await fetch(`/api/emas`);
            if (!res.ok) continue;

            const json = await res.json();
            price = json.price; // Rp per gram

            if (!price) continue;

            const currentVal = Math.round(price * inv.grams);

            await updateDoc(doc(db, "investments", inv.id), {
              basePrice: price,
              currentVal,
              lastUpdated: serverTimestamp()
            });
          }
        } catch (err) {
          // ❌ API error / limit → diamkan (AMAN)
          console.warn("Live price skipped:", inv.name);
        }
      }
    };

    updatePrices();

    return () => {
      cancelled = true;
    };
  }, [investments]);
}
