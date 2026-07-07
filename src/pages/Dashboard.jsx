import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserProfile } from "../services/userService";
import { getPlannerTasks } from "../services/plannerService";
import { getAnalytics } from "../services/analyticsService";
import { updateDailyStreak } from "../services/streakService";
import { generateDailyMission } from "../services/dailyMissionService";
import { getOrCreateDailyMission } from "../services/userMissionService";
import HeroSection from "../dashboard/HeroSection";
import StatsSection from "../dashboard/StatsSection";
import MissionSection from "../dashboard/MissionSection";
import QuickActions from "../dashboard/QuickActions";
import ProgressSection from "../dashboard/ProgressSection";
import AchievementSection from "../dashboard/AchievementSection";
import PriorityTopics from "../dashboard/PriorityTopics";
export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [mission, setMission] = useState(null);
  const [streak, setStreak] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const loadDashboard = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const [
        profileData,
        plannerTasks,
        analyticsData,
        streakData,
      ] = await Promise.all([
        getUserProfile(user.uid),
        getPlannerTasks(user.uid),
        getAnalytics(user.uid),
        updateDailyStreak(user.uid),
      ]);

      setProfile(profileData);
setTasks(plannerTasks);
setAnalytics(analyticsData);
setStreak(streakData);

const todayMission = await getOrCreateDailyMission(
  user.uid,
  analyticsData
);

setMission(todayMission);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "600px", margin: "40px auto" }}>
        <h2>Preparing your dashboard...</h2>
      </div>
    );
  }

  const displayName =
    profile?.name || profile?.email?.split("@")[0] || "Cadet";

  const completedTasks = tasks.filter((task) => task.done).length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <HeroSection
        profile={profile}
        displayName={displayName}
      />

      <StatsSection
        profile={profile}
        streak={streak}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
        accuracy={analytics?.averageAccuracy || 0}
      />

    <MissionSection
  mission={mission}
  tasks={mission?.tasks || []}
/>

      <QuickActions />
<PriorityTopics />
      <ProgressSection
        completedTasks={completedTasks}
        totalTasks={tasks.length}
      />

      <AchievementSection
        streak={streak}
        xp={profile?.xp || 0}
        completedTasks={completedTasks}
      />
    </div>
  );
}