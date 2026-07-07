import { getQuestionsByFilter } from "./supabaseQuestionService";

export const createMockSession = async ({
  exam = "BCS",
  subject = "",
  topic = "",
  difficulty = "Mixed",
  count = 20,
  durationMinutes = 20,
}) => {
  const questions = await getQuestionsByFilter({
    exam,
    subject,
    topic,
    difficulty,
    limit: count,
  });

  return {
    id: Date.now().toString(),
    exam,
    subject,
    topic,
    difficulty,
    questions,
    answers: {},
    currentIndex: 0,
    startedAt: Date.now(),
    durationSeconds: durationMinutes * 60,
    submitted: false,
  };
};

export const calculateMockResult = (session) => {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  session.questions.forEach((question) => {
    const userAnswer = session.answers[question.id];

    if (userAnswer === undefined) skipped += 1;
    else if (userAnswer === question.answer) correct += 1;
    else wrong += 1;
  });

  const score = Math.max(0, correct - wrong * 0.25);

  return {
    total: session.questions.length,
    correct,
    wrong,
    skipped,
    score: Number(score.toFixed(2)),
  };
};