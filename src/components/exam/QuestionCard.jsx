export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  submitted,
}) {
  const getOptionStyle = (index) => {
    if (!submitted) {
      return {
        display: "block",
        padding: "12px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        cursor: "pointer",
      };
    }

    if (index === question.answer) {
      return {
        display: "block",
        padding: "12px",
        marginBottom: "10px",
        border: "2px solid #22c55e",
        borderRadius: "10px",
        background: "#22c55e",
        color: "white",
        fontWeight: "bold",
      };
    }

    if (index === selectedAnswer && index !== question.answer) {
      return {
        display: "block",
        padding: "12px",
        marginBottom: "10px",
        border: "2px solid #ef4444",
        borderRadius: "10px",
        background: "#ef4444",
        color: "white",
        fontWeight: "bold",
      };
    }

    return {
      display: "block",
      padding: "12px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      opacity: 0.7,
    };
  };

  return (
    <div className="card" id={`question-${question.id}`} style={{ marginBottom: "25px" }}>
      <h3>Question {questionNumber}</h3>

      <p style={{ marginTop: "15px", fontWeight: "bold" }}>
        {question.question}
      </p>

      <div style={{ marginTop: "20px" }}>
        {question.options.map((option, index) => (
          <label key={index} style={getOptionStyle(index)}>
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === index}
              disabled={submitted}
              onChange={() => onSelectAnswer(question.id, index)}
            />

            {"  "}
            {option}
          </label>
        ))}
      </div>

      {submitted && (
        <div style={{ marginTop: "15px" }}>
          <p>
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}