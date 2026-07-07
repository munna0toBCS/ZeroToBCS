import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PracticeSession() {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];
  const settings = location.state?.settings;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>No questions loaded.</h2>
        <p>Please start again from Practice Mode.</p>
        <button onClick={() => navigate("/practice")}>Back to Practice</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selected = selectedAnswers[currentQuestion.id];
  const answeredCount = Object.keys(selectedAnswers).length;

  const result = questions.reduce(
    (acc, question) => {
      const userAnswer = selectedAnswers[question.id];

      if (userAnswer === undefined) acc.skipped += 1;
      else if (userAnswer === question.answer) acc.correct += 1;
      else acc.wrong += 1;

      return acc;
    },
    { correct: 0, wrong: 0, skipped: 0 }
  );

  const score = Math.max(0, result.correct - result.wrong * 0.25).toFixed(2);

  const selectAnswer = (optionIndex) => {
    if (submitted) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto" }}>
        <div className="card">
          <h1>Practice Result</h1>

          <p>Correct: {result.correct}</p>
          <p>Wrong: {result.wrong}</p>
          <p>Skipped: {result.skipped}</p>
          <p>Score: {score}</p>

          <hr style={{ margin: "20px 0" }} />

          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id];

            return (
              <div key={question.id} className="card" style={{ marginTop: "15px" }}>
                <h3>Question {index + 1}</h3>
                <p><strong>{question.question}</strong></p>

                <p>
                  Your Answer:{" "}
                  {userAnswer === undefined ? "Skipped" : question.options[userAnswer]}
                </p>

                <p>Correct Answer: {question.options[question.answer]}</p>

                <p><strong>Explanation:</strong> {question.explanation || "No explanation added yet."}</p>
              </div>
            );
          })}

          <button onClick={() => navigate("/practice")} style={{ marginTop: "25px", width: "100%" }}>
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div className="card">
        <h2>Question {currentIndex + 1} / {questions.length}</h2>

        <p style={{ opacity: 0.8 }}>
          {settings?.subject} • {settings?.topic} • {settings?.difficulty}
        </p>

        <p style={{ opacity: 0.8 }}>Answered: {answeredCount} / {questions.length}</p>

        <div className="progress-bar" style={{ marginTop: "20px" }}>
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h3 style={{ marginTop: "30px" }}>{currentQuestion.question}</h3>

        <div style={{ display: "grid", gap: "15px", marginTop: "25px" }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = currentQuestion.answer === index;

            let background = "#16284f";
            let border = "1px solid #2d4b7a";

            if (selected !== undefined && isCorrect) {
              background = "#16a34a";
              border = "2px solid #22c55e";
            }

            if (selected !== undefined && isSelected && !isCorrect) {
              background = "#dc2626";
              border = "2px solid #ef4444";
            }

            return (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border,
                  background,
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        {selected !== undefined && (
          <div className="card" style={{ marginTop: "20px", background: "#0f172a" }}>
            <h3>{selected === currentQuestion.answer ? "Correct" : "Wrong"}</h3>
            <p><strong>Explanation:</strong> {currentQuestion.explanation || "No explanation added yet."}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            style={{ width: "50%", padding: "16px" }}
          >
            Previous
          </button>

          <button
            onClick={goNext}
            style={{ width: "50%", padding: "16px" }}
          >
            {currentIndex === questions.length - 1 ? "Finish Practice" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}