export const topicSchema = {
  id: "",

  title: "",

  subject: "",

  section: "",

  subSection: "",

  applicableExams: [],

  estimatedTime: 0,

  masteryXP: 0,

  prerequisites: [],

  nextTopics: [],

  learningObjectives: [],

  lessons: [],

  examples: [],

  commonMistakes: [],

  memoryTricks: [],

  previousQuestions: [],

  practiceQuestions: [],

  miniMocks: [],

  references: [],

  revision: {
    intervalDays: [1, 3, 7, 15, 30],
  },

  analytics: {
    totalQuestions: 0,
    completedQuestions: 0,
    accuracy: 0,
    mastery: 0,
  },
};