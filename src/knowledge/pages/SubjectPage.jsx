import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import knowledgeIndex from "../data/knowledgeIndex";
import { getSubjectMasteryProgress } from "../services/masteryProgressService";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);

  const subject = knowledgeIndex[subjectId];

  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;

      if (!user || !subject) return;

      const allTopics = subject.sections.flatMap(
        (section) => section.topics
      );

      const data = await getSubjectMasteryProgress(
        user.uid,
        subjectId,
        allTopics
      );

      setProgress(data);
    };

    loadProgress();
  }, [subject, subjectId]);

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

      {progress && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h2>Learning Progress</h2>

          <p style={{ marginTop: "10px" }}>
            {progress.masteredTopics} / {progress.totalTopics} Topics Mastered
          </p>

          <div
            style={{
              width: "100%",
              height: "12px",
              background: "#1e293b",
              borderRadius: "20px",
              marginTop: "15px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress.progress}%`,
                height: "100%",
                background: "#22c55e",
              }}
            />
          </div>

          <p style={{ marginTop: "10px" }}>
            {progress.progress}% Completed
          </p>
        </div>
      )}

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
            {section.topics.map((topic) => {
              const mastered =
                progress?.masteredIds?.has(topic.id);

              return (
                <div
                  key={topic.id}
                  className="card"
                  onClick={() =>
                    navigate(`/knowledge/${subject.id}/${topic.id}`)
                  }
                  style={{
                    cursor: "pointer",
                    background: mastered ? "#14532d" : "#0f172a",
                    border: mastered
                      ? "2px solid #22c55e"
                      : "1px solid #334155",
                  }}
                >
                  <h3>
                    {mastered ? "✅ " : ""}
                    {topic.title}
                  </h3>

                  <p style={{ marginTop: "8px", opacity: 0.8 }}>
                    {topic.difficulty} • {topic.estimatedTime}
                  </p>

                  <p style={{ marginTop: "8px", opacity: 0.8 }}>
                    Lessons: {topic.stats.totalLessons}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}