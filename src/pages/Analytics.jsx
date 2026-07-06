import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getAnalytics } from "../services/analyticsService";

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
    <>
      <h1>📊 Analytics Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Mock Exams</h3>
          <h2>{analytics.totalExams}</h2>
        </div>

        <div className="card">
          <h3>Average Accuracy</h3>
          <h2>{analytics.averageAccuracy}%</h2>
        </div>

        <div className="card">
          <h3>Highest Score</h3>
          <h2>{analytics.highestScore}</h2>
        </div>

        <div className="card">
          <h3>Total XP Earned</h3>
          <h2>{analytics.totalXPEarned} ⭐</h2>
        </div>
      </div>

      <div className="card" style={{ marginTop: "25px" }}>
        <h2>🎯 Performance Summary</h2>

        <p>✅ Mock Exams Completed: {analytics.totalExams}</p>
        <p>🎯 Average Accuracy: {analytics.averageAccuracy}%</p>
        <p>🏆 Highest Score: {analytics.highestScore}</p>
        <p>⭐ Total XP Earned from Exams: {analytics.totalXPEarned}</p>
      </div>
    </>
  );
}