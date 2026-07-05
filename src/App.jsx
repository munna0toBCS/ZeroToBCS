import { useState } from "react";
import "./App.css";

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

        {page === "dashboard" && <h1>Dashboard</h1>}

        {page === "syllabus" && <h1>BCS Syllabus</h1>}

        {page === "planner" && <h1>Study Planner</h1>}

        {page === "mcq" && <h1>MCQ Exam</h1>}

        {page === "mentor" && <h1>AI Mentor</h1>}

        {page === "analytics" && <h1>Analytics</h1>}

      </main>

    </div>
  );
}