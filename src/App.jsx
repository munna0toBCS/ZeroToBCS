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

  {page === "planner" && (
  <>
    <h1>Study Planner</h1>

    <div className="cards">

      <div className="card">
        <h3>Today's Target</h3>
        <h2>8 Hours</h2>
      </div>

      <div className="card">
        <h3>Completed</h3>
        <h2>2 Hours</h2>
      </div>

      <div className="card">
        <h3>Remaining</h3>
        <h2>6 Hours</h2>
      </div>

    </div>

    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Today's Routine</h3>

      <p>🕗 8:00 AM - English</p>
      <p>🕙 10:00 AM - Bangladesh Affairs</p>
      <p>🕐 1:00 PM - Mathematics</p>
      <p>🕓 4:00 PM - ICT</p>
      <p>🕖 7:00 PM - MCQ Practice</p>

    </div>

  </>
)}

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