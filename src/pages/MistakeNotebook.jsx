import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function MistakeNotebook() {
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    const loadMistakes = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const mistakesRef = collection(db, "users", user.uid, "mistakes");
      const snapshot = await getDocs(mistakesRef);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMistakes(data);
    };

    loadMistakes();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>📒 Mistake Notebook</h1>

      <p style={{ marginBottom: "25px" }}>
        Review the questions you answered wrong.
      </p>

      {mistakes.length === 0 ? (
        <div className="card">
          <h2>No mistakes yet 🎉</h2>
          <p>Take a mock exam and wrong answers will appear here.</p>
        </div>
      ) : (
        mistakes.map((mistake, index) => (
          <div key={mistake.id} className="card" style={{ marginBottom: "20px" }}>
            <h3>Question {index + 1}</h3>

            <p>
              <strong>{mistake.question}</strong>
            </p>

            <p>❌ Your Answer: {mistake.options[mistake.userAnswer]}</p>
            <p>✅ Correct Answer: {mistake.options[mistake.correctAnswer]}</p>

            <p>
              <strong>Explanation:</strong> {mistake.explanation}
            </p>
          </div>
        ))
      )}
    </div>
  );
}