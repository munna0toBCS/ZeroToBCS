import StatCard from "../components/ui/StatCard";

export default function StatsSection({
  profile,
  streak,
  completedTasks,
  totalTasks,
  accuracy = 0,
}) {
  return (
    <section className="cards">
      <StatCard
        icon="⭐"
        title="XP"
        value={profile?.xp ?? 0}
      />

      <StatCard
        icon="🏅"
        title="Level"
        value={profile?.level || "Cadet"}
      />

      <StatCard
        icon="🔥"
        title="Streak"
        value={`${streak} Day`}
      />

      <StatCard
        icon="🎯"
        title="Accuracy"
        value={`${accuracy}%`}
      />

      <StatCard
        icon="✅"
        title="Tasks Done"
        value={`${completedTasks}/${totalTasks}`}
      />
    </section>
  );
}