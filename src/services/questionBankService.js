import { englishQuestions } from "../data/englishQuestions";

const allQuestions = [
  ...englishQuestions,
];

export const getAllQuestions = () => {
  return allQuestions;
};

export const getQuestionsByFilter = ({
  exam,
  subject,
  topic,
  difficulty,
  count,
}) => {
  let questions = allQuestions;

  if (exam) {
    questions = questions.filter((q) => q.exam === exam);
  }

  if (subject) {
    questions = questions.filter((q) => q.subject === subject);
  }

  if (topic) {
    questions = questions.filter((q) => q.topic === topic);
  }

  if (difficulty && difficulty !== "Mixed") {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  return questions.slice(0, count);
};