import { useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";
import { getAnalytics } from "../services/analyticsService";
import { generateStudyPlan } from "../services/studyPlanService";
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

  const studyPlan = useMemo(() => {
    if (!analytics) return null;
    return generateStudyPlan(analytics);
  }, [analytics]);

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
        <h2>📅 AI Study Plan</h2>

        <div style={{ marginTop: "18px", padding: "20px", borderRadius: "16px", background: "#0f172a" }}>
          <p style={{ opacity: 0.85 }}>Focus Subject</p>
          <h2 style={{ marginTop: "10px" }}>{studyPlan?.focusSubject}</h2>

          <p style={{ marginTop: "10px" }}>
            Priority: <strong>{studyPlan?.priority}</strong> • Estimated Time:{" "}
            <strong>{studyPlan?.estimatedTime}</strong>
          </p>

          <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
            {studyPlan?.tasks.map((task, index) => (
              <div key={index} className="card" style={{ padding: "16px" }}>
                <h3>{task.title}</h3>
                <p style={{ opacity: 0.85, marginTop: "6px" }}>
                  Target: {task.target} • Reward: {task.xp} XP
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: "25px" }}>
        <h2>🧠 Performance Insight</h2>
        <p style={{ marginTop: "15px", lineHeight: "28px" }}>
          {analytics.recommendation}
        </p>
      </Card>

      <Card style={{ marginTop: "25px" }}>
        <h2>🏅 Subject Summary</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "20px" }}>
          <div style={{ background: "#14532d", padding: "20px", borderRadius: "16px" }}>
            <p style={{ opacity: 0.8 }}>🔥 Strongest Subject</p>
            <h2 style={{ marginTop: "10px" }}>{analytics.strongestSubject?.subject || "-"}</h2>
            <p style={{ marginTop: "8px" }}>
              Accuracy: {analytics.strongestSubject?.accuracy || 0}%
            </p>
          </div>

          <div style={{ background: "#7f1d1d", padding: "20px", borderRadius: "16px" }}>
            <p style={{ opacity: 0.8 }}>⚠ Weakest Subject</p>
            <h2 style={{ marginTop: "10px" }}>{analytics.weakestSubject?.subject || "-"}</h2>
            <p style={{ marginTop: "8px" }}>
              Accuracy: {analytics.weakestSubject?.accuracy || 0}%
            </p>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: "25px" }}>
        <h2>📚 Subject Performance</h2>

        {analytics.subjectPerformance?.length > 0 ? (
          <div style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
            {analytics.subjectPerformance.map((item) => (
              <div key={item.subject} className="card" style={{ padding: "16px", display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <h3 style={{ fontSize: "18px" }}>{item.subject}</h3>
                  <strong>{item.accuracy}%</strong>
                </div>

                <div style={{ width: "100%", height: "10px", background: "#1c3d85", borderRadius: "20px", overflow: "hidden" }}>
                  <div style={{ width: `${item.accuracy}%`, height: "100%", background: "linear-gradient(90deg,#00e676,#00c853)" }} />
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
            <table>
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