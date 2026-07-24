import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getUserProfile } from "../services/userService";
import Button from "../components/ui/Button";

export default function Profile() {
  const [university, setUniversity] = useState("");
  const [examTarget, setExamTarget] = useState("BCS");
  const [targetCadre, setTargetCadre] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [dailyGoal, setDailyGoal] = useState("2 Hours");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUniversity(profile.university || "");
        setExamTarget(profile.examTarget || "BCS");
        setTargetCadre(profile.targetCadre || "");
        setGraduationYear(profile.graduationYear || "");
        setDailyGoal(profile.dailyGoal || "2 Hours");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        university,
        examTarget,
        targetCadre,
        graduationYear,
        dailyGoal,
      },
      { merge: true }
    );

    alert("✅ Profile saved successfully!");
  };

  const labelStyle = {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
  };

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: "650px", margin: "40px auto" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "650px", margin: "40px auto" }}>
      <h1>👤 Profile Setup</h1>

      <label style={labelStyle}>🏫 Select Your University</label>
      <select value={university} onChange={(e) => setUniversity(e.target.value)} style={inputStyle}>
        <option value="">Select University</option>
        <option>BUP</option>
        <option>DU</option>
        <option>JU</option>
        <option>CU</option>
        <option>RU</option>
        <option>JNU</option>
        <option>BRUR</option>
        <option>NSU</option>
        <option>BRAC</option>
        <option>IUB</option>
        <option>AIUB</option>
        <option>EWU</option>
        <option>Other</option>
      </select>

      <label style={labelStyle}>🎯 Select Target Exam</label>
      <select value={examTarget} onChange={(e) => setExamTarget(e.target.value)} style={inputStyle}>
        <option>BCS</option>
        <option>Bank Job</option>
        <option>Primary</option>
        <option>NTRCA</option>
        <option>Railway</option>
        <option>Police</option>
      </select>

      <label style={labelStyle}>🏛️ Select Target Cadre</label>
      <select value={targetCadre} onChange={(e) => setTargetCadre(e.target.value)} style={inputStyle}>
        <option value="">Select Cadre</option>
        <option>Administration</option>
        <option>Police</option>
        <option>Foreign Affairs</option>
        <option>Tax</option>
        <option>Customs</option>
        <option>Audit & Accounts</option>
        <option>Education</option>
        <option>Information</option>
        <option>Railway</option>
        <option>Health</option>
        <option>Agriculture</option>
        <option>General</option>
      </select>

      <label style={labelStyle}>🎓 Select Graduation Year</label>
      <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} style={inputStyle}>
        <option value="">Select Graduation Year</option>
        <option>2026</option>
        <option>2027</option>
        <option>2028</option>
        <option>2029</option>
        <option>2030</option>
      </select>

      <label style={labelStyle}>⏱️ Select Daily Study Goal</label>
      <select value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} style={inputStyle}>
        <option>1 Hour</option>
        <option>2 Hours</option>
        <option>3 Hours</option>
        <option>4 Hours</option>
        <option>5+ Hours</option>
      </select>

      <div style={{ marginTop: "25px" }}>
        <Button onClick={saveProfile}>💾 Save Profile</Button>
      </div>
    </div>
  );
}