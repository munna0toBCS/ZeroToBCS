import fs from "node:fs";
import path from "node:path";
import PDFParser from "pdf2json";

const exams = [
  {
    pdfFileName: "49-bcs.pdf",
    examName: "49th BCS Preliminary",
    examCode: "bcs_49",
    year: 2025,
  },
];

function readPdfText(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`PDF file not found: ${filePath}`));
      return;
    }

    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((item) => {
          item.R.forEach((run) => {
            text += run.T + " ";
          });
          text += "\n";
        });
      });

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/www\.[^\s]+/gi, "")
    .trim();
}

function removeNoise(text) {
  return text
    .replace(/BCS, Bank, Primary & Other Job'?s Preparation/gi, "")
    .replace(/096\s*444\s*333\s*00/gi, "")
    .replace(/www\.[^\s]+/gi, "")
    .replace(/Page\s*[-–]?\s*\d+/gi, "")
    .replace(/Warning:\s*Setting up fake worker\./gi, "")
    .trim();
}

function splitQuestions(text) {
  const cleanedText = removeNoise(text);

  const blocks = cleanedText
    .split(/\n(?=\s*\d{1,3}[.)]\s)/)
    .map((item) => item.trim())
    .filter((item) => {
      return (
        item.length > 20 &&
        /^\d{1,3}[.)]\s/.test(item) &&
        !item.includes("BCS, Bank") &&
        !item.includes("Page")
      );
    });

  return blocks;
}

function extractAnswer(text) {
  const patterns = [
    /উত্তর[:ঃ]?\s*([কখগঘ])/,
    /উ[:ঃ]?\s*([কখগঘ])/,
    /Ans[:.]?\s*([A-D])/i,
    /Answer[:.]?\s*([A-D])/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  return "";
}

function extractOptions(text) {
  const options = { ক: "", খ: "", গ: "", ঘ: "" };

  const optionPattern =
    /(?:^|\s)([কখগঘ])[.)]\s*(.*?)(?=\s[কখগঘ][.)]|\sউত্তর[:ঃ]|\sউ[:ঃ]|$)/gs;

  let match;

  while ((match = optionPattern.exec(text)) !== null) {
    const key = match[1];
    const value = cleanText(match[2]);

    if (options[key] !== undefined) {
      options[key] = value;
    }
  }

  return options;
}
function extractQuestionText(text) {
  return cleanText(
    text
      .replace(/^\d{1,3}[.)]\s*/, "")
      .replace(/(?:^|\s)[কখগঘ][.)]\s*.*?(?=\s[কখগঘ][.)]|\sউত্তর[:ঃ]|\sউ[:ঃ]|$)/gs, "")
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
    text.includes("নজরুল")
  ) {
    return "Bangla";
  }

  if (
    /\d/.test(text) ||
    text.includes("মান") ||
    text.includes("ধারা") ||
    text.includes("সেট") ||
    text.includes("অনুপাত") ||
    text.includes("সমাধান")
  ) {
    return "Mathematics";
  }

  return "General Knowledge";
}

function buildQuestion(block, index, exam) {
  const questionText = extractQuestionText(block);
  const options = extractOptions(block);
  const correctAnswer = extractAnswer(block);
  const subject = detectSubject(block);

  return {
    id: `${exam.examCode}_${String(index + 1).padStart(3, "0")}`,
    exam: "BCS",
    examName: exam.examName,
    examType: "Preliminary",
    year: exam.year,
    questionNo: index + 1,
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
      questionNo: index + 1,
    },
    status: correctAnswer ? "parsed_pending_review" : "needs_manual_review",
  };
}

async function processExam(exam) {
  const pdfPath = path.join(process.cwd(), "data", exam.pdfFileName);
  const outputPath = path.join(
    process.cwd(),
    "questionBank",
    `${exam.examCode}_parsed.json`
  );

  const text = await readPdfText(pdfPath);
  const blocks = splitQuestions(text);

  const questions = blocks.map((block, index) =>
    buildQuestion(block, index, exam)
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        exam: exam.examName,
        examCode: exam.examCode,
        total: questions.length,
        status: "parsed_pending_review",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`✅ ${exam.examName} processed`);
  console.log(`📄 Saved: ${outputPath}`);
  console.log(`📊 Total Questions: ${questions.length}`);
}

async function main() {
  console.log("🚀 ZeroToBCS Production Import Engine v2 Started");

  for (const exam of exams) {
    await processExam(exam);
  }

  console.log("✅ All processing completed");
}

main().catch(console.error);