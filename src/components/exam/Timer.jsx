import { useEffect, useState } from "react";

export default function Timer({ initialSeconds = 1200, onTimeUp }) {
  const safeSeconds = Number(initialSeconds) || 1200;
  const [secondsLeft, setSecondsLeft] = useState(safeSeconds);

  useEffect(() => {
    setSecondsLeft(safeSeconds);
  }, [safeSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>Time Remaining</h3>
      <h1>
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </h1>
    </div>
  );
}