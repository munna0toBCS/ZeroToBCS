import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getOrCreateSupabaseUserProfile } from "../services/supabaseUserService";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
     const userCredential = await signInWithEmailAndPassword(auth, email, password);

await getOrCreateSupabaseUserProfile(userCredential.user);

      alert("✅ Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
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
        onClick={handleLogin}
        style={{ marginTop: "20px", width: "100%" }}
      >
        🔐 Login
      </button>
    </div>
  );
}