import fs from "node:fs";
import path from "node:path";
import PDFParser from "pdf2json";

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

function extractQuestions(text) {
  const blocks = text
    .split(/\n(?=\d+\.)/)
    .map((item) => item.trim())
    .filter(Boolean);

  return blocks.map((block, index) => ({
    id: `bcs_49_${String(index + 1).padStart(3, "0")}`,
    exam: "49th BCS Preliminary",
    questionNo: index + 1,
    rawText: block,
    status: "raw_imported",
  }));
}

const pdfPath = path.join(process.cwd(), "data", "49-bcs.pdf");
const outputPath = path.join(process.cwd(), "questionBank", "49th_raw.json");

try {
  const text = await readPdfText(pdfPath);
  const questions = extractQuestions(text);

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        exam: "49th BCS Preliminary",
        total: questions.length,
        status: "raw_imported",
        questions,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("✅ JSON Generated Successfully");
  console.log(`📄 Saved to: ${outputPath}`);
  console.log(`📊 Total Questions: ${questions.length}`);
} catch (err) {
  console.error(err);
}