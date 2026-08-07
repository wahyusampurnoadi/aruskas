import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Collection Path: users/{uid}/debts
 * Debt item structure:
 * {
 *   id,
 *   type: 'piutang' | 'hutang', // piutang = orang utang ke saya, hutang = saya utang ke orang
 *   personName: string,
 *   amount: number,
 *   paidAmount: number,
 *   dueDate: string (YYYY-MM-DD),
 *   notes: string,
 *   status: 'unpaid' | 'partially_paid' | 'paid',
 *   payments: [ { amount, date, walletId, note } ]
 * }
 */

export function getUserDebtsCollection(uid) {
  return collection(db, "users", uid, "debts");
}

export async function getAllDebts(uid) {
  if (!uid) return [];

  try {
    const q = query(getUserDebtsCollection(uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (err) {
    console.error("Error fetching debts from Firestore:", err);
    return [];
  }
}

export async function createDebt(uid, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");

  const debtRef = getUserDebtsCollection(uid);

  const initialPaidAmount = Number(payload.paidAmount) || 0;
  const totalAmount = Number(payload.amount) || 0;
  
  let status = "unpaid";
  if (initialPaidAmount >= totalAmount && totalAmount > 0) {
    status = "paid";
  } else if (initialPaidAmount > 0) {
    status = "partially_paid";
  }

  const finalPayload = {
    type: payload.type || "piutang",
    personName: payload.personName || "",
    amount: totalAmount,
    paidAmount: initialPaidAmount,
    dueDate: payload.dueDate || "",
    notes: payload.notes || "",
    status,
    payments: payload.payments || [],
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(debtRef, finalPayload);
  return docRef.id;
}

export async function updateDebt(uid, debtId, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!debtId) throw new Error("ID tidak ditemukan");

  const debtDocRef = doc(db, "users", uid, "debts", debtId);

  const paidAmount = Number(payload.paidAmount) || 0;
  const updateData = {
    ...payload,
    updatedAt: serverTimestamp(),
  };

  if (payload.amount !== undefined) {
    const totalAmount = Number(payload.amount) || 0;
    updateData.amount = totalAmount;
    
    let status = "unpaid";
    if (paidAmount >= totalAmount && totalAmount > 0) {
      status = "paid";
    } else if (paidAmount > 0) {
      status = "partially_paid";
    }
    updateData.status = status;
  } else if (payload.status) {
    updateData.status = payload.status;
  }

  await setDoc(debtDocRef, updateData, { merge: true });
}

export async function deleteDebt(uid, debtId) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!debtId) throw new Error("ID tidak ditemukan");

  const debtDocRef = doc(db, "users", uid, "debts", debtId);
  await deleteDoc(debtDocRef);
}

/**
 * Format WhatsApp reminder message
 */
export function generateWhatsAppReminderLink(personName, type, remainingAmount, dueDate) {
  const cleanPhone = ""; // can be customized or entered by user if phone exists
  const formattedAmount = `Rp ${Number(remainingAmount).toLocaleString("id-ID")}`;
  
  let text = "";
  if (type === "piutang") {
    text = `Halo ${personName}, sekadar menginfokan catatan piutang sebesar ${formattedAmount} yang jatuh tempo pada ${dueDate || "waktu dekat"}. Terima kasih! 🙏`;
  } else {
    text = `Halo ${personName}, sekadar mengonfirmasi catatan hutang saya sebesar ${formattedAmount} jatuh tempo pada ${dueDate || "waktu dekat"}. Terima kasih! 🙏`;
  }

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
