import { useEffect, useState } from "react";
import Timer from "../components/exam/Timer";
import QuestionPalette from "../components/exam/QuestionPalette";
import { createMockSession, calculateMockResult } from "../services/examService";

export default function MockSession() {
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewQuestions, setReviewQuestions] = useState({});

  const startMock = async () => {
    const newSession = await createMockSession({
      exam: "BCS",
      count: 20,
      durationMinutes: 20,
    });

    setSession(newSession);
    setLoading(false);
  };

  useEffect(() => {
    startMock();
  }, []);

  const selectAnswer = (questionId, optionIndex) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex,
      },
    }));
  };

  const toggleReview = (questionId) => {
    setReviewQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const submitMock = () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit your mock exam?"
    );

    if (!confirmed) return;

    const finalResult = calculateMockResult(session);
    setResult(finalResult);
  };

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Loading Mock Exam...</h2>
      </div>
    );
  }

  if (!session || session.questions.length === 0) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>No questions found.</h2>
        <p>Please add questions from Question Manager first.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto" }}>
        <div className="card">
          <h1>Mock Result</h1>
          <p>Total: {result.total}</p>
          <p>Correct: {result.correct}</p>
          <p>Wrong: {result.wrong}</p>
          <p>Skipped: {result.skipped}</p>
          <p>Score: {result.score}</p>

          <button onClick={() => window.location.reload()} style={{ marginTop: "20px" }}>
            Start Again
          </button>

          <hr style={{ margin: "20px 0" }} />

          {session.questions.map((question, index) => {
            const userAnswer = session.answers[question.id];

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
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentIndex];
  const selected = session.answers[currentQuestion.id];

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        <div>
          <Timer
            initialSeconds={session.durationSeconds}
            onTimeUp={submitMock}
          />

          <div className="card" style={{ marginTop: "20px" }}>
            <h2>
              Question {session.currentIndex + 1} / {session.questions.length}
            </h2>

            <h3 style={{ marginTop: "25px" }}>{currentQuestion.question}</h3>

            <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(currentQuestion.id, index)}
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    border:
                      selected === index
                        ? "2px solid #2563eb"
                        : "1px solid #334155",
                    background:
                      selected === index ? "#2563eb" : "#16284f",
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={() => toggleReview(currentQuestion.id)}
                style={{
                  width: "40%",
                  background: reviewQuestions[currentQuestion.id]
                    ? "#f59e0b"
                    : "#475569",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {reviewQuestions[currentQuestion.id]
                  ? "★ Reviewed"
                  : "☆ Mark for Review"}
              </button>

              <button
                disabled={session.currentIndex === 0}
                onClick={() =>
                  setSession((prev) => ({
                    ...prev,
                    currentIndex: prev.currentIndex - 1,
                  }))
                }
                style={{ width: "30%" }}
              >
                Previous
              </button>

              <button
                onClick={() => {
                  if (session.currentIndex === session.questions.length - 1) {
                    submitMock();
                  } else {
                    setSession((prev) => ({
                      ...prev,
                      currentIndex: prev.currentIndex + 1,
                    }));
                  }
                }}
                style={{ width: "30%" }}
              >
                {session.currentIndex === session.questions.length - 1
                  ? "Submit Mock"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>

        <QuestionPalette
          questions={session.questions}
          answers={session.answers}
          currentIndex={session.currentIndex}
          onSelectQuestion={(index) =>
            setSession((prev) => ({
              ...prev,
              currentIndex: index,
            }))
          }
        />
      </div>
    </div>
  );
}