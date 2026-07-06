import { useState } from "react";
import { getKnowledgeCore } from "../services/knowledgeService";

export default function Curriculum() {
  const topics = getKnowledgeCore();
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = [
    "All",
    ...new Set(topics.map((item) => item.subject)),
  ];

  const filteredTopics =
    selectedSubject === "All"
      ? topics
      : topics.filter(
          (item) => item.subject === selectedSubject
        );

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto" }}>
      <h1>📚 Curriculum</h1>

      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        style={{
          padding: "12px",
          margin: "20px 0",
          borderRadius: "10px",
        }}
      >
        {subjects.map((subject) => (
          <option key={subject}>{subject}</option>
        ))}
      </select>

      <div className="cards">
        {filteredTopics.map((topic) => (
          <div className="card" key={topic.id}>
            <h3>{topic.topic}</h3>

            <p>
              <strong>Subject:</strong> {topic.subject}
            </p>

            <p>
              <strong>Category:</strong> {topic.category}
            </p>

            <p>
              <strong>Priority:</strong> ⭐ {topic.priority}/5
            </p>

            <p>
              <strong>Study Time:</strong>{" "}
              {topic.estimatedStudyTime} min
            </p>

            <p>
              <strong>Difficulty:</strong>{" "}
              {topic.difficulty}
            </p>

            <p>
              <strong>Recommendation:</strong>{" "}
              {topic.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}