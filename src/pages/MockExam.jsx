import { useNavigate } from "react-router-dom";

export default function MockExam() {
  const navigate = useNavigate();

  const exams = [
    {
      title: "🏆 BCS Full Mock",
      questions: 200,
      time: "200 Minutes",
      description: "Complete BCS Preliminary Simulation",
      button: "Start Full Mock",
      action: () => navigate("/exam"),
      color: "#2563eb",
    },
    {
      title: "📚 Subject Mock",
      questions: "Custom",
      time: "Flexible",
      description: "Practice one subject under exam conditions.",
      button: "Coming Soon",
      disabled: true,
      color: "#334155",
    },
    {
      title: "📜 Previous BCS Mock",
      questions: "Previous",
      time: "Real Exam",
      description: "Solve previous BCS Preliminary papers.",
      button: "Coming Soon",
      disabled: true,
      color: "#334155",
    },
    {
      title: "🏦 Bank Job Mock",
      questions: "Custom",
      time: "Real Exam",
      description: "Bank recruitment examination simulation.",
      button: "Coming Soon",
      disabled: true,
      color: "#334155",
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto" }}>
      <h1 style={{ marginBottom: "10px" }}>📝 Mock Exam Center</h1>

      <p
        style={{
          opacity: 0.8,
          marginBottom: "30px",
        }}
      >
        Experience a real competitive exam environment.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {exams.map((exam) => (
          <div
            key={exam.title}
            className="card"
          >
            <h2>{exam.title}</h2>

            <hr
              style={{
                margin: "15px 0",
                opacity: 0.2,
              }}
            />

            <p>
              <strong>Questions:</strong> {exam.questions}
            </p>

            <p>
              <strong>Time:</strong> {exam.time}
            </p>

            <p
              style={{
                marginTop: "15px",
                opacity: 0.8,
              }}
            >
              {exam.description}
            </p>

            <button
              disabled={exam.disabled}
              onClick={exam.action}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background: exam.color,
                color: "#fff",
                fontSize: "16px",
                cursor: exam.disabled
                  ? "not-allowed"
                  : "pointer",
                opacity: exam.disabled ? 0.6 : 1,
              }}
            >
              {exam.button}
            </button>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{
          marginTop: "35px",
        }}
      >
        <h2>🔥 Upcoming Features</h2>

        <ul
          style={{
            lineHeight: "35px",
            marginTop: "20px",
          }}
        >
          <li>✅ Full BCS Mock (200 Questions)</li>
          <li>✅ Previous BCS Papers</li>
          <li>✅ Subject-wise Mock</li>
          <li>✅ Smart Performance Analysis</li>
          <li>✅ Weak Topic Detection</li>
          <li>✅ AI Mentor Recommendation</li>
          <li>✅ National Leaderboard</li>
          <li>✅ Negative Marking</li>
          <li>✅ Auto Submit</li>
          <li>✅ Resume Interrupted Exam</li>
        </ul>
      </div>
    </div>
  );
}