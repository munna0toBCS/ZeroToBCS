import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startPractice } from "../services/practiceService";
import { bcsSyllabus } from "../data/bcsSyllabus";

export default function Practice() {
    const navigate = useNavigate();
  const [exam, setExam] = useState("BCS");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(20);

  const exams = [
    "BCS",
    "Bank",
    "Primary",
    "NTRCA",
    "Railway",
    "Police",
  ];

  const selectedSubject = useMemo(() => {
    return bcsSyllabus.find((item) => item.subject === subject);
  }, [subject]);
const selectedTopicCount = selectedSubject
  ? selectedSubject.topics.length
  : 0;
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <div className="card">
        <h1>🎯 Practice Mode</h1>

        <p style={{ opacity: 0.8 }}>
          Choose your practice settings and start solving questions.
        </p>

        <div
          style={{
            display: "grid",
            gap: "18px",
            marginTop: "25px",
          }}
        >
          <div>
            <label>Exam</label>

            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              {exams.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Subject</label>

            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setTopic("");
              }}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <option value="">Select Subject</option>

              {bcsSyllabus.map((item) => (
                <option key={item.subject} value={item.subject}>
                  {item.icon} {item.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Topic</label>

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={!selectedSubject}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <option value="">Select Topic</option>

              {selectedSubject?.topics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Difficulty</label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <option>Mixed</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label>Number of Questions</label>

            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
onClick={() => {
  if (!subject || !topic) {
    alert("Please select Subject and Topic.");
    return;
  }

  const practice = startPractice({
    exam,
    subject,
    topic,
    difficulty,
    count,
  });

  if (practice.totalQuestions === 0) {
    alert("No questions found for this topic yet.");
    return;
  }

  navigate("/practice-session", {
    state: {
      settings: {
        exam,
        subject,
        topic,
        difficulty,
        count,
      },
      questions: practice.questions,
    },
  });
}}
            style={{
              marginTop: "10px",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            🚀 Start Practice
          </button>
          
        </div>
      </div>
    </div>
  );
}