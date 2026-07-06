import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Syllabus from "../pages/Syllabus";
import StudyPlanner from "../pages/StudyPlanner";
import MCQ from "../pages/MCQ";
import Mentor from "../pages/Mentor";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Exam from "../pages/Exam";
import MistakeNotebook from "../pages/MistakeNotebook";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/auth" element={<Auth />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/syllabus"
        element={
          <ProtectedRoute>
            <Syllabus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <StudyPlanner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mcq"
        element={
          <ProtectedRoute>
            <MCQ />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor"
        element={
          <ProtectedRoute>
            <Mentor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
  path="/exam"
  element={
    <ProtectedRoute>
      <Exam />
    </ProtectedRoute>
  }
/>
<Route
  path="/mistakes"
  element={
    <ProtectedRoute>
      <MistakeNotebook />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}