import { useParams, useNavigate } from "react-router-dom";
import knowledgeIndex from "../data/knowledgeIndex";

export default function TopicPage() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const subject = knowledgeIndex[subjectId];

  const topic = subject?.sections
    .flatMap((section) => section.topics)
    .find((item) => item.id === topicId);

  if (!topic) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Topic not found</h2>
        <button onClick={() => navigate(`/knowledge/${subjectId}`)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
      <button onClick={() => navigate(`/knowledge/${subjectId}`)}>
        ← Back
      </button>

      <div className="card" style={{ marginTop: "20px" }}>
        <h1>{topic.title}</h1>

        <p style={{ marginTop: "10px", opacity: 0.8 }}>
          {topic.difficulty} • {topic.estimatedTime}
        </p>

        <p style={{ marginTop: "10px", opacity: 0.8 }}>
          Exams: {topic.exams.join(", ")}
        </p>
      </div>

      {topic.lessons.length === 0 ? (
        <div className="card" style={{ marginTop: "25px" }}>
          <h2>Lessons coming soon</h2>
          <p style={{ marginTop: "10px", opacity: 0.8 }}>
            We are preparing a simple and complete lesson for this topic.
          </p>
        </div>
      ) : (
        topic.lessons.map((lesson) => (
          <div key={lesson.id} className="card" style={{ marginTop: "25px" }}>
            <h2>{lesson.title}</h2>

            <p style={{ marginTop: "15px", lineHeight: "28px" }}>
              {lesson.content}
            </p>

            {lesson.examples.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Examples</h3>
                {lesson.examples.map((item, index) => (
                  <p key={index} style={{ marginTop: "8px" }}>
                    ✅ {item}
                  </p>
                ))}
              </div>
            )}

            {lesson.shortcuts.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Shortcuts</h3>
                {lesson.shortcuts.map((item, index) => (
                  <p key={index} style={{ marginTop: "8px" }}>
                    ⚡ {item}
                  </p>
                ))}
              </div>
            )}

            {lesson.commonMistakes.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Common Mistakes</h3>
                {lesson.commonMistakes.map((item, index) => (
                  <p key={index} style={{ marginTop: "8px" }}>
                    ⚠️ {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <div className="card" style={{ marginTop: "25px" }}>
        <h2>Next Action</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
  onClick={() =>
    navigate("/practice", {
      state: {
        subject: subject.title,
        topic: topic.title,
      },
    })
  }
>
  Practice MCQ
</button>
          <button
  onClick={() =>
    navigate("/practice", {
      state: {
        subject: subject.title,
        topic: topic.title,
        count: 10,
      },
    })
  }
>
  Mini Mock
</button>
          <button disabled>Mark as Mastered</button>
        </div>
      </div>
    </div>
  );
}