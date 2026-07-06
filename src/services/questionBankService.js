import { englishQuestions } from "../data/englishQuestions";
import { mentalAbilityQuestions } from "../data/mentalAbilityQuestions";
import { banglaQuestions } from "../data/banglaQuestions";
// Future Subjects
// import { banglaQuestions } from "../data/banglaQuestions";
// import { mathQuestions } from "../data/mathQuestions";
// import { bangladeshQuestions } from "../data/bangladeshQuestions";
// import { internationalQuestions } from "../data/internationalQuestions";
// import { scienceQuestions } from "../data/scienceQuestions";
// import { computerQuestions } from "../data/computerQuestions";
// import { ethicsQuestions } from "../data/ethicsQuestions";

const questionBank = [
  ...englishQuestions,
  ...mentalAbilityQuestions,
...banglaQuestions,
  // Future
  // ...banglaQuestions,
  // ...mathQuestions,
  // ...bangladeshQuestions,
  // ...internationalQuestions,
  // ...scienceQuestions,
  // ...computerQuestions,
  // ...ethicsQuestions,
];

export const getAllQuestions = () => {
  return [...questionBank];
};

export const getSubjects = () => {
  return [...new Set(questionBank.map((q) => q.subject))].sort();
};

export const getTopicsBySubject = (subject) => {
  return [
    ...new Set(
      questionBank
        .filter((q) => q.subject === subject)
        .map((q) => q.topic)
    ),
  ].sort();
};

export const getQuestionsByFilter = ({
  exam,
  subject,
  topic,
  difficulty,
  count = 20,
}) => {
  let questions = [...questionBank];

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

  // Shuffle questions
  questions = questions.sort(() => Math.random() - 0.5);

  return questions.slice(0, count);
};

export const getQuestionById = (id) => {
  return questionBank.find((q) => q.id === id);
};

export const getPreviousYearQuestions = () => {
  return questionBank.filter((q) => q.isPreviousYear);
};

export const getImportantQuestions = () => {
  return questionBank.filter((q) => q.importance >= 5);
};

export const getQuestionStatistics = () => {
  return {
    total: questionBank.length,

    english: questionBank.filter(
      (q) => q.subject === "English"
    ).length,

    mentalAbility: questionBank.filter(
      (q) => q.subject === "Mental Ability"
    ).length,
  };
};