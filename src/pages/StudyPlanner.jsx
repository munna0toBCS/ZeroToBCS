export default function StudyPlanner() {
  return (
    <>
      <h1>Study Planner</h1>

      <div className="cards">
        <div className="card">
          <h3>Today's Target</h3>
          <h2>8 Hours</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>2 Hours</h2>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <h2>6 Hours</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Today's Routine</h3>

        <p>🕗 8:00 AM - English</p>
        <p>🕙 10:00 AM - Bangladesh Affairs</p>
        <p>🕐 1:00 PM - Mathematics</p>
        <p>🕓 4:00 PM - ICT</p>
        <p>🕖 7:00 PM - MCQ Practice</p>
      </div>
    </>
  );
}