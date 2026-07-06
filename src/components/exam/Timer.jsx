import { useEffect, useState } from "react";

export default function Timer({
  initialMinutes,
  onTimeUp,
}) {
  const [secondsLeft, setSecondsLeft] = useState(
    initialMinutes * 60
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
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
    <div className="card">
      <h3>⏱ Time Remaining</h3>

      <h1>
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </h1>
    </div>
  );
}