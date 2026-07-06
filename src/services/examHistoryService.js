import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveExamHistory = async (userId, examResult) => {
  const historyRef = collection(db, "users", userId, "examHistory");

  await addDoc(historyRef, {
    ...examResult,
    createdAt: new Date(),
  });
};