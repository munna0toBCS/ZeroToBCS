export default function MockQuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}) {
  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <h3>
        {questionNumber}. {question.question}
      </h3>

      <div style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(question.id, index)}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border:
                selectedAnswer === index
                  ? "2px solid #3b82f6"
                  : "1px solid #2d4b7a",
              background:
                selectedAnswer === index ? "#2850b8" : "#16284f",
              color: "white",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>
    </div>
  );
}