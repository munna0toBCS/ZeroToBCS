import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Syllabus from "../pages/Syllabus";
import StudyPlanner from "../pages/StudyPlanner";
import MCQ from "../pages/MCQ";
import Mentor from "../pages/Mentor";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/syllabus" element={<Syllabus />} />
      <Route path="/planner" element={<StudyPlanner />} />
      <Route path="/mcq" element={<MCQ />} />
      <Route path="/mentor" element={<Mentor />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}