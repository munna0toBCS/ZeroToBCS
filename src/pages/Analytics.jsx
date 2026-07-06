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
    <>
      <h1>📊 Analytics Dashboard</h1>

      <div className="cards">
        <StatCard icon="📝" title="Total Mock Exams" value={analytics.totalExams} />
        <StatCard icon="🎯" title="Average Accuracy" value={`${analytics.averageAccuracy}%`} />
        <StatCard icon="🏆" title="Highest Score" value={analytics.highestScore} />
        <StatCard icon="⭐" title="Total XP Earned" value={analytics.totalXPEarned} />
      </div>

      <Card style={{ marginTop: "25px" }}>
        <h2>🎯 Performance Summary</h2>

        <p>✅ Mock Exams Completed: {analytics.totalExams}</p>
        <p>🎯 Average Accuracy: {analytics.averageAccuracy}%</p>
        <p>🏆 Highest Score: {analytics.highestScore}</p>
        <p>⭐ Total XP Earned from Exams: {analytics.totalXPEarned}</p>
      </Card>
    </>
  );
}