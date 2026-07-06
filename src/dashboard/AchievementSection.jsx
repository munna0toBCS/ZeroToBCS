export default function AchievementSection({
  streak,
  xp,
  completedTasks,
}) {
  return (
    <section className="mission-card">
      <h2>🏆 Achievements</h2>

      <div className="mission-list">
        {completedTasks > 0 ? (
          <div className="mission-item">
            ✅ First Task Completed
          </div>
        ) : (
          <div className="mission-item">
            ⏳ Complete your first task
          </div>
        )}

        {streak >= 3 ? (
          <div className="mission-item">
            🔥 {streak} Day Streak
          </div>
        ) : (
          <div className="mission-item">
            🔥 Build your study streak
          </div>
        )}

        {xp >= 50 ? (
          <div className="mission-item">
            ⭐ 50 XP Club
          </div>
        ) : (
          <div className="mission-item">
            ⭐ Earn your first 50 XP
          </div>
        )}

        {xp >= 500 && (
          <div className="mission-item">
            🏅 Rising BCS Aspirant
          </div>
        )}
      </div>
    </section>
  );
}