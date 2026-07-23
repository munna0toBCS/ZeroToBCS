import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGreeting, getTodayDate } from "../utils/greeting";
import { startPractice } from "../services/practiceService";

export default function TodayAction({ displayName, recommendation }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (!recommendation) return;

    const { action } = recommendation;

    if (action.mode === "lesson") {
      navigate(`/knowledge/${action.subjectId}/${action.topicId}`);
      return;
    }

    if (action.mode === "mock") {
      navigate("/mock-session");
      return;
    }

    setStarting(true);

    const practice = await startPractice({
      exam: action.exam,
      subject: action.subject,
      topic: action.topic,
      difficulty: action.difficulty,
      count: action.count,
    });

    setStarting(false);

    if (practice.totalQuestions === 0) {
      alert("No questions found for this yet. Try again once more questions are added.");
      return;
    }

    navigate("/practice-session", {
      state: {
        settings: {
          exam: action.exam,
          subject: action.subject,
          topic: action.topic,
          difficulty: action.difficulty,
          count: action.count,
        },
        questions: practice.questions,
      },
    });
  };

  return (
    <section className="hero">
      <span className="badge">ZeroToBCS</span>

      <h1>
        👋 {getGreeting()}, {displayName}
      </h1>

      <p>Today • {getTodayDate()}</p>

      <div style={{ marginTop: "25px" }}>
        <p style={{ fontSize: "18px", opacity: 0.85 }}>
          {recommendation?.reason}
        </p>

        <button
          onClick={handleStart}
          disabled={starting}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "20px",
            border: "none",
            borderRadius: "16px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: starting ? "not-allowed" : "pointer",
            opacity: starting ? 0.7 : 1,
          }}
        >
          {starting ? "Preparing your session..." : "🚀 Start Today's Session"}
        </button>
      </div>
    </section>
  );
}
