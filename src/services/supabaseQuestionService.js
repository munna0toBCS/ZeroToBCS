import { supabase } from "./supabaseClient";

const answerMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const formatQuestion = (q) => ({
  id: q.id,
  exam: q.exam,
  subject: q.subject,
  topic: q.topic,
  difficulty: q.difficulty,

  question: q.question,
  options: [q.option_a, q.option_b, q.option_c, q.option_d],
  answer: answerMap[String(q.answer || "A").toUpperCase()] ?? 0,

  explanation: q.explanation,
  source: q.source,
  year: q.year,
  tags: q.tags || [],
});

export const getAllQuestions = async () => {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(formatQuestion);
};

export const getQuestionsByFilter = async ({
  exam,
  subject,
  topic,
  difficulty,
  limit = 20,
}) => {
  let query = supabase.from("questions").select("*");

  if (exam) query = query.eq("exam", exam);
  if (subject) query = query.eq("subject", subject);
  if (topic) query = query.eq("topic", topic);
  if (difficulty && difficulty !== "Mixed") {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.limit(limit);

  if (error) throw error;

  return (data || []).map(formatQuestion);
};