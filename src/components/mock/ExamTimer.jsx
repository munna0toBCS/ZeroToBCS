import { useEffect, useState } from "react";

export default function ExamTimer({
  durationMinutes = 200,
  onTimeUp,
}) {
  const [secondsLeft, setSecondsLeft] = useState(
    durationMinutes * 60
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>⏳ Time Remaining</h3>
      <h2>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h2>
    </div>
  );
}