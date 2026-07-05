export default function Mentor() {
  return (
    <>
      <h1>AI Mentor</h1>

      <div className="card">
        <h2>Ask Your Mentor</h2>

        <textarea
          rows="6"
          placeholder="Ask any BCS related question..."
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#0b1f4d",
            color: "white",
            border: "none",
          }}
        />

        <button style={{ marginTop: "20px" }}>
          🤖 Ask AI
        </button>
      </div>
    </>
  );
}