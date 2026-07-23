import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserProfile } from "../services/userService";
import { getPlannerTasks } from "../services/plannerService";
import { getAnalytics } from "../services/analyticsService";
import { updateDailyStreak } from "../services/streakService";
import { getOrCreateDailyMission } from "../services/userMissionService";
import { getTodayRecommendation } from "../services/todayService";
import TodayAction from "../dashboard/TodayAction";
import StatsSection from "../dashboard/StatsSection";
import MissionSection from "../dashboard/MissionSection";
import SecondaryActions from "../dashboard/SecondaryActions";
import AchievementSection from "../dashboard/AchievementSection";

export default function Today() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [mission, setMission] = useState(null);
  const [streak, setStreak] = useState(1);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToday = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const [profileData, plannerTasks, analyticsData, streakData, todayRecommendation] =
        await Promise.all([
          getUserProfile(user.uid),
          getPlannerTasks(user.uid),
          getAnalytics(user.uid),
          updateDailyStreak(user.uid),
          getTodayRecommendation(user.uid),
        ]);

      setProfile(profileData);
      setTasks(plannerTasks);
      setAnalytics(analyticsData);
      setStreak(streakData);
      setRecommendation(todayRecommendation);

      const todayMission = await getOrCreateDailyMission(user.uid, analyticsData);
      setMission(todayMission);

      setLoading(false);
    };

    loadToday();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Preparing your day...</h2>
      </div>
    );
  }

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Cadet";

  const completedTasks = tasks.filter((task) => task.done).length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <TodayAction displayName={displayName} recommendation={recommendation} />

      <StatsSection
        profile={profile}
        streak={streak}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
        accuracy={analytics?.averageAccuracy || 0}
      />

      <MissionSection mission={mission} tasks={mission?.tasks || []} />

      <SecondaryActions />

      <AchievementSection
        streak={streak}
        xp={profile?.xp || 0}
        completedTasks={completedTasks}
      />
    </div>
  );
}
