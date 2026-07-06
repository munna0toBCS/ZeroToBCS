import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getUserProfile } from "../services/userService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      const data = await getUserProfile(user.uid);
      setProfile(data);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Cadet";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        🚪 Logout
      </button>

      <section className="hero">
        <span className="badge">ZeroToBCS V2</span>
        <h1>👋 Good Morning, {displayName}</h1>
        <p>🎯 Target: {profile?.targetCadre || "BCS Administration Cadre"}</p>
      </section>

      <section className="cards">
        <div className="card">
          <h3>⭐ XP</h3>
          <h2>{profile?.xp ?? 0}</h2>
        </div>

        <div className="card">
          <h3>🏅 Level</h3>
          <h2>{profile?.level || "Cadet"}</h2>
        </div>

        <div className="card">
          <h3>🔥 Streak</h3>
          <h2>1 Day</h2>
        </div>

        <div className="card">
          <h3>🏫 University</h3>
          <h2>{profile?.university || "Not set"}</h2>
        </div>
      </section>

      <section className="mission-card">
        <h2>📅 Today's Mission</h2>
        <div className="mission-list">
          <div className="mission-item">☐ Mathematics — 30 min</div>
          <div className="mission-item">☐ English MCQ — 20 questions</div>
          <div className="mission-item">☐ Bangladesh Affairs Revision</div>
          <div className="mission-item">☐ Review Wrong Answers</div>
        </div>
      </section>

      <section className="mission-card">
        <h2>⚡ Quick Actions</h2>

        <div className="cards">
          <button onClick={() => navigate("/exam")}>📝 Mock Exam</button>
          <button onClick={() => navigate("/mcq")}>📚 Practice</button>
          <button onClick={() => navigate("/mistakes")}>📒 Mistake Notebook</button>
          <button onClick={() => navigate("/mentor")}>🤖 AI Mentor</button>
        </div>
      </section>

      <section className="progress-card">
        <h2>📊 Overall Progress</h2>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "40%" }}></div>
        </div>

        <p>40% Completed</p>
      </section>

      <section className="mission-card">
        <h2>🏆 Achievements</h2>
        <p>🏅 First Mock Completed</p>
        <p>🔥 Streak Beginner</p>
        <p>⭐ 50 XP Club</p>
      </section>
    </div>
  );
}