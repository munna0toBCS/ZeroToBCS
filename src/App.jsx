import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import StudyPlanner from "./pages/StudyPlanner";
import MCQ from "./pages/MCQ";
import Mentor from "./pages/Mentor";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Sidebar from "./components/Sidebar";
const stats = [
  { title: "Today's Study", value: "0 min" },
  { title: "XP", value: "0" },
  { title: "Level", value: "Cadet" },
  { title: "Accuracy", value: "0%" },
];
const missions = [
  "30 min Mathematics",
  "20 English MCQs",
  "Read Bangladesh Affairs",
  "Review Wrong Answers",
];
const progress = 25;
export default function App() {
const [page, setPage] = useState("auth");
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setPage("dashboard");
    } else {
      setPage("auth");
    }
  });

  return () => unsubscribe();
}, []);
  return (
    <div className="app">

<Sidebar setPage={setPage} />

      <main className="content">
{page === "auth" && <Auth setPage={setPage} />}
{page === "dashboard" && <Dashboard />}

{page === "syllabus" && <Syllabus />}
{page === "planner" && <StudyPlanner />}

{page === "mcq" && <MCQ />}

{page === "mentor" && <Mentor />}

{page === "analytics" && <Analytics />}
      </main>

    </div>
  );
}