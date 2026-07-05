export default function MCQ() {
  return (
    <>
      <h1>MCQ Exam</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Questions</h3>
          <h2>200</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>35</h2>
        </div>

        <div className="card">
          <h3>Accuracy</h3>
          <h2>82%</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h2>Start Today's MCQ Test</h2>

        <button style={{ marginTop: "15px" }}>
          🚀 Start Exam
        </button>
      </div>

      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Practice Sets</h3>

        <button style={{ margin: "10px" }}>Bangladesh Affairs Practice</button>
        <button style={{ margin: "10px" }}>English Practice</button>
        <button style={{ margin: "10px" }}>Mathematics Practice</button>
        <button style={{ margin: "10px" }}>ICT Practice</button>
        <button style={{ margin: "10px" }}>Full Mock Test</button>
      </div>

      <div className="card" style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
        <h3>Recent Results</h3>

        <p>✅ Bangladesh Affairs - 18/20</p>
        <p>✅ English - 16/20</p>
        <p>✅ ICT - 19/20</p>
        <p>⭐ Best Accuracy: 95%</p>
      </div>

      <div className="card" style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
        <h3>Performance Summary</h3>

        <p>📚 Total Practice: 35 Sets</p>
        <p>🎯 Average Accuracy: 82%</p>
        <p>🔥 Current Streak: 7 Days</p>
        <p>🏆 Highest Score: 96%</p>
      </div>
    </>
  );
}