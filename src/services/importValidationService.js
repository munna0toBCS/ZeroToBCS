// Columns stored as a numeric type in Supabase. The importer reads blank
// spreadsheet cells as "" (see QuestionImporter.jsx's sheet_to_json defval),
// and Postgres rejects "" for an integer column ("invalid input syntax for
// type integer: ''") — normalize to null before these rows ever reach the
// insert call, since a missing year is valid data, not a bad row.
const NUMERIC_FIELDS = ["year"];

function nullifyBlankNumericFields(row) {
  const cleaned = { ...row };

  for (const field of NUMERIC_FIELDS) {
    if (cleaned[field] !== undefined && String(cleaned[field]).trim() === "") {
      cleaned[field] = null;
    }
  }

  return cleaned;
}

export function validateQuestions(rows) {
  const errors = [];
  const validRows = [];
  const duplicates = [];

  const questionSet = new Set();

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // Excel header = row 1

    // Required Fields
    const required = [
      "exam",
      "subject",
      "topic",
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "answer",
    ];

    const missing = required.filter(
      (field) =>
        row[field] === undefined ||
        row[field] === null ||
        String(row[field]).trim() === ""
    );

    if (missing.length > 0) {
      errors.push({
        row: rowNumber,
        type: "Missing Field",
        message: missing.join(", "),
      });
      return;
    }

    // Answer Validation
    const answer = String(row.answer).trim().toUpperCase();

    if (!["A", "B", "C", "D"].includes(answer)) {
      errors.push({
        row: rowNumber,
        type: "Invalid Answer",
        message: answer,
      });
      return;
    }

    // Duplicate Check (inside uploaded file)
    const key = row.question.trim().toLowerCase();

    if (questionSet.has(key)) {
      duplicates.push({
        row: rowNumber,
        question: row.question,
      });
      return;
    }

    questionSet.add(key);

    const cleanedRow = nullifyBlankNumericFields({
  ...row,
  answer,
});

if (cleanedRow.tags) {
  cleanedRow.tags = String(cleanedRow.tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

validRows.push(cleanedRow);});

  return {
    validRows,
    errors,
    duplicates,
    total: rows.length,
    valid: validRows.length,
  };
}