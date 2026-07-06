import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveMistakes = async (userId, mistakes) => {
  if (!mistakes.length) return;

  const mistakeRef = collection(db, "users", userId, "mistakes");

  for (const mistake of mistakes) {
    await addDoc(mistakeRef, {
      ...mistake,
      createdAt: new Date(),
    });
  }
};