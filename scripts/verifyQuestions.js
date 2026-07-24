import fs from "node:fs";
import path from "node:path";

const inputPath = path.join(process.cwd(), "questionBank", "49th_normalized.json");
const outputPath = path.join(process.cwd(), "questionBank", "49th_verified_draft.json");

function detectSubject(text) {
  if (/[A-Za-z]/.test(text)) return "English";

  if (
    text.includes("সংবিধান") ||
    text.includes("বাংলাদেশ") ||
    text.includes("মুক্তিযুদ্ধ") ||
    text.includes("জাতীয়")
  ) {
    return "Bangladesh Affairs";
  }

  if (
    text.includes("ধ্বনি") ||
    text.includes("শব্দ") ||
    text.includes("সন্ধি") ||
    text.includes("বাক্য")
  ) {
    return "Bangla";
  }

  if (/\d/.test(text) || text.includes("মান") || text.includes("ধারা")) {
    return "Mathematics";
  }

  return "General Knowledge";
}

function verifyQuestions() {
  const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  const questions = data.questions.map((item) => {
    const subject = detectSubject(item.question);

    return {
      ...item,
      subject,
      topic: "",
      subtopic: "",
      difficulty: "medium",
      explanation: "",
      status: "verified_draft",
    };
  });

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        exam: data.exam,
        total: questions.length,
        status: "verified_draft",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("✅ Verified Draft JSON Generated Successfully");
  console.log(`📄 Saved to: ${outputPath}`);
  console.log(`📊 Total Questions: ${questions.length}`);
}

verifyQuestions();