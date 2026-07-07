import { useNavigate } from "react-router-dom";
import subjects from "../data/subjects";

export default function KnowledgeHub() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto" }}>
      <h1>📚 Knowledge Hub</h1>

      <p style={{ marginTop: "10px", opacity: 0.8 }}>
        Learn concepts first, then practice questions.
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="card"
            onClick={() => navigate(`/knowledge/${subject.id}`)}
            style={{
              cursor: "pointer",
              borderTop: `5px solid ${subject.color}`,
            }}
          >
            <h2>
              {subject.icon} {subject.title}
            </h2>

            <p style={{ marginTop: "12px", opacity: 0.8 }}>
              {subject.description}
            </p>

            <button style={{ marginTop: "20px", width: "100%" }}>
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}