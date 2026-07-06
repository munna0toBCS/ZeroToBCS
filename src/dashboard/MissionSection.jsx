export default function MissionSection({ tasks }) {
  return (
    <section className="mission-card">
      <h2>🎯 Today's Mission</h2>

      <div className="mission-list">
        {tasks.length === 0 ? (
          <p>No planner tasks yet. Add tasks from Study Planner.</p>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <div className="mission-item" key={task.id}>
              {task.done ? "✅" : "⬜"} {task.text}
            </div>
          ))
        )}
      </div>
    </section>
  );
}