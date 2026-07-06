import { useState } from "react";

export default function PracticeSession() {
  const [currentQuestion] = useState(1);
  const [totalQuestions] = useState(20);

  const sampleQuestion = {
    question: "Choose the correct sentence.",
    options: [
      "He go to school every day.",
      "He goes to school every day.",
      "He going to school every day.",
      "He gone to school every day.",
    ],
    answer: 1,
  };

  const [selected, setSelected] = useState(null);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div className="card">
        <h2>
          Question {currentQuestion} / {totalQuestions}
        </h2>

        <div
          className="progress-bar"
          style={{ marginTop: "20px" }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${(currentQuestion / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <h3 style={{ marginTop: "30px" }}>
          {sampleQuestion.question}
        </h3>

        <div
          style={{
            display: "grid",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          {sampleQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border:
                  selected === index
                    ? "2px solid #3b82f6"
                    : "1px solid #2d4b7a",
                background:
                  selected === index
                    ? "#2850b8"
                    : "#16284f",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        <button
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          Next Question →
        </button>
      </div>
    </div>
  );
}