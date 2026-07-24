import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "../pages/Auth";
import Today from "../pages/Today";
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
import QuestionManager from "../pages/QuestionManager";
import QuestionImporter from "../pages/QuestionImporter";
import KnowledgeHub from "../knowledge/pages/KnowledgeHub";
import SubjectPage from "../knowledge/pages/SubjectPage";
import TopicPage from "../knowledge/pages/TopicPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" />} />

      <Route path="/auth" element={<Auth />} />

      <Route
        path="/today"
        element={
          <ProtectedRoute>
            <Today />
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
  path="/knowledge"
  element={
    <ProtectedRoute>
      <KnowledgeHub />
    </ProtectedRoute>
  }
/>
<Route
  path="/knowledge/:subjectId"
  element={
    <ProtectedRoute>
      <SubjectPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/knowledge/:subjectId/:topicId"
  element={
    <ProtectedRoute>
      <TopicPage />
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