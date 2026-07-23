import { getQuestionsByFilter as getLocalQuestions } from "./questionBankService";
import { getQuestionsByFilter as getSupabaseQuestions } from "./supabaseQuestionService";

/**
 * Hybrid Practice Engine
 * First tries Supabase.
 * If no questions are found or cloud fails,
 * it automatically falls back to local questions.
 */
export const startPractice = async ({
  exam,
  subject,
  topic,
  difficulty,
  count,
}) => {
  let questions = [];

  try {
    questions = await getSupabaseQuestions({
      exam,
      subject,
      topic,
      difficulty,
      limit: count,
    });
  } catch (error) {
    console.warn("Supabase unavailable. Using local database.");
  }

  if (questions.length === 0) {
    questions = getLocalQuestions({
      exam,
      subject,
      topic,
      difficulty,
      count,
    });
  }

  return {
    totalQuestions: questions.length,
    questions,
  };
};

export const hasQuestions = async (settings) => {
  const result = await startPractice(settings);
  return result.totalQuestions > 0;
};