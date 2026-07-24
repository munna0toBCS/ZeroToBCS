import fs from "node:fs";
import path from "node:path";

const inputPath = path.join(process.cwd(), "questionBank", "49th_raw.json");
const outputPath = path.join(process.cwd(), "questionBank", "49th_normalized.json");

function detectAnswer(rawText) {
  const match = rawText.match(/উত্তর[:ঃ]?\s*([কখগঘ])/);
  return match ? match[1] : "";
}

function extractQuestion(rawText) {
  return rawText
    .replace(/উত্তর[:ঃ]?.*/g, "")
    .trim();
}

function normalizeQuestions() {
  const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  const questions = rawData.questions.map((item) => ({
    id: item.id,
    exam: "49th BCS Preliminary",
    questionNo: item.questionNo,
    question: extractQuestion(item.rawText),
    options: {
      ক: "",
      খ: "",
      গ: "",
      ঘ: "",
    },
    correctAnswer: detectAnswer(item.rawText),
    explanation: "",
    subject: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    tags: ["BCS", "49th BCS", "Preliminary"],
    source: {
      exam: "49th BCS Preliminary",
      questionNo: item.questionNo,
    },
    status: "normalized_pending_review",
  }));

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        exam: "49th BCS Preliminary",
        total: questions.length,
        status: "normalized_pending_review",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("✅ Normalized JSON Generated Successfully");
  console.log(`📄 Saved to: ${outputPath}`);
  console.log(`📊 Total Questions: ${questions.length}`);
}

normalizeQuestions();