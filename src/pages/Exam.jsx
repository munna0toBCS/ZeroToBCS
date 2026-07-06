import { useMemo, useState } from "react";

import examQuestions from "../data/examQuestions";

import QuestionCard from "../components/exam/QuestionCard";
import QuestionPalette from "../components/exam/QuestionPalette";
import Timer from "../components/exam/Timer";
import SubmitDialog from "../components/exam/SubmitDialog";

export default function Exam() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const result = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    examQuestions.forEach((question) => {
      const answer = answers[question.id];

      if (answer === undefined) {
        skipped++;
      } else if (answer === question.answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct - wrong * 0.25;

    const accuracy =
      correct + wrong === 0
        ? 0
        : ((correct / (correct + wrong)) * 100).toFixed(1);

    return {
      correct,
      wrong,
      skipped,
      score,
      accuracy,
    };
  }, [answers]);

  const handleSelectAnswer = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleTimeUp = () => {
    setSubmitted(true);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "20px",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          position: "sticky",
          top: "20px",
          alignSelf: "start",
        }}
      >
        <Timer
          initialMinutes={50}
          onTimeUp={handleTimeUp}
        />

        <div style={{ marginTop: "20px" }}>
          <QuestionPalette
            questions={examQuestions}
            answers={answers}
          />
        </div>

        <SubmitDialog
          totalQuestions={examQuestions.length}
          answeredQuestions={answeredCount}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Right Side */}
      <div>
        <h1>BCS Mock Test</h1>

        <p style={{ marginBottom: "25px" }}>
          Answered {answeredCount} / {examQuestions.length}
        </p>

        {examQuestions.map((question, index) => (
    <QuestionCard
  key={question.id}
  question={question}
  questionNumber={index + 1}
  selectedAnswer={answers[question.id]}
  onSelectAnswer={handleSelectAnswer}
  submitted={submitted}
/>
        ))}

        {submitted && (
          <div
            className="card"
            style={{
              marginTop: "30px",
              marginBottom: "50px",
            }}
          >
            <h2>📊 Exam Result</h2>

            <hr style={{ margin: "20px 0" }} />

            <p>🏆 Score : {result.score}</p>

            <p>✅ Correct : {result.correct}</p>

            <p>❌ Wrong : {result.wrong}</p>

            <p>⚪ Skipped : {result.skipped}</p>

            <p>🎯 Accuracy : {result.accuracy}%</p>
          </div>
        )}
      </div>
    </div>
  );
}