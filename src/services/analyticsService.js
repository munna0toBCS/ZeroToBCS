import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getAnalytics = async (userId) => {
  const historyRef = collection(db, "users", userId, "examHistory");
  const snapshot = await getDocs(historyRef);

  const exams = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (exams.length === 0) {
    return {
      totalExams: 0,
      averageAccuracy: 0,
      highestScore: 0,
      totalXPEarned: 0,
    };
  }

  const totalExams = exams.length;

  const averageAccuracy =
    exams.reduce((sum, exam) => sum + (exam.accuracy || 0), 0) / totalExams;

  const highestScore = Math.max(...exams.map((exam) => exam.score || 0));

  const totalXPEarned = exams.reduce(
    (sum, exam) => sum + (exam.xpEarned || 0),
    0
  );

  return {
    totalExams,
    averageAccuracy: Number(averageAccuracy.toFixed(1)),
    highestScore,
    totalXPEarned,
  };
};