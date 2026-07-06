import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export const saveMistakes = async (userId, mistakes) => {
  if (!mistakes.length) return;

  for (const mistake of mistakes) {
    const mistakeRef = doc(
      db,
      "users",
      userId,
      "mistakes",
      `question_${mistake.questionId}`
    );

    const snapshot = await getDoc(mistakeRef);

    if (snapshot.exists()) {
      await updateDoc(mistakeRef, {
        wrongCount: increment(1),
        lastWrongAt: new Date(),
      });
    } else {
      await setDoc(mistakeRef, {
        ...mistake,
        wrongCount: 1,
        mastered: false,
        firstWrongAt: new Date(),
        lastWrongAt: new Date(),
      });
    }
  }
};