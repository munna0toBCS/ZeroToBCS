export default function ProgressSection({
  completedTasks,
  totalTasks,
}) {
  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="progress-card">
      <h2>📊 Planner Progress</h2>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>

      <p>{progress}% Completed</p>

      <p style={{ marginTop: "10px", opacity: 0.8 }}>
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </section>
  );
}