import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getAnalytics } from "../services/analyticsService";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getAnalytics(user.uid);
      setAnalytics(data);
    };

    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto" }}>
      <h1>📊 Analytics Dashboard</h1>

      <div className="cards">
        <StatCard icon="📝" title="Total Exams" value={analytics.totalExams} />
        <StatCard icon="📈" title="Average Score" value={analytics.averageScore || 0} />
        <StatCard icon="🎯" title="Average Accuracy" value={`${analytics.averageAccuracy}%`} />
        <StatCard icon="🥇" title="Best Accuracy" value={`${analytics.bestAccuracy || 0}%`} />
        <StatCard icon="🏆" title="Highest Score" value={analytics.highestScore} />
        <StatCard icon="⭐" title="Total XP" value={analytics.totalXPEarned} />
      </div>
<Card style={{ marginTop: "25px" }}>
  <h2>🧠 Performance Insight</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "15px",
      marginTop: "20px",
    }}
  >
    <div className="card">
      <p>Performance Level</p>
      <h2>{analytics.performanceLevel}</h2>
    </div>

    <div className="card">
      <p>Best Accuracy</p>
      <h2>{analytics.bestAccuracy || 0}%</h2>
    </div>

    <div className="card">
      <p>Average Score</p>
      <h2>{analytics.averageScore || 0}</h2>
    </div>
  </div>

  <div
    style={{
      marginTop: "20px",
      padding: "18px",
      borderRadius: "14px",
      background: "#0f172a",
    }}
  >
    <h3>Recommendation</h3>
    <p style={{ marginTop: "10px", opacity: 0.9 }}>
      {analytics.recommendation}
    </p>
  </div>
</Card>
<Card style={{ marginTop: "25px" }}>
  <h2>🏅 Subject Summary</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    <div
      style={{
        background: "#14532d",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      <p style={{ opacity: 0.8 }}>🔥 Strongest Subject</p>

      <h2 style={{ marginTop: "10px" }}>
        {analytics.strongestSubject?.subject || "-"}
      </h2>

      <p style={{ marginTop: "8px" }}>
        Accuracy: {analytics.strongestSubject?.accuracy || 0}%
      </p>
    </div>

    <div
      style={{
        background: "#7f1d1d",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      <p style={{ opacity: 0.8 }}>⚠ Weakest Subject</p>

      <h2 style={{ marginTop: "10px" }}>
        {analytics.weakestSubject?.subject || "-"}
      </h2>

      <p style={{ marginTop: "8px" }}>
        Accuracy: {analytics.weakestSubject?.accuracy || 0}%
      </p>
    </div>
  </div>
</Card>
<Card style={{ marginTop: "25px" }}>
  <h2>🤖 Smart Recommendation</h2>

  <div
    style={{
      marginTop: "18px",
      padding: "20px",
      borderRadius: "16px",
      background: "#0f172a",
    }}
  >
    <p style={{ opacity: 0.85 }}>Today’s Focus</p>

    <h2 style={{ marginTop: "10px" }}>
      {analytics.weakestSubject?.subject || "General Practice"}
    </h2>

    <p style={{ marginTop: "12px", lineHeight: "28px" }}>
      Practice 20 MCQs from{" "}
      <strong>{analytics.weakestSubject?.subject || "your weak areas"}</strong>.
      Review all wrong answers and retake one short mock test.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: "12px",
        marginTop: "18px",
      }}
    >
      <div className="card">
        <p>MCQ Target</p>
        <h2>20</h2>
      </div>

      <div className="card">
        <p>Estimated Time</p>
        <h2>35 min</h2>
      </div>

      <div className="card">
        <p>Priority</p>
        <h2>High</h2>
      </div>
    </div>
  </div>
</Card>
<Card style={{ marginTop: "25px" }}>
  <h2>📚 Subject Performance</h2>

  {analytics.subjectPerformance?.length > 0 ? (
    <div style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
      {analytics.subjectPerformance.map((item) => (
  <div
    key={item.subject}
    className="card"
    style={{
      padding: "16px",
      display: "grid",
      gap: "10px",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
      <h3 style={{ fontSize: "18px" }}>{item.subject}</h3>
      <strong>{item.accuracy}%</strong>
    </div>

    <div
      style={{
        width: "100%",
        height: "10px",
        background: "#1c3d85",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${item.accuracy}%`,
          height: "100%",
          background: "linear-gradient(90deg,#00e676,#00c853)",
        }}
      />
    </div>

    <p style={{ fontSize: "14px", opacity: 0.85 }}>
      ✅ {item.correct} &nbsp; ❌ {item.wrong} &nbsp; ⚪ {item.skipped}
    </p>
  </div>
))}
    </div>
  ) : (
    <p style={{ marginTop: "15px", opacity: 0.8 }}>
      No subject data yet. Submit a new mock exam first.
    </p>
  )}
</Card>

<Card style={{ marginTop: "25px" }}>
  <h2>Recent Exam History</h2>

        {analytics.exams && analytics.exams.length > 0 ? (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>XP</th>
                </tr>
              </thead>

              <tbody>
                {analytics.exams.slice(0, 10).map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.score || 0}</td>
                    <td>{exam.accuracy || 0}%</td>
                    <td>{exam.correct || 0}</td>
                    <td>{exam.wrong || 0}</td>
                    <td>{exam.skipped || 0}</td>
                    <td>{exam.xpEarned || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ marginTop: "15px", opacity: 0.8 }}>
            No exam history yet.
          </p>
        )}
      </Card>
    </div>
  );
}