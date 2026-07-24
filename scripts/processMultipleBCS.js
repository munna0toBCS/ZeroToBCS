import { execSync } from "node:child_process";

const exams = [
  {
    pdfFileName: "49-bcs.pdf",
    examName: "49th BCS Preliminary",
    examCode: "49th",
  },
];

console.log("🚀 Starting Multiple BCS Processing...");

for (const exam of exams) {
  console.log(`\n📘 Processing ${exam.examName}...`);

  execSync(
    `node scripts/processBCS.js`,
    {
      stdio: "inherit",
    }
  );
}

console.log("\n✅ All BCS files processed successfully.");