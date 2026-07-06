import { useEffect, useState } from "react";
import { auth } from "../firebase";
import Button from "../components/ui/Button";
import {
  getPlannerTasks,
  addPlannerTask,
  togglePlannerTask,
  deletePlannerTask,
} from "../services/plannerService";

export default function StudyPlanner() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const data = await getPlannerTasks(user.uid);
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    const user = auth.currentUser;
    if (!user || !task.trim()) return;

    await addPlannerTask(user.uid, task);
    setTask("");
    await loadTasks();
  };

  const toggleTask = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    await togglePlannerTask(user.uid, item.id, item.done);
    await loadTasks();
  };

  const deleteTask = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    await deletePlannerTask(user.uid, id);
    await loadTasks();
  };

  const completed = tasks.filter((item) => item.done).length;

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Loading planner...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>📅 Study Planner</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>{completed}</h2>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <h2>{tasks.length - completed}</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: "25px" }}>
        <h2>Add New Task</h2>

        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Example: Read Constitution Chapter 1"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        />

        <Button onClick={addTask}>➕ Add Task</Button>
      </div>

      <div className="card" style={{ marginTop: "25px" }}>
        <h2>Today's Tasks</h2>

        {tasks.length === 0 ? (
          <p style={{ marginTop: "15px" }}>No tasks yet. Add your first task.</p>
        ) : (
          tasks.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "15px",
                padding: "12px",
                background: "#16284f",
                borderRadius: "10px",
              }}
            >
              <span
                onClick={() => toggleTask(item)}
                style={{
                  cursor: "pointer",
                  textDecoration: item.done ? "line-through" : "none",
                  opacity: item.done ? 0.6 : 1,
                }}
              >
                {item.done ? "✅" : "⬜"} {item.text}
              </span>

              <button onClick={() => deleteTask(item.id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}