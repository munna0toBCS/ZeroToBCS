import fs from "node:fs";
import path from "node:path";
import PDFParser from "pdf2json";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTPUT_DIR = path.join(process.cwd(), "questionBank");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readPdf(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (err) => reject(err.parserError));

    parser.on("pdfParser_dataReady", (data) => {
      const lines = [];

      for (const page of data.Pages) {
        for (const item of page.Texts) {
          const line = item.R.map((r) => r.T).join(" ");
          lines.push(line);
        }
      }

      resolve(lines.join("\n"));
    });

    parser.loadPDF(filePath);
  });
}

function clean(text) {
  return String(text || "")
    .replace(/BCS, Bank, Primary & Other Job'?s Preparation/gi, "")
    .replace(/096\s*444\s*333\s*00/gi, "")
    .replace(/www\.[^\s]+/gi, "")
    .replace(/Page[-–]?\s*\d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectExam(fileName, text) {
  const combined = `${fileName} ${text}`;
  const match = combined.match(/(\d{1,2})(st|nd|rd|th)?\s*BCS/i);
  const num = match ? match[1] : "unknown";

  return {
    examName: num === "unknown" ? fileName.replace(".pdf", "") : `${num}th BCS Preliminary`,
    examCode: num === "unknown" ? "unknown_exam" : `bcs_${num}`,
  };
}

function splitQuestions(text) {
  const normalized = text
    .replace(/\r/g, "\n")
    .replace(/(\d{1,3})[.)]\s+/g, "\n$1. ");

  const regex = /\n(\d{1,3})[.)]\s+/g;
  const matches = [...normalized.matchAll(regex)];

  const blocks = [];

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
    const block = normalized.slice(start, end).trim();

    if (
      block.length > 25 &&
      !block.includes("BCS, Bank") &&
      !block.includes("Page")
    ) {
      blocks.push(block);
    }
  }

  return blocks;
}

function getQuestionNo(block, fallback) {
  const match = block.match(/^(\d{1,3})[.)]/);
  return match ? Number(match[1]) : fallback;
}

function extractAnswer(block) {
  const match =
    block.match(/উত্তর[:ঃ]?\s*([কখগঘ])/i) ||
    block.match(/উ[:ঃ]?\s*([কখগঘ])/i) ||
    block.match(/Answer[:.]?\s*([A-D])/i) ||
    block.match(/Ans[:.]?\s*([A-D])/i);

  return match ? match[1] : "";
}

function extractOptions(block) {
  const options = { ক: "", খ: "", গ: "", ঘ: "" };

  const pattern =
    /(?:^|\s)([কখগঘ])[.)]\s*(.*?)(?=\s[কখগঘ][.)]|\sউত্তর[:ঃ]|\sউ[:ঃ]|$)/gs;

  let match;
  while ((match = pattern.exec(block)) !== null) {
    options[match[1]] = clean(match[2]);
  }

  return options;
}

function extractQuestion(block) {
  return clean(
    block
      .replace(/^\d{1,3}[.)]\s*/, "")
      .replace(/(?:^|\s)[কখগঘ][.)]\s*.*?(?=\s[কখগঘ][.)]|\sউত্তর[:ঃ]|\sউ[:ঃ]|$)/gs, "")
      .replace(/উত্তর[:ঃ]?.*/g, "")
      .replace(/উ[:ঃ]?.*/g, "")
  );
}

function detectSubject(text) {
  if (/[A-Za-z]{3,}/.test(text)) return "English";
  if (text.includes("বাংলাদেশ") || text.includes("সংবিধান") || text.includes("মুক্তিযুদ্ধ")) return "Bangladesh Affairs";
  if (text.includes("ধ্বনি") || text.includes("শব্দ") || text.includes("সন্ধি") || text.includes("বাক্য")) return "Bangla";
  if (/\d/.test(text) || text.includes("মান") || text.includes("ধারা") || text.includes("সেট")) return "Mathematics";
  return "General Knowledge";
}

function validate(questions) {
  const nums = questions.map((q) => q.questionNo);
  const highest = nums.length ? Math.max(...nums) : 0;
  const set = new Set(nums);

  const missing = [];
  for (let i = 1; i <= highest; i++) {
    if (!set.has(i)) missing.push(i);
  }

  return {
    detected: questions.length,
    highestQuestionNo: highest,
    missing,
    duplicate: set.size !== nums.length,
  };
}

async function processPdf(fileName) {
  const pdfPath = path.join(DATA_DIR, fileName);
  const rawText = await readPdf(pdfPath);
  const exam = detectExam(fileName, rawText);

  const blocks = splitQuestions(rawText);

  const questions = blocks.map((block, index) => {
    const questionNo = getQuestionNo(block, index + 1);
    const question = extractQuestion(block);
    const subject = detectSubject(block);

    return {
      id: `${exam.examCode}_${String(questionNo).padStart(3, "0")}`,
      exam: "BCS",
      examName: exam.examName,
      examCode: exam.examCode,
      examType: "Preliminary",
      questionNo,
      language: /[A-Za-z]{3,}/.test(question) ? "en" : "bn",
      subject,
      section: "",
      topic: "",
      subtopic: "",
      question,
      options: extractOptions(block),
      correctAnswer: extractAnswer(block),
      explanation: "",
      difficulty: "medium",
      tags: ["BCS", exam.examName, "Preliminary", subject],
      source: {
        exam: exam.examName,
        questionNo,
      },
      status: "parsed_pending_review",
    };
  });

  const output = {
    examName: exam.examName,
    examCode: exam.examCode,
    totalQuestions: questions.length,
    validation: validate(questions),
    status: "parsed_pending_review",
    questions,
  };

  const outputPath = path.join(OUTPUT_DIR, `${exam.examCode}_parsed.json`);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`✅ Processed: ${exam.examName}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Detected: ${output.validation.detected}`);
  console.log(`🔢 Highest: ${output.validation.highestQuestionNo}`);
  console.log(`⚠️ Missing: ${output.validation.missing.length ? output.validation.missing.join(", ") : "None"}`);
}

async function main() {
  ensureDir(OUTPUT_DIR);

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));

  for (const file of files) {
    await processPdf(file);
  }

  console.log("✅ Import Engine completed.");
}

main().catch(console.error);