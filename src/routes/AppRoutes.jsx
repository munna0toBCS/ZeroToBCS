import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Syllabus from "../pages/Syllabus";
import StudyPlanner from "../pages/StudyPlanner";

import Mentor from "../pages/Mentor";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Exam from "../pages/Exam";
import Practice from "../pages/Practice";
import MockExam from "../pages/MockExam";
import MockSession from "../pages/MockSession";
import PracticeSession from "../pages/PracticeSession";
import MistakeNotebook from "../pages/MistakeNotebook";
import Curriculum from "../pages/Curriculum";
import Admin from "../pages/Admin";
import QuestionManager from "../pages/QuestionManager";
import QuestionImporter from "../pages/QuestionImporter";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
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
  path="/mock"
  element={
    <ProtectedRoute>
      <MockExam />
    </ProtectedRoute>
  }
/>
<Route
  path="/mock-session"
  element={
    <ProtectedRoute>
      <MockSession />
    </ProtectedRoute>
  }
/>
<Route
  path="/practice"
  element={
    <ProtectedRoute>
      <Practice />
    </ProtectedRoute>
  }
/>
<Route
  path="/practice-session"
  element={
    <ProtectedRoute>
      <PracticeSession />
    </ProtectedRoute>
  }
/>
<Route
  path="/curriculum"
  element={
    <ProtectedRoute>
      <Curriculum />
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
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <Admin />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/question-importer"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <QuestionImporter />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/question-manager"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <QuestionManager />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}