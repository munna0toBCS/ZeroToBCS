export function generateStudyPlan(analytics) {
  const weakSubject =
    analytics?.weakestSubject?.subject || "General Practice";

  const weakAccuracy =
    analytics?.weakestSubject?.accuracy || 0;

  return {
    focusSubject: weakSubject,
    priority: weakAccuracy < 60 ? "High" : weakAccuracy < 75 ? "Medium" : "Normal",
    estimatedTime: weakAccuracy < 60 ? "45 min" : "30 min",
    tasks: [
      {
        title: `Practice ${weakSubject}`,
        target: "20 MCQs",
        xp: 40,
      },
      {
        title: "Review wrong answers",
        target: "10 minutes",
        xp: 25,
      },
      {
        title: "Take short mock",
        target: "10 Questions",
        xp: 35,
      },
    ],
  };
}