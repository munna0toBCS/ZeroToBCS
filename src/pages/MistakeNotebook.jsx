import examQuestions from "../data/examQuestions";

export default function MistakeNotebook() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>📒 Mistake Notebook</h1>

      <p style={{ marginBottom: "25px" }}>
        Your wrong answers will appear here after exam submission.
      </p>

      <div className="card">
        <h2>Coming Soon</h2>
        <p>
          We will save wrong answers from Mock Exam and show them here for revision.
        </p>

        <p>Total demo questions loaded: {examQuestions.length}</p>
      </div>
    </div>
  );
}