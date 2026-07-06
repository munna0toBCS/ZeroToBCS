import { getHighPriorityTopics } from "../services/knowledgeService";

export default function PriorityTopics() {
  const topics = getHighPriorityTopics().slice(0, 4);

  return (
    <section className="mission-card">
      <h2>🔥 High Priority Topics</h2>

      <div className="mission-list">
        {topics.map((topic) => (
          <div className="mission-item" key={topic.id}>
            <strong>{topic.topic}</strong> — {topic.subject}
            <br />
            Priority: {"⭐".repeat(topic.priority)}
            <br />
            {topic.recommendation}
          </div>
        ))}
      </div>
    </section>
  );
}