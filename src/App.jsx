import "./App.css";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="app">
      <Sidebar />

<main className="main">
        <AppRoutes />
      </main>
    </div>
  );
}