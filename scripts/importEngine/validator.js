export function removeDuplicateQuestions(questions) {
  const seen = new Set();
  const clean = [];

  for (const q of questions) {
    if (seen.has(q.questionNo)) continue;
    seen.add(q.questionNo);
    clean.push(q);
  }

  return clean.sort((a, b) => a.questionNo - b.questionNo);
}

export function validateQuestions(questions) {
  const numbers = questions.map((q) => q.questionNo);
  const uniqueNumbers = new Set(numbers);
  const highestQuestionNo = numbers.length ? Math.max(...numbers) : 0;

  const missing = [];
  for (let i = 1; i <= highestQuestionNo; i++) {
    if (!uniqueNumbers.has(i)) missing.push(i);
  }

  const needsReview = questions.filter(
    (q) =>
      !q.question ||
      !q.correctAnswer ||
      !q.options ||
      Object.values(q.options).every((value) => !value)
  );

  return {
    totalDetected: questions.length,
    highestQuestionNo,
    missing,
    hasDuplicateNumbers: uniqueNumbers.size !== numbers.length,
    needsReviewCount: needsReview.length,
    isClean:
      missing.length === 0 &&
      uniqueNumbers.size === numbers.length &&
      needsReview.length === 0,
  };
}