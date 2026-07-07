export const createTopic = ({
  id,
  title,
  difficulty = "Beginner",
  estimatedTime = "30 min",
  exams = ["BCS"],
  lessons = [],
  relatedTopics = [],
  masteryRequired = 80,
}) => ({
  id,
  title,
  difficulty,
  estimatedTime,
  exams,
  lessons,
  relatedTopics,
  masteryRequired,
  stats: {
    totalLessons: lessons.length,
    practiceQuestions: 0,
    previousQuestions: 0,
  },
});

export const createLesson = ({
  id,
  title,
  type = "Concept",
  content = "",
  examples = [],
  commonMistakes = [],
  shortcuts = [],
}) => ({
  id,
  title,
  type,
  content,
  examples,
  commonMistakes,
  shortcuts,
});