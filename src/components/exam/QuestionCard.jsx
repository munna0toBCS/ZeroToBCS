export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}) {
  return (
    <div
      className="card"
      id={`question-${question.id}`}
      style={{ marginBottom: "25px" }}
    >
      <h3>
        Question {questionNumber}
      </h3>

      <p style={{ marginTop: "15px", fontWeight: "bold" }}>
        {question.question}
      </p>

      <div style={{ marginTop: "20px" }}>
        {question.options.map((option, index) => (
          <label
            key={index}
            style={{
              display: "block",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === index}
              onChange={() => onSelectAnswer(question.id, index)}
            />

            {"  "}
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}