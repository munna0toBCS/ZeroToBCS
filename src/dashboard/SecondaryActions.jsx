import { useNavigate } from "react-router-dom";

const links = [
  { title: "Practice", icon: "🎯", path: "/practice" },
  { title: "Mock Exam", icon: "📝", path: "/mock" },
  { title: "Mistake Notebook", icon: "📒", path: "/mistakes" },
  { title: "Study Planner", icon: "📅", path: "/planner" },
  { title: "AI Mentor", icon: "🤖", path: "/mentor" },
];

export default function SecondaryActions() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        marginTop: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {links.map((link) => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "transparent",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
            opacity: 0.85,
          }}
        >
          {link.icon} {link.title}
        </button>
      ))}
    </section>
  );
}
