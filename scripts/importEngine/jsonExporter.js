import fs from "node:fs";
import path from "node:path";

export function exportJson({ outputDir, exam, questions, validation }) {
  const outputPath = path.join(outputDir, `${exam.examCode}_parsed.json`);

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        examName: exam.examName,
        examCode: exam.examCode,
        totalQuestions: questions.length,
        validation,
        status: validation.isClean ? "parsed_clean" : "parsed_needs_review",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  return outputPath;
}