import fs from "node:fs";
import path from "node:path";
import PDFParser from "pdf2json";

const INPUT_FOLDER = path.join(process.cwd(), "data");
const OUTPUT_FOLDER = path.join(process.cwd(), "questionBank");

function ensureFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function readPdfText(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      for (const page of pdfData.Pages) {
        for (const item of page.Texts) {
          for (const run of item.R) {
            text += run.T + " ";
          }
          text += "\n";
        }
      }

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}

function cleanText(text) {
  return String(text || "")
    .replace(/BCS, Bank, Primary & Other Job'?s Preparation/gi, "")
    .replace(/096\s*444\s*333\s*00/gi, "")
    .replace(/www\.[^\s]+/gi, "")
    .replace(/Page\s*[-–]?\s*\d+/gi, "")
    .replace(/Warning:\s*Setting up fake worker\./gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bnToEnNumber(value) {
  const map = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  return String(value)
    .split("")
    .map((char) => map[char] || char)
    .join("");
}

function detectExamName(fileName, text) {
  const combined = `${fileName} ${text}`;

  const englishMatch = combined.match(/(\d{1,2})(st|nd|rd|th)?\s*BCS/i);
  if (englishMatch) {
    return `${englishMatch[1]}th BCS Preliminary`;
  }

  const banglaMatch = combined.match(/([০-৯]{1,2})তম\s*বিসিএস/);
  if (banglaMatch) {
    return `${bnToEnNumber(banglaMatch[1])}th BCS Preliminary`;
  }

  return path.basename(fileName, path.extname(fileName));
}

function makeExamCode(examName) {
  const match = examName.match(/\d+/);
  if (match) return `bcs_${match[0]}`;

  return examName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizeForQuestionSplit(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/([0-9\u09E6-\u09EF]{1,3})[।.]\s*/g, "\n$1. ")
    .replace(/\s+([কখগঘ])[).]\s+/g, "\n$1. ");
}

function splitQuestions(text) {
  const normalized = normalizeForQuestionSplit(text);

  const matches = [
    ...normalized.matchAll(/(?:^|\n|\s)([0-9\u09E6-\u09EF]{1,3})[.)]\s+/g),
  ];

  const blocks = [];

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end =
      i + 1 < matches.length ? matches[i + 1].index : normalized.length;

    const block = normalized.slice(start, end).trim();

    const hasOptions =
      block.includes("ক.") ||
      block.includes("খ.") ||
      block.includes("গ.") ||
      block.includes("ঘ.") ||
      block.includes("ক)") ||
      block.includes("খ)") ||
      block.includes("গ)") ||
      block.includes("ঘ)");

    if (
      block.length > 20 &&
      hasOptions &&
      !block.includes("BCS, Bank") &&
      !block.includes("Page")
    ) {
      blocks.push(block);
    }
  }

  return blocks;
}

function getQuestionNo(block, fallback) {
  const match = block.match(/^([0-9\u09E6-\u09EF]{1,3})[.)]/);
  if (!match) return fallback;

  return Number(bnToEnNumber(match[1]));
}
function extractAnswer(block) {
  const patterns = [
    /উত্তর[:ঃ]?\s*([কখগঘ])/,
    /উ[:ঃ]?\s*([কখগঘ])/,
    /Ans[:.]?\s*([A-D])/i,
    /Answer[:.]?\s*([A-D])/i,
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) return match[1];
  }

  return "";
}

function extractOptions(block) {
  const options = {
    ক: "",
    খ: "",
    গ: "",
    ঘ: "",
  };

  const optionPattern =
    /(?:^|\n|\s)([কখগঘ])[).]\s*(.*?)(?=(?:\n|\s)[কখগঘ][).]\s|(?:\n|\s)উত্তর[:ঃ]|(?:\n|\s)উ[:ঃ]|$)/gs;

  let match;

  while ((match = optionPattern.exec(block)) !== null) {
    const key = match[1];
    const value = cleanText(match[2]);
    options[key] = value;
  }

  return options;
}

function extractQuestionText(block) {
  return cleanText(
    block
      .replace(/^[0-9]{1,3}[.]\s*/, "")
      .replace(
        /(?:^|\n|\s)[কখগঘ][).]\s*.*?(?=(?:\n|\s)[কখগঘ][).]\s|(?:\n|\s)উত্তর[:ঃ]|(?:\n|\s)উ[:ঃ]|$)/gs,
        ""
      )
      .replace(/উত্তর[:ঃ]?.*/g, "")
      .replace(/উ[:ঃ]?.*/g, "")
  );
}

function detectSubject(text) {
  if (/[A-Za-z]{3,}/.test(text)) return "English";

  if (
    text.includes("সংবিধান") ||
    text.includes("বাংলাদেশ") ||
    text.includes("মুক্তিযুদ্ধ") ||
    text.includes("জাতীয়") ||
    text.includes("রাষ্ট্রপতি") ||
    text.includes("প্রধানমন্ত্রী")
  ) {
    return "Bangladesh Affairs";
  }

  if (
    text.includes("ধ্বনি") ||
    text.includes("শব্দ") ||
    text.includes("সন্ধি") ||
    text.includes("বাক্য") ||
    text.includes("রবীন্দ্র") ||
    text.includes("নজরুল") ||
    text.includes("কবি") ||
    text.includes("উপন্যাস")
  ) {
    return "Bangla";
  }

  if (
    /\d/.test(text) ||
    text.includes("মান") ||
    text.includes("ধারা") ||
    text.includes("সেট") ||
    text.includes("অনুপাত") ||
    text.includes("সমাধান") ||
    text.includes("সংখ্যা")
  ) {
    return "Mathematics";
  }

  return "General Knowledge";
}

function buildQuestion(block, index, exam) {
  const questionNo = getQuestionNo(block, index + 1);
  const questionText = extractQuestionText(block);
  const options = extractOptions(block);
  const correctAnswer = extractAnswer(block);
  const subject = detectSubject(block);

  return {
    id: `${exam.examCode}_${String(questionNo).padStart(3, "0")}`,
    exam: "BCS",
    examName: exam.examName,
    examCode: exam.examCode,
    examType: "Preliminary",
    questionNo,
    language: /[A-Za-z]{3,}/.test(questionText) ? "en" : "bn",
    subject,
    section: "",
    topic: "",
    subtopic: "",
    question: questionText,
    options,
    correctAnswer,
    explanation: "",
    difficulty: "medium",
    tags: ["BCS", exam.examName, "Preliminary", subject],
    source: {
      exam: exam.examName,
      questionNo,
    },
    status: correctAnswer ? "parsed_pending_review" : "needs_manual_review",
  };
}

function validateQuestions(questions) {
  const numbers = questions.map((q) => q.questionNo);
  const unique = new Set(numbers);
  const highest = numbers.length ? Math.max(...numbers) : 0;

  const missing = [];
  for (let i = 1; i <= highest; i++) {
    if (!unique.has(i)) missing.push(i);
  }

  return {
    detected: questions.length,
    highestQuestionNo: highest,
    missing,
    hasDuplicateNumbers: unique.size !== numbers.length,
  };
}

async function processPdf(fileName) {
  const pdfPath = path.join(INPUT_FOLDER, fileName);
  const rawText = await readPdfText(pdfPath);
  const cleanedText = cleanText(rawText);

  const examName = detectExamName(fileName, cleanedText);
  const examCode = makeExamCode(examName);

  const blocks = splitQuestions(rawText);
  const exam = { examName, examCode };

  const questions = blocks
    .map((block, index) => buildQuestion(block, index, exam))
    .filter((q) => q.question && q.question.length > 5)
    .sort((a, b) => a.questionNo - b.questionNo);

  const validation = validateQuestions(questions);

  const outputPath = path.join(OUTPUT_FOLDER, `${examCode}_parsed.json`);

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        examName,
        examCode,
        totalQuestions: questions.length,
        validation,
        status: "parsed_pending_review",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`✅ Processed: ${examName}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Questions Detected: ${questions.length}`);
  console.log(`🔢 Highest Question No: ${validation.highestQuestionNo}`);
  console.log(
    `⚠️ Missing: ${
      validation.missing.length ? validation.missing.join(", ") : "None"
    }`
  );
}

async function main() {
  ensureFolder(OUTPUT_FOLDER);

  const files = fs
    .readdirSync(INPUT_FOLDER)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));

  if (!files.length) {
    console.log("No PDF files found in data folder.");
    return;
  }

  console.log("🚀 ZeroToBCS Import Engine Started");

  for (const file of files) {
    await processPdf(file);
  }

  console.log("✅ Import Engine completed.");
}

main().catch(console.error);