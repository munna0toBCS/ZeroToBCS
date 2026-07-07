import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
console.log("Current User:", currentUser?.email);
const adminEmails = [
  "asifabdullahmunnao@gmail.com",
];

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!adminEmails.includes(currentUser.email)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}