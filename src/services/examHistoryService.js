import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveExamHistory = async (
  userId,
  examResult,
  subjectStats = {}
) => {
  const historyRef = collection(
    db,
    "users",
    userId,
    "examHistory"
  );

  await addDoc(historyRef, {
    ...examResult,

    // Subject-wise performance
    subjectStats,

    createdAt: new Date(),
  });
};