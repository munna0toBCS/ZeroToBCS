import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const menuItems = [
    { path: "/dashboard", label: "🏠 Dashboard" },
    { path: "/profile", label: "👤 Profile" },
    { path: "/syllabus", label: "📚 Syllabus" },
    { path: "/planner", label: "🎯 Study Planner" },
    { path: "/exam", label: "📝 Mock Exam" },
    { path: "/practice", label: "🎯 Practice Mode" },
  
    { path: "/mistakes", label: "📒 Mistake Notebook" },
    { path: "/mentor", label: "🤖 AI Mentor" },
    { path: "/analytics", label: "📊 Analytics" },
  ];

  return (
    <aside
      className="sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div>
        <h2>🚀 ZeroToBCS</h2>
        <p>Smart BCS Platform</p>

        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <button
                style={{
                  background: isActive ? "#3b82f6" : "#16284f",
                  borderLeft: isActive
                    ? "4px solid #ffffff"
                    : "4px solid transparent",
                }}
              >
                {item.label}
              </button>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          background: "#ef4444",
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}