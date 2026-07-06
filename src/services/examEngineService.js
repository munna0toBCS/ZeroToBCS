import { getQuestionsByFilter } from "./questionBankService";

export const createExamSession = ({
  mode = "practice",
  exam = "BCS",
  subject = "",
  topic = "",
  difficulty = "Mixed",
  questionCount = 20,
  timeLimit = null,
}) => {
  const questions = getQuestionsByFilter({
    exam,
    subject,
    topic,
    difficulty,
    count: questionCount,
  });

  return {
    id: Date.now().toString(),

    mode,

    exam,

    subject,

    topic,

    difficulty,

    questions,

    totalQuestions: questions.length,

    answers: {},

    reviewQuestions: [],

    currentPage: 1,

    questionsPerPage: mode === "mock" ? 10 : 1,

    startTime: Date.now(),

    endTime: null,

    timeLimit,

    submitted: false,

    score: null,
  };
};

export const calculateResult = (
  session,
  negativeMark = 0.25
) => {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  session.questions.forEach((question) => {
    const answer = session.answers[question.id];

    if (answer === undefined) {
      unanswered++;
      return;
    }

    if (answer === question.answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  const obtainedMarks =
    correct - wrong * negativeMark;

  return {
    total: session.totalQuestions,

    correct,

    wrong,

    unanswered,

    obtainedMarks:
      obtainedMarks < 0 ? 0 : obtainedMarks,

    percentage:
      session.totalQuestions === 0
        ? 0
        : (
            (correct / session.totalQuestions) *
            100
          ).toFixed(2),
  };
};

export const getCurrentPageQuestions = (
  session
) => {
  const start =
    (session.currentPage - 1) *
    session.questionsPerPage;

  const end =
    start + session.questionsPerPage;

  return session.questions.slice(start, end);
};

export const getTotalPages = (session) => {
  return Math.ceil(
    session.totalQuestions /
      session.questionsPerPage
  );
};