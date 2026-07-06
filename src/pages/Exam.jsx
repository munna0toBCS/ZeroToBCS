import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { addXP } from "../services/xpService";
import { saveMistakes } from "../services/mistakeService";
import { saveExamHistory } from "../services/examHistoryService";
import examQuestions from "../data/examQuestions";

import QuestionCard from "../components/exam/QuestionCard";
import QuestionPalette from "../components/exam/QuestionPalette";
import Timer from "../components/exam/Timer";
import SubmitDialog from "../components/exam/SubmitDialog";

export default function Exam() {
  const navigate = useNavigate();

  const [examStarted, setExamStarted] = useState(false);
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

      if (answer === undefined) skipped++;
      else if (answer === question.answer) correct++;
      else wrong++;
    });

    const score = correct - wrong * 0.25;

    const accuracy =
      correct + wrong === 0
        ? 0
        : Number(((correct / (correct + wrong)) * 100).toFixed(1));

    let grade = "Needs Improvement";

    if (accuracy >= 95) grade = "A+";
    else if (accuracy >= 90) grade = "A";
    else if (accuracy >= 80) grade = "A-";
    else if (accuracy >= 70) grade = "B";
    else if (accuracy >= 60) grade = "C";

    return { correct, wrong, skipped, score, accuracy, grade };
  }, [answers]);

  const handleSelectAnswer = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

const handleSubmit = async () => {
  setSubmitted(true);

  const user = auth.currentUser;

  if (!user) return;

  let xpReward = 20;

  if (result.grade === "A+") xpReward += 50;
  else if (result.grade === "A") xpReward += 30;
  else if (result.grade === "B") xpReward += 15;

  await addXP(user.uid, xpReward);
const mistakes = examQuestions
  .filter((question) => {
    const userAnswer = answers[question.id];
    return userAnswer !== undefined && userAnswer !== question.answer;
  })
  .map((question) => ({
    questionId: question.id,
    subject: question.subject,
    topic: question.topic,
    question: question.question,
    options: question.options,
    correctAnswer: question.answer,
    userAnswer: answers[question.id],
    explanation: question.explanation,
  }));

await saveMistakes(user.uid, mistakes);
await saveExamHistory(user.uid, {
  totalQuestions: examQuestions.length,
  answered: answeredCount,
  correct: result.correct,
  wrong: result.wrong,
  skipped: result.skipped,
  score: result.score,
  accuracy: result.accuracy,
  grade: result.grade,
  xpEarned: xpReward,
});
  alert(`⭐ ${xpReward} XP added!`);
};

  const handleTimeUp = () => {
    setSubmitted(true);
  };

  const handlePracticeRetake = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!examStarted) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h1>📝 BCS Mock Test</h1>

        <p>Questions: {examQuestions.length}</p>
        <p>Time: 50 Minutes</p>
        <p>Negative Marking: 0.25</p>
        <p>Mode: Full Exam Simulation</p>

        <button
          onClick={() => setExamStarted(true)}
          style={{ marginTop: "25px", width: "100%", padding: "15px" }}
        >
          🚀 Start Exam
        </button>
      </div>
    );
  }

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
      <div
        style={{
          position: "sticky",
          top: "20px",
          alignSelf: "start",
        }}
      >
        {!submitted && <Timer initialMinutes={50} onTimeUp={handleTimeUp} />}

        <div style={{ marginTop: "20px" }}>
          <QuestionPalette questions={examQuestions} answers={answers} />
        </div>

        {!submitted && (
          <SubmitDialog
            totalQuestions={examQuestions.length}
            answeredQuestions={answeredCount}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <div>
        <h1>BCS Mock Test</h1>

<div style={{ marginBottom: "25px" }}>
  <p>
    Answered {answeredCount} / {examQuestions.length}
  </p>

  <div
    style={{
      width: "100%",
      height: "14px",
      background: "#e5e7eb",
      borderRadius: "20px",
      overflow: "hidden",
      marginTop: "10px",
    }}
  >
    <div
      style={{
        width: `${Math.round((answeredCount / examQuestions.length) * 100)}%`,
        height: "100%",
        background: "#22c55e",
      }}
    ></div>
  </div>

  <p style={{ marginTop: "8px" }}>
    {Math.round((answeredCount / examQuestions.length) * 100)}% Completed
  </p>
</div>

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
          <div className="card" style={{ marginTop: "30px", marginBottom: "50px" }}>
            <h2>📊 Exam Result</h2>

            <hr style={{ margin: "20px 0" }} />

            <h1>🏅 Grade: {result.grade}</h1>
            <p>🏆 Score : {result.score}</p>
            <p>✅ Correct : {result.correct}</p>
            <p>❌ Wrong : {result.wrong}</p>
            <p>⚪ Skipped : {result.skipped}</p>
            <p>🎯 Accuracy : {result.accuracy}%</p>

            <hr style={{ margin: "20px 0" }} />

            <button style={{ width: "100%", marginTop: "10px" }}>
              📒 Review Wrong Answers
            </button>

            <button
              onClick={handlePracticeRetake}
              style={{ width: "100%", marginTop: "10px" }}
            >
              🔁 Practice Retake
            </button>

            <button disabled style={{ width: "100%", marginTop: "10px", opacity: 0.6 }}>
              🏛️ Official Retake Tomorrow
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{ width: "100%", marginTop: "10px" }}
            >
              🏠 Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}