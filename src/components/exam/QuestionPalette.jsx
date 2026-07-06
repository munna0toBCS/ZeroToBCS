export default function QuestionPalette({
  questions,
  answers,
}) {
  return (
    <div className="card">
      <h3>Question Palette</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {questions.map((question, index) => {
          const answered =
            answers[question.id] !== undefined;

          return (
            <button
              key={question.id}
              onClick={() =>
                document
                  .getElementById(`question-${question.id}`)
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: answered
                  ? "#22c55e"
                  : "#e5e7eb",
                color: answered ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>🟢 Answered</p>
        <p>⚪ Unanswered</p>
      </div>
    </div>
  );
}