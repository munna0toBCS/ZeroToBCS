import { useState } from "react";
import mcqs from "../data/mcqs";

export default function MCQ() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = mcqs[currentIndex];

  const handleAnswer = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("🎉 You have completed this practice set!");
      setCurrentIndex(0);
    }

    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getButtonStyle = (option) => {
    if (!isAnswered) {
      return {
        width: "100%",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      };
    }

    // Correct Answer
    if (option === currentQuestion.answer) {
      return {
        width: "100%",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "10px",
        backgroundColor: "#22c55e",
        color: "white",
        fontWeight: "bold",
        cursor: "not-allowed",
      };
    }

    // Wrong Selected Answer
    if (
      option === selectedAnswer &&
      selectedAnswer !== currentQuestion.answer
    ) {
      return {
        width: "100%",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "10px",
        backgroundColor: "#ef4444",
        color: "white",
        fontWeight: "bold",
        cursor: "not-allowed",
      };
    }

    // Other options
    return {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      borderRadius: "10px",
      opacity: 0.7,
      cursor: "not-allowed",
    };
  };

  return (
    <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>MCQ Practice</h1>

      <p>
        Question {currentIndex + 1} / {mcqs.length}
      </p>

      <hr />

      <h3 style={{ marginTop: "20px" }}>{currentQuestion.subject}</h3>

      <h2 style={{ marginTop: "15px" }}>{currentQuestion.question}</h2>

      <div style={{ marginTop: "25px" }}>
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
            style={getButtonStyle(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          {selectedAnswer === currentQuestion.answer ? (
            <>
              <h2 style={{ color: "green" }}>
                ✅ Correct! +{currentQuestion.xp} XP
              </h2>
            </>
          ) : (
            <>
              <h2 style={{ color: "red" }}>❌ Wrong Answer</h2>

              <p>
                <strong>Correct Answer:</strong> {currentQuestion.answer}
              </p>
            </>
          )}

          <p style={{ marginTop: "15px" }}>
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </p>

          <button
            onClick={nextQuestion}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
            }}
          >
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}