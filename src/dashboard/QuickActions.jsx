import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

const actions = [
  { title: "Practice", icon: "🎯", path: "/practice" },
  { title: "Mock Exam", icon: "📝", path: "/mock" },
  { title: "Study Planner", icon: "📅", path: "/planner" },
  { title: "Mistake Notebook", icon: "📒", path: "/mistakes" },
  { title: "AI Mentor", icon: "🤖", path: "/mentor" },
];

  return (
    <section className="mission-card">
      <h2>⚡ Quick Actions</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {actions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "none",
              background: "#16284f",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2850b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#16284f";
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>
              {action.icon}
            </div>

            <strong>{action.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}