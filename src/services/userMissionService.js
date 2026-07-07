import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generateDailyMission } from "./dailyMissionService";

const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

export const getOrCreateDailyMission = async (userId, analytics) => {
  const today = getTodayKey();

  const missionRef = doc(
    db,
    "users",
    userId,
    "dailyMissions",
    today
  );

  const snapshot = await getDoc(missionRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }

  const mission = generateDailyMission(analytics);

  const newMission = {
    ...mission,
    date: today,
    rewardClaimed: false,
    createdAt: new Date(),
  };

  await setDoc(missionRef, newMission);

  return {
    id: today,
    ...newMission,
  };
};

export const updateMissionTask = async (userId, missionId, taskId, completed) => {
  const missionRef = doc(
    db,
    "users",
    userId,
    "dailyMissions",
    missionId
  );

  const snapshot = await getDoc(missionRef);

  if (!snapshot.exists()) return;

  const mission = snapshot.data();

  const updatedTasks = mission.tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed }
      : task
  );

  await setDoc(
    missionRef,
    {
      ...mission,
      tasks: updatedTasks,
    },
    { merge: true }
  );

  return updatedTasks;
};