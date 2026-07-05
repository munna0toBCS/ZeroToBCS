export default function Sidebar({ setPage }) {
  return (
    <aside className="sidebar">
      <h2>🚀 ZeroToBCS</h2>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("syllabus")}>Syllabus</button>
      <button onClick={() => setPage("planner")}>Study Planner</button>
      <button onClick={() => setPage("mcq")}>MCQ Exam</button>
      <button onClick={() => setPage("mentor")}>AI Mentor</button>
      <button onClick={() => setPage("analytics")}>Analytics</button>
    </aside>
  );
}