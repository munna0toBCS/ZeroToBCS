import { getQuestionsByFilter } from "./questionBankService";

export const startPractice = ({
  exam,
  subject,
  topic,
  difficulty,
  count,
}) => {
  const questions = getQuestionsByFilter({
    exam,
    subject,
    topic,
    difficulty,
    count,
  });

  return {
    totalQuestions: questions.length,
    questions,
  };
};

export const hasQuestions = (settings) => {
  return startPractice(settings).totalQuestions > 0;
};