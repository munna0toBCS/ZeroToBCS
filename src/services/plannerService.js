import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export const getPlannerTasks = async (userId) => {
  const tasksRef = collection(db, "users", userId, "plannerTasks");
  const snapshot = await getDocs(tasksRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const addPlannerTask = async (userId, text) => {
  const tasksRef = collection(db, "users", userId, "plannerTasks");

  await addDoc(tasksRef, {
    text,
    done: false,
    createdAt: new Date(),
  });
};

export const togglePlannerTask = async (userId, taskId, done) => {
  const taskRef = doc(db, "users", userId, "plannerTasks", taskId);

  await updateDoc(taskRef, {
    done: !done,
  });
};

export const deletePlannerTask = async (userId, taskId) => {
  const taskRef = doc(db, "users", userId, "plannerTasks", taskId);

  await deleteDoc(taskRef);
};