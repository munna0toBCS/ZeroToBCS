import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getUserProfile } from "../services/userService";
import { getPlannerTasks } from "../services/plannerService";
import StatCard from "../components/ui/StatCard";

const quotes = [
  "Discipline beats motivation.",
  "One mock exam today is better than ten plans tomorrow.",
  "Small progress every day becomes big success.",
  "Consistency is the real shortcut.",
  "Your future cadre life starts with today’s effort.",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const quote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const profileData = await getUserProfile(user.uid);
      const plannerTasks = await getPlannerTasks(user.uid);

      setProfile(profileData);
      setTasks(plannerTasks);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Preparing your dashboard...</h2>
      </div>
    );
  }

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Cadet";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const completedTasks = tasks.filter((task) => task.done).length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <section className="hero">
        <span className="badge">ZeroToBCS V3</span>

        <h1>👋 {greeting}, {displayName}</h1>

        <p>
          🎯 Target: {profile?.examTarget || "BCS"} —{" "}
          {profile?.targetCadre || "Administration"}
        </p>
        <p>🏫 University: {profile?.university || "Not set"}</p>
        <p>🎓 Graduation Year: {profile?.graduationYear || "Not set"}</p>
        <p>⏱️ Daily Goal: {profile?.dailyGoal || "2 Hours"}</p>

        <div style={{ marginTop: "20px" }}>
          <h3>💬 Quote of the Day</h3>
          <p style={{ marginTop: "8px", fontStyle: "italic" }}>"{quote}"</p>
        </div>
      </section>

      <section className="cards">
        <StatCard icon="⭐" title="XP" value={profile?.xp ?? 0} />
        <StatCard icon="🏅" title="Level" value={profile?.level || "Cadet"} />
        <StatCard icon="🔥" title="Streak" value="1 Day" />
        <StatCard icon="✅" title="Tasks Done" value={`${completedTasks}/${tasks.length}`} />
      </section>

      <section className="mission-card">
        <h2>📅 Today's Mission</h2>

        <div className="mission-list">
          {tasks.length === 0 ? (
            <p>No planner tasks yet. Add tasks from Study Planner.</p>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <div className="mission-item" key={task.id}>
                {task.done ? "✅" : "☐"} {task.text}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mission-card">
        <h2>⚡ Quick Actions</h2>

        <div className="cards">
          <button onClick={() => navigate("/exam")}>📝 Mock Exam</button>
          <button onClick={() => navigate("/planner")}>📅 Study Planner</button>
          <button onClick={() => navigate("/mistakes")}>📒 Mistake Notebook</button>
          <button onClick={() => navigate("/mentor")}>🤖 AI Mentor</button>
        </div>
      </section>

      <section className="progress-card">
        <h2>📊 Planner Progress</h2>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: tasks.length
                ? `${Math.round((completedTasks / tasks.length) * 100)}%`
                : "0%",
            }}
          ></div>
        </div>

        <p>
          {tasks.length
            ? `${Math.round((completedTasks / tasks.length) * 100)}% Completed`
            : "0% Completed"}
        </p>
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