import { useState } from "react";

export default function QuestionPalette({
  questions,
  answers,
  currentIndex = 0,
  markedForReview = {},
  onSelectQuestion,
}) {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Question Palette</h3>

        <button
          onClick={() => setShowLegend(!showLegend)}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            padding: 0,
          }}
        >
          i
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {questions.map((question, index) => {
          const answered = answers[question.id] !== undefined;
          const review = markedForReview[question.id];
          const current = currentIndex === index;

          let bg = "#e5e7eb";
          let color = "#111827";

          if (answered) {
            bg = "#22c55e";
            color = "#fff";
          }

          if (review) {
            bg = "#f59e0b";
            color = "#fff";
          }

          if (current) {
            bg = "#2563eb";
            color = "#fff";
          }

          return (
            <button
              key={question.id}
              onClick={() => onSelectQuestion?.(index, question.id)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: bg,
                color,
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {showLegend && (
        <div
          style={{
            marginTop: "20px",
            lineHeight: "26px",
            background: "#0f172a",
            padding: "12px",
            borderRadius: "12px",
          }}
        >
          <p>🔵 Current</p>
          <p>🟢 Answered</p>
          <p>🟡 Marked Review</p>
          <p>⚪ Unanswered</p>
        </div>
      )}
    </div>
  );
}