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
 * Collection Path: users/{uid}/subscriptions
 * Subscription item structure:
 * {
 *   id,
 *   name: string, // misal: Netflix, Wifi Biznet, Gaji
 *   type: 'expense' | 'income',
 *   amount: number,
 *   category: string,
 *   walletName: string,
 *   frequency: 'monthly' | 'weekly' | 'yearly',
 *   dueDateDay: number (1-31) or nextDueDate string (YYYY-MM-DD),
 *   status: 'active' | 'paused',
 *   autoRecord: boolean
 * }
 */

export function getUserSubscriptionsCollection(uid) {
  return collection(db, "users", uid, "subscriptions");
}

export async function getAllSubscriptions(uid) {
  if (!uid) return [];

  try {
    const q = query(
      getUserSubscriptionsCollection(uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (err) {
    console.error("Error fetching subscriptions from Firestore:", err);
    return [];
  }
}

export async function createSubscription(uid, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");

  const subRef = getUserSubscriptionsCollection(uid);

  const finalPayload = {
    name: payload.name || "",
    type: payload.type || "expense",
    amount: Number(payload.amount) || 0,
    category: payload.category || "Langganan",
    walletName: payload.walletName || "BCA Utama",
    frequency: payload.frequency || "monthly",
    nextDueDate: payload.nextDueDate || new Date().toISOString().split("T")[0],
    status: payload.status || "active",
    autoRecord: payload.autoRecord !== undefined ? payload.autoRecord : true,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(subRef, finalPayload);
  return docRef.id;
}

export async function updateSubscription(uid, subId, payload) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!subId) throw new Error("ID tidak ditemukan");

  const subDocRef = doc(db, "users", uid, "subscriptions", subId);

  const updateData = {
    ...payload,
    updatedAt: serverTimestamp(),
  };

  if (payload.amount !== undefined) {
    updateData.amount = Number(payload.amount) || 0;
  }

  await setDoc(subDocRef, updateData, { merge: true });
}

export async function deleteSubscription(uid, subId) {
  if (!uid) throw new Error("UID tidak ditemukan");
  if (!subId) throw new Error("ID tidak ditemukan");

  const subDocRef = doc(db, "users", uid, "subscriptions", subId);
  await deleteDoc(subDocRef);
}

/**
 * Calculate the next due date based on current due date and frequency
 */
export function calculateNextDueDate(currentDueDateStr, frequency = "monthly") {
  const date = currentDueDateStr ? new Date(currentDueDateStr) : new Date();
  if (isNaN(date.getTime())) return new Date().toISOString().split("T")[0];

  if (frequency === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === "weekly") {
    date.setDate(date.getDate() + 7);
  } else if (frequency === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().split("T")[0];
}
