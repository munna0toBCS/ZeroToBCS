import { getWeakTopics } from "./mistakeService";
import { getAnalytics } from "./analyticsService";
import { getSubjectMasteryProgress } from "../knowledge/services/masteryProgressService";
import curriculum from "../knowledge/data/curriculum";

const WEAK_TOPIC_THRESHOLD = 2;
const READY_ACCURACY_THRESHOLD = 60;

const getNextEnglishTopic = async (userId) => {
  const englishTopics = curriculum.ENG.topics;

  const { masteredIds } = await getSubjectMasteryProgress(
    userId,
    "ENG",
    englishTopics
  );

  return englishTopics.find((topic) => !masteredIds.has(topic.id)) || null;
};

export const getTodayRecommendation = async (userId) => {
  const weakTopics = await getWeakTopics(userId);
  const topWeakTopic = weakTopics[0];

  if (topWeakTopic && topWeakTopic.wrongCount >= WEAK_TOPIC_THRESHOLD) {
    return {
      type: "drill",
      title: "Fix Your Weak Spot",
      subject: topWeakTopic.subject,
      topic: topWeakTopic.topic,
      reason: `You've missed ${topWeakTopic.topic} questions ${topWeakTopic.wrongCount} times — let's fix that.`,
      action: {
        mode: "practice",
        exam: "BCS",
        subject: topWeakTopic.subject,
        topic: topWeakTopic.topic,
        difficulty: "Mixed",
        count: 15,
      },
    };
  }

  const nextTopic = await getNextEnglishTopic(userId);

  if (nextTopic) {
    return {
      type: "lesson",
      title: "Learn Something New",
      subject: "English",
      topic: nextTopic.title,
      reason: `Next up: ${nextTopic.title}.`,
      action: {
        mode: "lesson",
        subjectId: "ENG",
        topicId: nextTopic.id,
      },
    };
  }

  const analytics = await getAnalytics(userId);

  if (analytics.totalExams === 0 || analytics.averageAccuracy >= READY_ACCURACY_THRESHOLD) {
    return {
      type: "mock",
      title: "You're Ready",
      subject: "BCS",
      topic: null,
      reason:
        analytics.totalExams === 0
          ? "You've mastered every English topic — time to test yourself."
          : "Your accuracy is solid — take a mock exam.",
      action: {
        mode: "mock",
      },
    };
  }

  const weakSubject = analytics.weakestSubject?.subject || "General Practice";

  return {
    type: "practice",
    title: "Sharpen Up",
    subject: weakSubject,
    topic: null,
    reason: `Let's shore up ${weakSubject} before your next mock.`,
    action: {
      mode: "practice",
      exam: "BCS",
      subject: weakSubject,
      topic: "",
      difficulty: "Mixed",
      count: 20,
    },
  };
};
