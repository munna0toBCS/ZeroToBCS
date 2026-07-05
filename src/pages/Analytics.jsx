export default function Analytics() {
  return (
    <>
      <h1>Analytics Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Study</h3>
          <h2>125 Hours</h2>
        </div>

        <div className="card">
          <h3>Current Streak</h3>
          <h2>7 Days 🔥</h2>
        </div>

        <div className="card">
          <h3>XP Earned</h3>
          <h2>3,250 XP</h2>
        </div>

        <div className="card">
          <h3>Rank</h3>
          <h2>Cadet ⭐</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h2>Weekly Progress</h2>

        <div
          style={{
            height: "20px",
            background: "#102c6b",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              width: "72%",
              height: "100%",
              background: "#4CAF50",
            }}
          />
        </div>

        <p style={{ marginTop: "15px" }}>
          72% Weekly Goal Completed
        </p>
      </div>
    </>
  );
}