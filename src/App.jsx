import { useState } from "react";
import "./App.css";
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

{page === "dashboard" && (
  <>
    <section className="hero">
      <span className="badge">Private Alpha</span>

      <h1>Welcome back, Munna 👋</h1>

      <p>
        Your mission: Become a BCS Cadre through smart, consistent study.
      </p>
    </section>

    <section className="cards">
      {stats.map((item) => (
        <div className="card" key={item.title}>
          <h3>{item.title}</h3>
          <h2>{item.value}</h2>
        </div>
      ))}
    </section>
    <section className="mission-card">
  <h2>Today's Mission</h2>

  <div className="mission-list">
    {missions.map((mission) => (
      <div className="mission-item" key={mission}>
        ✅ {mission}
      </div>
    ))}
  </div>
</section>
<section className="progress-card">
  <h2>Overall Progress</h2>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progress}%` }}
    ></div>
  </div>

  <p>{progress}% Completed</p>
</section>
  </>
)}

  {page === "syllabus" && (
  <>
    <h1>BCS Syllabus</h1>

    <div className="cards">
      <div className="card">
        <h3>বাংলা</h3>
        <h2>35 Marks</h2>
      </div>

      <div className="card">
        <h3>English</h3>
        <h2>35 Marks</h2>
      </div>

      <div className="card">
        <h3>Bangladesh Affairs</h3>
        <h2>30 Marks</h2>
      </div>

      <div className="card">
        <h3>International Affairs</h3>
        <h2>20 Marks</h2>
      </div>
    </div>
  </>
)}

        {page === "planner" && <h1>Study Planner</h1>}

        {page === "mcq" && <h1>MCQ Exam</h1>}

        {page === "mentor" && <h1>AI Mentor</h1>}

        {page === "analytics" && <h1>Analytics</h1>}

      </main>

    </div>
  );
}