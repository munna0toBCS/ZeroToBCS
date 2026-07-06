import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

// Practice Questions
export const getPracticeQuestions = async ({
  exam,
  subject,
  topic,
  difficulty,
  count,
}) => {
  let q = collection(db, "questionBank");

  const filters = [];

  if (exam)
    filters.push(where("exam", "==", exam));

  if (subject)
    filters.push(where("subject", "==", subject));

  if (topic)
    filters.push(where("topic", "==", topic));

  if (difficulty && difficulty !== "Mixed")
    filters.push(where("difficulty", "==", difficulty));

  filters.push(limit(count));

  const snapshot = await getDocs(query(q, ...filters));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Mock Exam Questions
export const getMockQuestions = async (count = 200) => {
  const snapshot = await getDocs(
    query(
      collection(db, "questionBank"),
      limit(count)
    )
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};