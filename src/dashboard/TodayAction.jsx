import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGreeting, getTodayDate } from "../utils/greeting";
import { startPractice } from "../services/practiceService";

export default function TodayAction({ displayName, recommendation }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  // The recommended subject/topic can come up empty (sparse question bank,
  // or a mistake/analytics subject string that doesn't exactly match what's
  // in Supabase). Rather than dead-ending, widen the filter step by step so
  // clicking the button almost always lands on an actual session.
  const findPracticeQuestions = async ({ exam, subject, topic, difficulty, count }) => {
    const attempts = [{ exam, subject, topic, difficulty, count }];

    if (topic) attempts.push({ exam, subject, topic: "", difficulty, count });
    if (subject) attempts.push({ exam, subject: "", topic: "", difficulty, count });

    for (const settings of attempts) {
      const practice = await startPractice(settings);
      if (practice.totalQuestions > 0) {
        return { settings, questions: practice.questions };
      }
    }

    return null;
  };

  const handleStart = async () => {
    if (!recommendation) return;

    const { action } = recommendation;
    setError(null);

    if (action.mode === "lesson") {
      navigate(`/knowledge/${action.subjectId}/${action.topicId}`);
      return;
    }

    if (action.mode === "mock") {
      navigate("/mock-session");
      return;
    }

    setStarting(true);

    try {
      const result = await findPracticeQuestions({
        exam: action.exam,
        subject: action.subject,
        topic: action.topic,
        difficulty: action.difficulty,
        count: action.count,
      });

      if (!result) {
        setError("No practice questions are available yet — check back once more are added.");
        return;
      }

      navigate("/practice-session", {
        state: { settings: result.settings, questions: result.questions },
      });
    } catch (err) {
      setError(err.message || "Something went wrong starting your session. Please try again.");
    } finally {
      setStarting(false);
    }
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

        {error && (
          <p style={{ marginTop: "15px", color: "#f87171" }}>{error}</p>
        )}
      </div>
    </section>
  );
}
