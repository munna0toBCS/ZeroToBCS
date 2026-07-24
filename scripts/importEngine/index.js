import fs from "node:fs";
import path from "node:path";

import { readPdf } from "./pdfReader.js";
import { analyzeLayout } from "./layoutAnalyzer.js";
import { splitQuestionBlocks } from "./questionSplitter.js";
import { parseQuestionBlock } from "./questionParser.js";
import { detectSubject } from "./subjectDetector.js";
import {
  removeDuplicateQuestions,
  validateQuestions,
} from "./validator.js";
import { exportJson } from "./jsonExporter.js";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_DIR = path.join(process.cwd(), "questionBank");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function detectExam(fileName) {
  const match = fileName.match(/(\d{1,2})/);
  const number = match ? match[1] : "unknown";

  return {
    examName: number === "unknown" ? fileName : `${number}th BCS Preliminary`,
    examCode: number === "unknown" ? "unknown_exam" : `bcs_${number}`,
  };
}

async function processFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const exam = detectExam(fileName);

  const pages = await readPdf(filePath);
  const layout = analyzeLayout(pages);
  const blocks = splitQuestionBlocks(layout);

  const questions = blocks.map((block) => {
    const parsed = parseQuestionBlock(block, exam);
    const subject = detectSubject(parsed.rawText);

    return {
      ...parsed,
      examType: "Preliminary",
      subject,
      section: "",
      topic: "",
      subtopic: "",
      explanation: "",
      difficulty: "medium",
      tags: ["BCS", exam.examName, "Preliminary", subject],
      source: {
        exam: exam.examName,
        questionNo: parsed.questionNo,
      },
    };
  });
const cleanedQuestions = removeDuplicateQuestions(questions);
const validation = validateQuestions(cleanedQuestions);
  const outputPath = exportJson({
    outputDir: OUTPUT_DIR,
    exam,
    questions: cleanedQuestions,
    validation,
  });

  console.log(`✅ Processed: ${exam.examName}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Detected: ${validation.totalDetected}`);
  console.log(`🔢 Highest: ${validation.highestQuestionNo}`);
  console.log(
    `⚠️ Missing: ${
      validation.missing.length ? validation.missing.join(", ") : "None"
    }`
  );
  console.log(`🧪 Needs Review: ${validation.needsReviewCount}`);
}

async function main() {
  ensureDir(OUTPUT_DIR);

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));

  for (const file of files) {
    await processFile(file);
  }

  console.log("✅ Import Engine v3 completed.");
}

main().catch(console.error);