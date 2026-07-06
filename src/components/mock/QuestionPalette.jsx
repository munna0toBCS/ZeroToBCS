export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  answeredQuestions = [],
  onSelectQuestion,
}) {
  return (
    <div
      className="card"
      style={{
        position: "sticky",
        top: "20px",
      }}
    >
      <h3>Question Palette</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isCurrent = currentQuestion === index;

          const isAnswered =
            answeredQuestions.includes(index);

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              style={{
                height: "46px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",

                background: isCurrent
                  ? "#2563eb"
                  : isAnswered
                  ? "#16a34a"
                  : "#334155",

                color: "#fff",
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "25px",
          fontSize: "14px",
          lineHeight: "28px",
        }}
      >
        <div>🟦 Current Question</div>
        <div>🟩 Answered</div>
        <div>⬛ Not Answered</div>
      </div>
    </div>
  );
}