import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        university: "",
        targetCadre: "",
        examTarget: "BCS",
        xp: 0,
        level: "Cadet",
        createdAt: new Date(),
      });

      alert("✅ Account Created Successfully!");

      setName("");
      setEmail("");
      setPassword("");

      navigate("/today");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "20px", borderRadius: "10px" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "15px", borderRadius: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "12px", marginTop: "15px", borderRadius: "10px" }}
      />

      <button onClick={handleRegister} style={{ marginTop: "20px", width: "100%" }}>
        🚀 Create Account
      </button>
    </div>
  );
}