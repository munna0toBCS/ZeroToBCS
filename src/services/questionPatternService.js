const patternDatabase = {};

export const registerPattern = (question) => {
  if (!question.patternId) return;

  if (!patternDatabase[question.patternId]) {
    patternDatabase[question.patternId] = [];
  }

  patternDatabase[question.patternId].push(question);
};

export const getQuestionsByPattern = (patternId) => {
  return patternDatabase[patternId] || [];
};

export const getPatternStatistics = (patternId) => {
  const questions = getQuestionsByPattern(patternId);

  return {
    patternId,
    totalQuestions: questions.length,

    previousBCS: questions.filter((q) => q.isPreviousYear).length,

    averageImportance:
      questions.length === 0
        ? 0
        : (
            questions.reduce(
              (sum, q) => sum + (q.importance || 0),
              0
            ) / questions.length
          ).toFixed(1),
  };
};

export const buildPatternDatabase = (questionBank) => {
  Object.keys(patternDatabase).forEach(
    (key) => delete patternDatabase[key]
  );

  questionBank.forEach(registerPattern);

  return patternDatabase;
};