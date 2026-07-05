import { signOut } from "firebase/auth";
import { auth } from "../firebase";
export default function Dashboard({ setPage }) {
    const handleLogout = async () => {
  await signOut(auth);
  setPage("auth");
};
  return (
    <>
    <button
onClick={handleLogout}
  style={{ marginBottom: "20px" }}
>
  🚪 Logout
</button>
      <section className="hero">
        <span className="badge">Private Alpha</span>

        <h1>Welcome back, Munna 👋</h1>

        <p>
          Your mission: Become a BCS Cadre through smart, consistent study.
        </p>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Today's Study</h3>
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
      <section className="mission-card">
  <h2>Today's Mission</h2>

  <div className="mission-list">
    <div className="mission-item">✅ 30 min Mathematics</div>
    <div className="mission-item">✅ 20 English MCQs</div>
    <div className="mission-item">✅ Read Bangladesh Affairs</div>
    <div className="mission-item">✅ Review Wrong Answers</div>
  </div>
</section>

<section className="progress-card">
  <h2>Overall Progress</h2>

  <div className="progress-bar">
    <div className="progress-fill" style={{ width: "25%" }}></div>
  </div>

  <p>25% Completed</p>
</section>
    </>
  );
}