import { knowledgeCore } from "../data/knowledgeCore";

// Get all topics
export const getKnowledgeCore = () => {
  return knowledgeCore;
};

// Get topics by subject
export const getTopicsBySubject = (subject) => {
  return knowledgeCore.filter(
    (item) => item.subject === subject
  );
};

// Get single topic
export const getTopic = (topicId) => {
  return knowledgeCore.find(
    (item) => item.id === topicId
  );
};

// High priority topics
export const getHighPriorityTopics = () => {
  return knowledgeCore
    .filter((item) => item.priority >= 5)
    .sort((a, b) => b.priority - a.priority);
};

// Recommended topics
export const getRecommendedTopics = (limit = 5) => {
  return knowledgeCore
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
};