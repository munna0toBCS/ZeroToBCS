import "./App.css";

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🚀 ZeroToBCS</h2>
        <p>From Zero to Cadre</p>

        <button>Dashboard</button>
        <button>Syllabus</button>
        <button>Study Planner</button>
        <button>MCQ Exam</button>
        <button>AI Mentor</button>
        <button>Analytics</button>
      </aside>

      <main className="main">
        <section className="hero">
          <p className="badge">Private Alpha</p>
          <h1>Welcome back, Munna</h1>
          <p>Your mission: BCS Police Cadre preparation with AI.</p>
        </section>

        <section className="cards">
          <div className="card">
            <h3>Today’s Study</h3>
            <h2>0 min</h2>
          </div>

          <div className="card">
            <h3>XP</h3>
            <h2>0</h2>
          </div>

          <div className="card">
            <h3>Level</h3>
            <h2>Cadet</h2>
          </div>

          <div className="card">
            <h3>Accuracy</h3>
            <h2>0%</h2>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;