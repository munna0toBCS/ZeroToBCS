import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export const addXP = async (userId, amount) => {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    xp: increment(amount),
  });
};