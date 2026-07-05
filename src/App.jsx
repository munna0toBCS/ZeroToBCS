import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import StudyPlanner from "./pages/StudyPlanner";
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

{page === "mcq" && (
  <>
    <h1>MCQ Exam</h1>

    <div className="cards">

      <div className="card">
        <h3>Total Questions</h3>
        <h2>200</h2>
      </div>

      <div className="card">
        <h3>Completed</h3>
        <h2>35</h2>
      </div>

      <div className="card">
        <h3>Accuracy</h3>
        <h2>82%</h2>
      </div>

    </div>

    <div className="card" style={{ marginTop: "20px" }}>
      <h2>Start Today's MCQ Test</h2>

      <button style={{ marginTop: "15px" }}>
        🚀 Start Exam
      </button>
    </div>
    <div className="card" style={{ gridColumn: "1 / -1" }}>
  <h3>Practice Sets</h3>

  <button style={{ margin: "10px" }}>
    Bangladesh Affairs Practice
  </button>

  <button style={{ margin: "10px" }}>
    English Practice
  </button>

  <button style={{ margin: "10px" }}>
    Mathematics Practice
  </button>

  <button style={{ margin: "10px" }}>
    ICT Practice
  </button>

  <button style={{ margin: "10px" }}>
    Full Mock Test
  </button>
</div>
<div className="card" style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
  <h3>Recent Results</h3>

  <p>✅ Bangladesh Affairs - 18/20</p>
  <p>✅ English - 16/20</p>
  <p>✅ ICT - 19/20</p>
  <p>⭐ Best Accuracy: 95%</p>
</div>
<div className="card" style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
  <h3>Performance Summary</h3>

  <p>📚 Total Practice: 35 Sets</p>
  <p>🎯 Average Accuracy: 82%</p>
  <p>🔥 Current Streak: 7 Days</p>
  <p>🏆 Highest Score: 96%</p>
</div>

  </>
)}

{page === "mentor" && (
  <>
    <h1>AI Mentor</h1>

    <div className="card">
      <h2>Ask Your Mentor</h2>

      <textarea
        rows="6"
        placeholder="Ask any BCS related question..."
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          borderRadius: "10px",
          background: "#0b1f4d",
          color: "white",
          border: "none"
        }}
      />

      <button style={{ marginTop: "20px" }}>
        🤖 Ask AI
      </button>
    </div>
  </>
)}

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