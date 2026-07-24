import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!adminEmails.includes(currentUser.email)) {
    return <Navigate to="/today" replace />;
  }

  return children;
}