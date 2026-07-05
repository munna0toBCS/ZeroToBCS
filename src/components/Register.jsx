import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

alert("✅ Account Created Successfully!");

setName("");
setEmail("");
setPassword("");
  } catch (error) {
    alert(error.message);
  }
};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      />

  <button
  onClick={handleRegister}
  style={{ marginTop: "20px", width: "100%" }}
>
        🚀 Create Account
      </button>
    </div>
  );
}