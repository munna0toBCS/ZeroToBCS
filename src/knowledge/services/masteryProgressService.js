import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export async function getSubjectMasteryProgress(userId, subjectId, topics) {
  const ref = collection(db, "users", userId, "topicMastery");
  const snapshot = await getDocs(ref);

  const masteredIds = new Set();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    if (data.subjectId === subjectId && data.mastered) {
      masteredIds.add(data.topicId);
    }
  });

  const totalTopics = topics.length;
  const masteredTopics = topics.filter((topic) =>
    masteredIds.has(topic.id)
  ).length;

  const progress =
    totalTopics === 0
      ? 0
      : Math.round((masteredTopics / totalTopics) * 100);

  return {
    totalTopics,
    masteredTopics,
    progress,
    masteredIds,
  };
}