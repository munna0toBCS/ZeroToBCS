import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

// The 16 files whose OCR extraction quality (needs_review ratio 51-88%) was
// judged trustworthy after manual review of the 10th BCS sample — see the
// batch run summary. The other 22 files use different page layouts/marker
// conventions the current pipeline doesn't handle and are left for later.
const GOOD_EXAM_CODES = [
  "10", "15", "47", "22", "26", "23", "17", "24", "27", "25", // 51-74% review
  "49", "12", "16", "21", "14", "11", // 79-88% review, borderline but included
];

const QUESTION_BANK_DIR = path.join(process.cwd(), "questionBank");
const OUTPUT_PATH = path.join(QUESTION_BANK_DIR, "export_clean_batch1.xlsx");

const ANSWER_LETTER = { "ক": "A", "খ": "B", "গ": "C", "ঘ": "D" };

function loadExam(examCode) {
  const filePath = path.join(QUESTION_BANK_DIR, `ocr_bcs_${examCode}_parsed.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function toRow(question, examName) {
  return {
    exam: "BCS",
    subject: question.subject,
    // No per-topic classifier was built — subject doubles as a placeholder
    // topic for now; refine per-question later via Question Manager.
    topic: question.subject,
    question: question.question,
    option_a: question.options["ক"],
    option_b: question.options["খ"],
    option_c: question.options["গ"],
    option_d: question.options["ঘ"],
    answer: ANSWER_LETTER[question.correctAnswer],
    explanation: "",
    source: examName,
    year: "",
    tags: `BCS,${examName},Preliminary,${question.subject}`,
    difficulty: "medium",
  };
}

const rows = [];
const perFileCounts = [];

for (const examCode of GOOD_EXAM_CODES) {
  const data = loadExam(examCode);
  const clean = data.questions.filter((q) => q.status === "parsed_clean");

  for (const question of clean) {
    rows.push(toRow(question, data.examName));
  }

  perFileCounts.push({ examCode, examName: data.examName, count: clean.length });
}

const sheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, "Questions");
XLSX.writeFile(workbook, OUTPUT_PATH);

console.log("Per-file clean question counts:");
for (const { examCode, examName, count } of perFileCounts) {
  console.log(`  bcs_${examCode} (${examName}): ${count}`);
}
console.log(`\nTotal rows: ${rows.length}`);
console.log(`Written to: ${OUTPUT_PATH}`);
