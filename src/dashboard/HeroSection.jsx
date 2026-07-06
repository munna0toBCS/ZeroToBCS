import { getGreeting, getTodayDate } from "../utils/greeting";

const quotes = [
  "Discipline beats motivation.",
  "One mock exam today is better than ten plans tomorrow.",
  "Small progress every day becomes big success.",
  "Consistency is the real shortcut.",
  "Your future cadre life starts with today’s effort.",
];

export default function HeroSection({ profile, displayName }) {
  const greeting = getGreeting();
  const today = getTodayDate();

  const quote =
    quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <section className="hero">
      <span className="badge">ZeroToBCS V3</span>

      <h1>
        👋 {greeting}, {displayName}
      </h1>

      <p>Today • {today}</p>

      <p>
        🎯 Target: {profile?.examTarget || "BCS"} —{" "}
        {profile?.targetCadre || "Administration"}
      </p>

      <p>
        🏫 University: {profile?.university || "Not set"}
      </p>

      <p>
        🎓 Graduation Year:{" "}
        {profile?.graduationYear || "Not set"}
      </p>

      <p>
        ⏱️ Daily Goal:{" "}
        {profile?.dailyGoal || "2 Hours"}
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>💬 Quote of the Day</h3>

        <p
          style={{
            marginTop: "8px",
            fontStyle: "italic",
          }}
        >
          "{quote}"
        </p>
      </div>
    </section>
  );
}