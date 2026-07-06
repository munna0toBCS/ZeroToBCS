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
    <>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        🚪 Logout
      </button>

      <section className="hero">
        <span className="badge">Private Alpha</span>

        <h1>Welcome back, {displayName} 👋</h1>

        <p>Your mission: Become a BCS Cadre through smart, consistent study.</p>
      </section>

      <section className="cards">
        <div className="card">
          <h3>XP</h3>
          <h2>{profile?.xp ?? 0}</h2>
        </div>

        <div className="card">
          <h3>Level</h3>
          <h2>{profile?.level || "Cadet"}</h2>
        </div>

        <div className="card">
          <h3>University</h3>
          <h2>{profile?.university || "Not set"}</h2>
        </div>

        <div className="card">
          <h3>Target</h3>
          <h2>{profile?.targetCadre || "BCS"}</h2>
        </div>
      </section>

      <section className="mission-card">
        <h2>Today's Mission</h2>

        <div className="mission-list">
          <div className="mission-item">✅ 30 min Mathematics</div>
          <div className="mission-item">✅ 20 English MCQs</div>
          <div className="mission-item">✅ Read Bangladesh Affairs</div>
          <div className="mission-item">✅ Review Wrong Answers</div>
        </div>
      </section>
    </>
  );
}