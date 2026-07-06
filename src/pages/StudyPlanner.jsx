import { useState } from "react";
import Button from "../components/ui/Button";

export default function StudyPlanner() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, text: "English Grammar — 20 MCQ", done: false },
    { id: 2, text: "Bangladesh Affairs Revision", done: false },
    { id: 3, text: "Mathematics — 30 min", done: false },
  ]);

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        done: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const completed = tasks.filter((item) => item.done).length;

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

        {tasks.map((item) => (
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
              onClick={() => toggleTask(item.id)}
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
        ))}
      </div>
    </div>
  );
}