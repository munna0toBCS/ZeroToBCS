import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const getToday = () => new Date().toISOString().split("T")[0];

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

export const updateDailyStreak = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  const today = getToday();
  const yesterday = getYesterday();

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      streak: 1,
      lastActiveDate: today,
    });
    return 1;
  }

  const user = snapshot.data();

  if (user.lastActiveDate === today) {
    return user.streak || 1;
  }

  let newStreak = 1;

  if (user.lastActiveDate === yesterday) {
    newStreak = (user.streak || 0) + 1;
  }

  await updateDoc(userRef, {
    streak: newStreak,
    lastActiveDate: today,
  });

  return newStreak;
};