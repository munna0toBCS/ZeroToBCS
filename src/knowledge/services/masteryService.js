import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const today = () => new Date().toISOString().split("T")[0];

export async function getTopicMastery(userId, subjectId, topicId) {
  const ref = doc(
    db,
    "users",
    userId,
    "topicMastery",
    `${subjectId}_${topicId}`
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}

export async function markTopicMastered(userId, subjectId, topicId) {
  const ref = doc(
    db,
    "users",
    userId,
    "topicMastery",
    `${subjectId}_${topicId}`
  );

  const data = {
    subjectId,
    topicId,
    mastered: true,
    masteredAt: today(),
    updatedAt: new Date(),
  };

  await setDoc(ref, data, { merge: true });

  return data;
}