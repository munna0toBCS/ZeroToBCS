export default function SubmitDialog({
  totalQuestions,
  answeredQuestions,
  onSubmit,
}) {
  const unanswered = totalQuestions - answeredQuestions;

  const handleSubmit = () => {
    const confirmSubmit = window.confirm(
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s).\n\nDo you still want to submit the exam?`
        : "Are you sure you want to submit the exam?"
    );

    if (confirmSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>Submit Exam</h2>

      <p>Total Questions: {totalQuestions}</p>
      <p>Answered: {answeredQuestions}</p>
      <p>Unanswered: {unanswered}</p>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "15px",
          fontSize: "18px",
        }}
      >
        ✅ Submit Exam
      </button>
    </div>
  );
}