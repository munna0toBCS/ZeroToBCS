import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import StudyPlanner from "./pages/StudyPlanner";
import MCQ from "./pages/MCQ";
import Mentor from "./pages/Mentor";
const stats = [
  { title: "Today's Study", value: "0 min" },
  { title: "XP", value: "0" },
  { title: "Level", value: "Cadet" },
  { title: "Accuracy", value: "0%" },
];
const missions = [
  "30 min Mathematics",
  "20 English MCQs",
  "Read Bangladesh Affairs",
  "Review Wrong Answers",
];
const progress = 25;
export default function App() {
  const [page, setPage] = useState("dashboard");
  return (
    <div className="app">

      <aside className="sidebar">

        <h2>🚀 ZeroToBCS</h2>

        <button onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setPage("syllabus")}>
          Syllabus
        </button>

        <button onClick={() => setPage("planner")}>
          Study Planner
        </button>

        <button onClick={() => setPage("mcq")}>
          MCQ Exam
        </button>

        <button onClick={() => setPage("mentor")}>
          AI Mentor
        </button>

        <button onClick={() => setPage("analytics")}>
          Analytics
        </button>

      </aside>

      <main className="content">

{page === "dashboard" && <Dashboard />}

{page === "syllabus" && <Syllabus />}
{page === "planner" && <StudyPlanner />}

{page === "mcq" && <MCQ />}

{page === "mentor" && <Mentor />}

{page === "analytics" && (
  <>
    <h1>Analytics Dashboard</h1>

    <div className="cards">

      <div className="card">
        <h3>Total Study</h3>
        <h2>125 Hours</h2>
      </div>

      <div className="card">
        <h3>Current Streak</h3>
        <h2>7 Days 🔥</h2>
      </div>

      <div className="card">
        <h3>XP Earned</h3>
        <h2>3,250 XP</h2>
      </div>

      <div className="card">
        <h3>Rank</h3>
        <h2>Cadet ⭐</h2>
      </div>

    </div>

    <div className="card" style={{ marginTop: "20px" }}>
      <h2>Weekly Progress</h2>

      <div
        style={{
          height: "20px",
          background: "#102c6b",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "15px"
        }}
      >
        <div
          style={{
            width: "72%",
            height: "100%",
            background: "#4CAF50"
          }}
        />
      </div>

      <p style={{ marginTop: "15px" }}>
        72% Weekly Goal Completed
      </p>

    </div>
  </>
)}

      </main>

    </div>
  );
}