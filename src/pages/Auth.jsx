import { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <Login /> : <Register />}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Create new account"
            : "Already have an account? Login"}
        </button>
      </div>
    </>
  );
}