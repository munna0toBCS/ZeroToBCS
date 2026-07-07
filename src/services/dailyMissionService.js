import { generateStudyPlan } from "./studyPlanService";

export function generateDailyMission(analytics) {
  const plan = generateStudyPlan(analytics);

  const tasks = plan.tasks.map((task, index) => ({
    id: `mission-${index + 1}`,
    title: task.title,
    target: task.target,
    xp: task.xp,
    completed: false,
  }));

  return {
    title: "Today's Mission",
    focusSubject: plan.focusSubject,
    priority: plan.priority,
    estimatedTime: plan.estimatedTime,
    rewardXP: tasks.reduce((sum, task) => sum + task.xp, 0),
    tasks,
  };
}