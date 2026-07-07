import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { updateMissionTask } from "../services/userMissionService";
export default function MissionSection({ mission, tasks = [] }) {
  const [completedTasks, setCompletedTasks] = useState({});
useEffect(() => {
  if (!mission) return;

  const initial = {};

  mission.tasks.forEach((task) => {
    initial[task.id] = task.completed;
  });

  setCompletedTasks(initial);
}, [mission]);
 const toggleTask = async (taskId) => {
  const user = auth.currentUser;

  if (!user || !mission) return;

  const completed = !completedTasks[taskId];

  setCompletedTasks((prev) => ({
    ...prev,
    [taskId]: completed,
  }));

  await updateMissionTask(
    user.uid,
    mission.id,
    taskId,
    completed
  );
};

  return (
    <section className="mission-card">
      <h2>🎯 Today's Mission</h2>

      {mission && (
        <div
          style={{
            marginBottom: "20px",
            padding: "18px",
            background: "#0f172a",
            borderRadius: "14px",
          }}
        >
          <p><strong>Focus Subject:</strong> {mission.focusSubject}</p>
          <p style={{ marginTop: "8px" }}><strong>Priority:</strong> {mission.priority}</p>
          <p style={{ marginTop: "8px" }}><strong>Estimated Time:</strong> {mission.estimatedTime}</p>
          <p style={{ marginTop: "8px" }}><strong>Reward:</strong> ⭐ {mission.rewardXP} XP</p>
        </div>
      )}

      <div className="mission-list">
        {tasks.length === 0 ? (
          <p>No mission available.</p>
        ) : (
          tasks.map((task) => {
            const done = completedTasks[task.id] || task.completed;

            return (
              <div
                className="mission-item"
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  cursor: "pointer",
                  opacity: done ? 0.65 : 1,
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {done ? "✅" : "⬜"} {task.title}

                <div
                  style={{
                    fontSize: "14px",
                    opacity: 0.75,
                    marginLeft: "28px",
                  }}
                >
                  {task.target} • ⭐ {task.xp} XP
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}