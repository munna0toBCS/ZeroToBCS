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

    const cleanedRow = {
  ...row,
  answer,
};

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