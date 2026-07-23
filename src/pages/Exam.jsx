import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { addXP } from "../services/xpService";
import { saveMistakes } from "../services/mistakeService";
import { saveExamHistory } from "../services/examHistoryService";
import { getQuestionsByFilter } from "../services/supabaseQuestionService";

import QuestionCard from "../components/exam/QuestionCard";
import QuestionPalette from "../components/exam/QuestionPalette";
import Timer from "../components/exam/Timer";
import SubmitDialog from "../components/exam/SubmitDialog";
import Button from "../components/ui/Button";

export default function Exam() {
  const navigate = useNavigate();

  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await getQuestionsByFilter({
          exam: "BCS",
          limit: 200,
        });

        setExamQuestions(questions);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, []);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const reviewCount = useMemo(
    () => Object.values(markedForReview).filter(Boolean).length,
    [markedForReview]
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

    const score = Math.max(0, correct - wrong * 0.25);
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
const subjectStats = {};

examQuestions.forEach((question) => {
  const answer = answers[question.id];
  const subject = question.subject || "General";

  if (!subjectStats[subject]) {
    subjectStats[subject] = {
      total: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
    };
  }

  subjectStats[subject].total += 1;

  if (answer === undefined) subjectStats[subject].skipped += 1;
  else if (answer === question.answer) subjectStats[subject].correct += 1;
  else subjectStats[subject].wrong += 1;
});
    return {
  correct,
  wrong,
  skipped,
  score,
  accuracy,
  grade,
  subjectStats,
};
  }, [answers, examQuestions]);

  const handleSelectAnswer = (questionId, optionIndex) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    setMarkedForReview((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const toggleReview = (questionId) => {
    if (submitted) return;

    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit?");
    if (!confirmSubmit) return;

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

    await saveExamHistory(
  user.uid,
  {
    totalQuestions: examQuestions.length,
    answered: answeredCount,
    correct: result.correct,
    wrong: result.wrong,
    skipped: result.skipped,
    score: result.score,
    accuracy: result.accuracy,
    grade: result.grade,
    xpEarned: xpReward,
  },
  result.subjectStats
);

    alert(`⭐ ${xpReward} XP added!`);
  };

  const handleTimeUp = () => {
    setSubmitted(true);
  };

  const handlePracticeRetake = () => {
    setAnswers({});
    setMarkedForReview({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingQuestions) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Loading exam questions...</h2>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2>Couldn't load exam questions</h2>
        <p style={{ marginTop: "15px", opacity: 0.8 }}>{loadError}</p>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="card" style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h1>📝 BCS Mock Test</h1>
        <p>Questions: {examQuestions.length}</p>
        <p>Time: 50 Minutes</p>
        <p>Negative Marking: 0.25</p>
        <p>Mode: Full Exam Simulation</p>

        <div style={{ marginTop: "25px" }}>
          <Button
            onClick={() => setExamStarted(true)}
            disabled={examQuestions.length === 0}
          >
            🚀 Start Exam
          </Button>
        </div>

        {examQuestions.length === 0 && (
          <p style={{ marginTop: "15px", opacity: 0.8 }}>
            No questions found. Please add questions from Question Manager first.
          </p>
        )}
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
      <div style={{ position: "sticky", top: "20px", alignSelf: "start" }}>
        {!submitted && <Timer initialSeconds={50 * 60} onTimeUp={handleTimeUp} />}

        <div style={{ marginTop: "20px" }}>
          <QuestionPalette
            questions={examQuestions}
            answers={answers}
            markedForReview={markedForReview}
            onSelectQuestion={(index, questionId) =>
              document
                .getElementById(`question-${questionId}`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
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
            Answered {answeredCount} / {examQuestions.length} | Review:{" "}
            {reviewCount}
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
                width: `${Math.round(
                  (answeredCount / examQuestions.length) * 100
                )}%`,
                height: "100%",
                background: "#22c55e",
              }}
            />
          </div>

          <p style={{ marginTop: "8px" }}>
            {Math.round((answeredCount / examQuestions.length) * 100)}%
            Completed
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
            markedForReview={markedForReview[question.id]}
            onToggleReview={toggleReview}
          />
        ))}

        {submitted && (
          <div className="card" style={{ marginTop: "30px", marginBottom: "50px" }}>
            <h2>📊 Exam Result</h2>

            <hr style={{ margin: "20px 0" }} />

            <div
  style={{
    textAlign: "center",
    marginBottom: "30px",
  }}
>
  <p
    style={{
      fontSize: "18px",
      opacity: 0.8,
      marginBottom: "8px",
    }}
  >
    🏅 Grade
  </p>

  <h1
    style={{
      fontSize: "56px",
      margin: "0",
      lineHeight: 1,
    }}
  >
    {result.grade === "A+" ||
    result.grade === "A" ||
    result.grade === "A-" ||
    result.grade === "B" ||
    result.grade === "C"
      ? result.grade
      : "D"}
  </h1>

  <p
    style={{
      marginTop: "10px",
      opacity: 0.75,
      fontSize: "18px",
    }}
  >
    {result.grade}
  </p>
</div>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
    gap: "15px",
    marginBottom: "30px",
  }}
>
  {[
    ["🏆 Score", result.score],
    ["✅ Correct", result.correct],
    ["❌ Wrong", result.wrong],
    ["⚪ Skipped", result.skipped],
    ["🟡 Review", Object.keys(markedForReview).length],
    ["🎯 Accuracy", `${result.accuracy}%`],
  ].map(([title, value]) => (
    <div
      key={title}
      style={{
        background: "#1e3a8a",
        borderRadius: "14px",
        padding: "18px",
        textAlign: "center",
      }}
    >
      <p style={{ opacity: 0.8 }}>{title}</p>

      <h2 style={{ marginTop: "8px" }}>{value}</h2>
    </div>
  ))}
</div>

            <hr style={{ margin: "20px 0" }} />

           <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
  Wrong Answer Review
</h3>

{examQuestions
  .filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.answer)
  .map((q, index) => (
    <div
      key={q.id}
      className="card"
      style={{
        marginTop: "18px",
        background: "#0f172a",
        border: "1px solid #334155",
      }}
    >
      <h3>❌ Wrong #{index + 1}</h3>

      <p style={{ fontWeight: "bold", marginTop: "15px" }}>
        {q.question}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginTop: "15px",
        }}
      >
        <div style={{ background: "#7f1d1d", padding: "12px", borderRadius: "10px" }}>
          <p>Your Answer</p>
          <h4>{q.options[answers[q.id]]}</h4>
        </div>

        <div style={{ background: "#14532d", padding: "12px", borderRadius: "10px" }}>
          <p>Correct Answer</p>
          <h4>{q.options[q.answer]}</h4>
        </div>
      </div>

      <div
        style={{
          marginTop: "15px",
          background: "#1e293b",
          padding: "14px",
          borderRadius: "10px",
        }}
      >
        <strong>Explanation:</strong>
        <p style={{ marginTop: "8px" }}>
          {q.explanation || "No explanation added yet."}
        </p>
      </div>
    </div>
  ))}

            <button onClick={handlePracticeRetake} style={{ width: "100%", marginTop: "20px" }}>
              🔁 Practice Retake
            </button>

            <button onClick={() => navigate("/dashboard")} style={{ width: "100%", marginTop: "10px" }}>
              🏠 Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}