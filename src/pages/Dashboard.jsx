import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getUserProfile } from "../services/userService";
import StatCard from "../components/ui/StatCard";

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

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Cadet";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <section className="hero">
        <span className="badge">ZeroToBCS V3</span>

        <h1>👋 {greeting}, {displayName}</h1>

        <p>🎯 Target: {profile?.examTarget || "BCS"} — {profile?.targetCadre || "Administration"}</p>
        <p>🏫 University: {profile?.university || "Not set"}</p>
        <p>🎓 Graduation Year: {profile?.graduationYear || "Not set"}</p>
        <p>⏱️ Daily Goal: {profile?.dailyGoal || "2 Hours"}</p>
      </section>

      <section className="cards">
        <StatCard icon="⭐" title="XP" value={profile?.xp ?? 0} />
        <StatCard icon="🏅" title="Level" value={profile?.level || "Cadet"} />
        <StatCard icon="🔥" title="Streak" value="1 Day" />
        <StatCard icon="🎯" title="Accuracy" value="Coming Soon" />
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