import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import StudyPlanner from "./pages/StudyPlanner";
import MCQ from "./pages/MCQ";
import Mentor from "./pages/Mentor";
import Analytics from "./pages/Analytics";
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

{page === "analytics" && <Analytics />}
      </main>

    </div>
  );
}