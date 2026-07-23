import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment } from "firebase/firestore";
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

export const getWeakTopics = async (userId) => {
  const mistakesRef = collection(db, "users", userId, "mistakes");
  const snapshot = await getDocs(mistakesRef);

  const grouped = {};

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.mastered) return;
    if (!data.subject || !data.topic) return;

    const key = `${data.subject}::${data.topic}`;

    if (!grouped[key]) {
      grouped[key] = {
        subject: data.subject,
        topic: data.topic,
        wrongCount: 0,
        lastWrongAt: data.lastWrongAt || null,
      };
    }

    grouped[key].wrongCount += data.wrongCount || 1;

    if (data.lastWrongAt && (!grouped[key].lastWrongAt || data.lastWrongAt > grouped[key].lastWrongAt)) {
      grouped[key].lastWrongAt = data.lastWrongAt;
    }
  });

  return Object.values(grouped).sort((a, b) => b.wrongCount - a.wrongCount);
};