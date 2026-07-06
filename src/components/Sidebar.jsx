import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>🚀 ZeroToBCS</h2>

      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>

      <Link to="/syllabus">
        <button>Syllabus</button>
      </Link>

      <Link to="/planner">
        <button>Study Planner</button>
      </Link>

      <Link to="/mcq">
        <button>MCQ Exam</button>
      </Link>

      <Link to="/mentor">
        <button>AI Mentor</button>
      </Link>

      <Link to="/analytics">
        <button>Analytics</button>
      </Link>
      <Link to="/exam">
  <button>📝 Mock Exam</button>
</Link>
<Link to="/mistakes">
  <button>📒 Mistake Notebook</button>
</Link>
    </aside>
  );
}