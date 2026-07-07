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
const subjectTotals = {};

exams.forEach((exam) => {
  const stats = exam.subjectStats || {};

  Object.entries(stats).forEach(([subject, value]) => {
    if (!subjectTotals[subject]) {
      subjectTotals[subject] = {
        total: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
      };
    }

    subjectTotals[subject].total += value.total || 0;
    subjectTotals[subject].correct += value.correct || 0;
    subjectTotals[subject].wrong += value.wrong || 0;
    subjectTotals[subject].skipped += value.skipped || 0;
  });
});

const subjectPerformance = Object.entries(subjectTotals).map(
  ([subject, value]) => {
    const attempted = value.correct + value.wrong;
    const accuracy =
      attempted === 0
        ? 0
        : Number(((value.correct / attempted) * 100).toFixed(1));

    return {
      subject,
      ...value,
      accuracy,
    };
  }
);

const strongestSubject =
  subjectPerformance.length > 0
    ? [...subjectPerformance].sort((a, b) => b.accuracy - a.accuracy)[0]
    : null;

const weakestSubject =
  subjectPerformance.length > 0
    ? [...subjectPerformance].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null;
 const averageScore =
  exams.reduce((sum, exam) => sum + (exam.score || 0), 0) / totalExams;

const bestAccuracy = Math.max(
  ...exams.map((exam) => exam.accuracy || 0)
);

let performanceLevel = "Needs Improvement";
let recommendation =
  "Practice more mock exams to improve your performance.";

if (averageAccuracy >= 90) {
  performanceLevel = "Excellent";
  recommendation =
    "Outstanding performance! Continue full-length mock exams.";
} else if (averageAccuracy >= 80) {
  performanceLevel = "Very Good";
  recommendation =
    "You are close to top performance. Focus on weak areas.";
} else if (averageAccuracy >= 70) {
  performanceLevel = "Good";
  recommendation =
    "Keep practicing consistently and revise your mistakes.";
} else if (averageAccuracy >= 60) {
  performanceLevel = "Average";
  recommendation =
    "Increase daily practice and review wrong answers regularly.";
}

return {
  totalExams,
  averageScore: Number(averageScore.toFixed(2)),
  averageAccuracy: Number(averageAccuracy.toFixed(1)),
  bestAccuracy,
  highestScore,
  totalXPEarned,
  performanceLevel,
  recommendation,
  exams,
  subjectPerformance,
strongestSubject,
weakestSubject,
};
};