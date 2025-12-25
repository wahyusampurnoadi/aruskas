import { getDocs } from "firebase/firestore";

export async function getTransactions(uid) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "transactions")
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
