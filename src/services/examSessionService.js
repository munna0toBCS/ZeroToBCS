import {
  createExamSession,
  calculateResult,
} from "./examEngineService";

import {
  saveExamSession,
  getSavedExamSession,
  clearSavedExamSession,
} from "./examStorageService";

export const startExam = (config) => {
  const session = createExamSession(config);

  saveExamSession(session);

  return session;
};

export const resumeExam = () => {
  return getSavedExamSession();
};

export const answerQuestion = (
  session,
  questionId,
  answerIndex
) => {
  session.answers = {
    ...session.answers,
    [questionId]: answerIndex,
  };

  saveExamSession(session);

  return session;
};

export const markForReview = (
  session,
  questionId
) => {
  if (!session.reviewQuestions.includes(questionId)) {
    session.reviewQuestions.push(questionId);
  }

  saveExamSession(session);

  return session;
};

export const removeReview = (
  session,
  questionId
) => {
  session.reviewQuestions =
    session.reviewQuestions.filter(
      (id) => id !== questionId
    );

  saveExamSession(session);

  return session;
};

export const goToPage = (
  session,
  page
) => {
  session.currentPage = page;

  saveExamSession(session);

  return session;
};

export const submitExam = (
  session,
  negativeMark = 0.25
) => {
  session.endTime = Date.now();

  session.submitted = true;

  const result = calculateResult(
    session,
    negativeMark
  );

  session.score = result;

  clearSavedExamSession();

  return result;
};