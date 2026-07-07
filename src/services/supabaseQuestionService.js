import { supabase } from "./supabaseClient";

/**
 * Get all questions
 */
export const getAllQuestions = async () => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Get questions by filter
 */
export const getQuestionsByFilter = async ({
  exam,
  subject,
  topic,
  difficulty,
  limit = 20,
}) => {
  let query = supabase.from("questions").select("*");

  if (exam) {
    query = query.eq("exam", exam);
  }

  if (subject) {
    query = query.eq("subject", subject);
  }

  if (topic) {
    query = query.eq("topic", topic);
  }

  if (difficulty && difficulty !== "Mixed") {
    query = query.eq("difficulty", difficulty);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};