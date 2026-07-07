import { useParams, useNavigate } from "react-router-dom";
import knowledgeIndex from "../data/knowledgeIndex";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const subject = knowledgeIndex[subjectId];

  if (!subject) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Subject not found</h2>
        <button onClick={() => navigate("/knowledge")}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto" }}>
      <h1>{subject.title}</h1>

      {subject.sections.map((section) => (
        <div key={section.id} className="card" style={{ marginTop: "25px" }}>
          <h2>{section.title}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {section.topics.map((topic) => (
              <div
                key={topic.id}
                className="card"
                onClick={() =>
                  navigate(`/knowledge/${subject.id}/${topic.id}`)
                }
                style={{ cursor: "pointer", background: "#0f172a" }}
              >
                <h3>{topic.title}</h3>
                <p style={{ marginTop: "8px", opacity: 0.8 }}>
                  {topic.difficulty} • {topic.estimatedTime}
                </p>
                <p style={{ marginTop: "8px", opacity: 0.8 }}>
                  Lessons: {topic.stats.totalLessons}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}