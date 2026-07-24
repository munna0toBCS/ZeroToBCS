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
      action: () => navigate("/mock-session"),
      color: "#2563eb",
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
                cursor: "pointer",
              }}
            >
              {exam.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
