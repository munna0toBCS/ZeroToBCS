import { supabase } from "./supabaseClient";

export async function checkDuplicateQuestions(rows) {
  const { data, error } = await supabase
    .from("questions")
    .select("question");

  if (error) throw error;

  // Database-এর সব question Set-এ রাখছি
  const existingQuestions = new Set(
    (data || []).map((item) =>
      item.question.trim().toLowerCase()
    )
  );

  const duplicates = [];
  const newQuestions = [];

  rows.forEach((row) => {
    const key = String(row.question)
      .trim()
      .toLowerCase();

    if (existingQuestions.has(key)) {
      duplicates.push(row);
    } else {
      newQuestions.push(row);
    }
  });

  return {
    duplicates,
    newQuestions,
  };
}