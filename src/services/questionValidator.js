export const validateQuestion = (question) => {
  const errors = [];

  if (!question.id) errors.push("Missing question id");
  if (!question.exam) errors.push("Missing exam");
  if (!question.subject) errors.push("Missing subject");
  if (!question.topic) errors.push("Missing topic");
  if (!question.question) errors.push("Missing question text");

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push("Question must have exactly 4 options");
  }

  if (
    typeof question.answer !== "number" ||
    question.answer < 0 ||
    question.answer > 3
  ) {
    errors.push("Answer must be a number between 0 and 3");
  }

  if (!question.explanation) errors.push("Missing explanation");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateQuestionBank = (questions) => {
  const ids = new Set();
  const errors = [];

  questions.forEach((question, index) => {
    const result = validateQuestion(question);

    if (!result.isValid) {
      errors.push({
        index,
        id: question.id || "NO_ID",
        errors: result.errors,
      });
    }

    if (ids.has(question.id)) {
      errors.push({
        index,
        id: question.id,
        errors: ["Duplicate question id"],
      });
    }

    ids.add(question.id);
  });

  return {
    isValid: errors.length === 0,
    totalQuestions: questions.length,
    errors,
  };
};