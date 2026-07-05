import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Profile() {
  const [university, setUniversity] = useState("");
  const [targetCadre, setTargetCadre] = useState("");
  const [examTarget, setExamTarget] = useState("BCS");

  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      university,
      targetCadre,
      examTarget,
      xp: 0,
      level: "Cadet",
      createdAt: new Date(),
    });

    alert("✅ Profile saved successfully!");
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Complete Your Profile</h1>

      <input
        placeholder="University"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "20px" }}
      />

      <input
        placeholder="Target Cadre"
        value={targetCadre}
        onChange={(e) => setTargetCadre(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "15px" }}
      />

      <select
        value={examTarget}
        onChange={(e) => setExamTarget(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "15px" }}
      >
        <option>BCS</option>
        <option>Bank Job</option>
        <option>Primary</option>
        <option>NTRCA</option>
        <option>Railway</option>
        <option>Police</option>
      </select>

      <button onClick={saveProfile} style={{ marginTop: "20px", width: "100%" }}>
        💾 Save Profile
      </button>
    </div>
  );
}