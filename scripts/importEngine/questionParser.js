import { normalizeText } from "./textNormalizer.js";

function joinBlockText(block) {
  return normalizeText(block.items.map((item) => item.text).join(" "));
}

function extractOptions(text) {
  const options = { ক: "", খ: "", গ: "", ঘ: "" };

  const pattern =
    /([কখগঘ])[\s.)।:-]+(.*?)(?=\s+[কখগঘ][\s.)।:-]+|\s+উত্তর|\s+উ[:ঃ]|$)/gs;

  let match;

  while ((match = pattern.exec(text)) !== null) {
    const key = match[1];
    const value = normalizeText(match[2]);

    if (value && value.length > 0) {
      options[key] = value;
    }
  }

  return options;
}

function extractAnswer(text) {
  const match =
    text.match(/উত্তর[:ঃ]?\s*([কখগঘ])/i) ||
    text.match(/উ[:ঃ]?\s*([কখগঘ])/i) ||
    text.match(/উত্তর\s*([কখগঘ])/i);

  return match ? match[1] : "";
}

function extractQuestionText(text) {
  return normalizeText(
    text
      .replace(/^[0-9]{1,3}[.)]\s*/, "")
      .replace(/([কখগঘ])[\s.)।:-]+.*?(?=\s+[কখগঘ][\s.)।:-]+|\s+উত্তর|\s+উ[:ঃ]|$)/gs, "")
      .replace(/উত্তর[:ঃ]?.*/g, "")
      .replace(/উ[:ঃ]?.*/g, "")
  );
}

function hasAnyOption(options) {
  return Object.values(options).some((value) => value && value.length > 0);
}

export function parseQuestionBlock(block, exam) {
  const rawText = joinBlockText(block);
  const options = extractOptions(rawText);
  const correctAnswer = extractAnswer(rawText);
  const question = extractQuestionText(rawText);

  return {
    id: `${exam.examCode}_${String(block.questionNo).padStart(3, "0")}`,
    exam: exam.examName,
    examCode: exam.examCode,
    questionNo: block.questionNo,
    question,
    options,
    correctAnswer,
    rawText,
    status:
      question && hasAnyOption(options)
        ? "parsed_pending_answer_review"
        : "needs_manual_review",
  };
}