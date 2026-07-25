"use client";

import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MigrateTransactionsPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  const addLog = (message) => {
    setLogs((prev) => [...prev, message]);
  };

  const migrateTransactions = async () => {
    setLoading(true);
    setLogs([]);
    setSummary(null);

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    try {
      addLog("Memulai migrasi transaksi lama...");

      // ambil semua transaksi dari collection lama
      const oldTransactionsRef = collection(db, "transactions");
      const snapshot = await getDocs(oldTransactionsRef);

      addLog(`Ditemukan ${snapshot.size} transaksi lama.`);

      for (const docSnap of snapshot.docs) {
        try {
          const data = docSnap.data();
          const oldId = docSnap.id;

          // wajib punya uid
          if (!data.uid) {
            skippedCount++;
            addLog(`⏭️ Skip ${oldId} karena tidak memiliki uid.`);
            continue;
          }

          const uid = data.uid;

          // path baru:
          // users/{uid}/transactions/{oldId}
          const newDocRef = doc(db, "users", uid, "transactions", oldId);

          // salin data apa adanya
          await setDoc(newDocRef, {
            ...data,
            migratedAt: new Date(),
          });

          successCount++;
          addLog(`✅ Berhasil migrasi transaksi ${oldId} ke users/${uid}/transactions/${oldId}`);
        } catch (error) {
          failCount++;
          addLog(`❌ Gagal migrasi doc ${docSnap.id}: ${error.message}`);
        }
      }

      setSummary({
        total: snapshot.size,
        success: successCount,
        failed: failCount,
        skipped: skippedCount,
      });

      addLog("Migrasi selesai.");
    } catch (error) {
      addLog(`❌ Error utama migrasi: ${error.message}`);
      setSummary({
        total: 0,
        success: successCount,
        failed: failCount + 1,
        skipped: skippedCount,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-3">Migrasi Transaksi Lama</h1>
          <p className="text-gray-300 mb-6">
            Halaman ini akan menyalin data dari collection lama{" "}
            <code className="bg-black/30 px-2 py-1 rounded">transactions</code>{" "}
            ke struktur baru{" "}
            <code className="bg-black/30 px-2 py-1 rounded">
              users/{`{uid}`}/transactions
            </code>.
          </p>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200 mb-6">
            <p className="font-semibold mb-2">Penting:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Script ini menyalin data, bukan langsung menghapus data lama.</li>
              <li>Jalankan satu kali saja untuk migrasi awal.</li>
              <li>Setelah selesai, cek dashboard apakah transaksi lama sudah muncul.</li>
            </ul>
          </div>

          <button
            onClick={migrateTransactions}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Migrasi sedang berjalan..." : "Mulai Migrasi"}
          </button>

          {summary && (
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                <p className="text-sm text-emerald-300">Berhasil</p>
                <p className="text-2xl font-bold">{summary.success}</p>
              </div>

              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-300">Gagal</p>
                <p className="text-2xl font-bold">{summary.failed}</p>
              </div>

              <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                <p className="text-sm text-yellow-300">Skip</p>
                <p className="text-2xl font-bold">{summary.skipped}</p>
              </div>

              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4">
                <p className="text-sm text-cyan-300">Total Lama</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 max-h-[420px] overflow-y-auto">
            <h2 className="font-semibold mb-3">Log Migrasi</h2>

            {logs.length === 0 ? (
              <p className="text-gray-400 text-sm">Belum ada log.</p>
            ) : (
              <div className="space-y-2 text-sm font-mono">
                {logs.map((log, index) => (
                  <div key={index} className="text-gray-200">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}