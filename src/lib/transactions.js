import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Path transaksi per user:
 * users/{uid}/transactions/{transactionId}
 */
export function getUserTransactionsCollection(uid) {
  return collection(db, "users", uid, "transactions");
}

/**
 * Ambil transaksi berdasarkan rentang tanggal
 * startDate dan endDate harus berupa object Date
 */
export async function getTransactionsByDateRange(uid, startDate, endDate) {
  if (!uid) return [];

  const q = query(
    getUserTransactionsCollection(uid),
    where("transactionDate", ">=", startDate),
    where("transactionDate", "<=", endDate),
    orderBy("transactionDate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Ambil seluruh transaksi user
 */
export async function getAllTransactions(uid) {
  if (!uid) return [];

  const q = query(
    getUserTransactionsCollection(uid),
    orderBy("transactionDate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}
/**
 * Tambah transaksi baru
 */
export async function createTransaction(uid, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");

  const transactionRef = getUserTransactionsCollection(uid);

  const finalPayload = {
    ...payload,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(transactionRef, finalPayload);
  return docRef.id;
}

/**
 * Update transaksi
 */
export async function updateTransaction(uid, transactionId, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!transactionId) throw new Error("ID transaksi tidak ditemukan");

  const transactionDocRef = doc(
    db,
    "users",
    uid,
    "transactions",
    transactionId
  );

  await updateDoc(transactionDocRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Hapus transaksi
 */
export async function deleteTransactionById(uid, transactionId) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!transactionId) throw new Error("ID transaksi tidak ditemukan");

  const transactionDocRef = doc(
    db,
    "users",
    uid,
    "transactions",
    transactionId
  );

  await deleteDoc(transactionDocRef);
}