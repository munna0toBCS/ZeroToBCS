import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function calculateLevel(xp) {
  if (xp >= 6000) return "Legend";
  if (xp >= 3000) return "Elite";
  if (xp >= 1500) return "Champion";
  if (xp >= 700) return "Warrior";
  if (xp >= 300) return "Scholar";
  if (xp >= 100) return "Aspirant";

  return "Cadet";
}

export const addXP = async (userId, amount) => {
  const userRef = doc(db, "users", userId);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return;

  const user = snapshot.data();

  const currentXP = user.xp || 0;
  const newXP = currentXP + amount;

  await updateDoc(userRef, {
    xp: newXP,
    level: calculateLevel(newXP),
  });

  return {
    xp: newXP,
    level: calculateLevel(newXP),
  };
};