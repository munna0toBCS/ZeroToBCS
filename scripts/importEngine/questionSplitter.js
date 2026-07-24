const digitMap = {
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

function toEnglishNumber(value) {
  return String(value)
    .split("")
    .map((ch) => digitMap[ch] || ch)
    .join("");
}

function isQuestionStart(text) {
  return /^[0-9০-৯]{1,3}[.)।]\s*/.test(text);
}

function getQuestionNo(text) {
  const match = text.match(/^([0-9۰-۹০-৯]{1,3})[.)।]?/);
  if (!match) return null;
  return Number(toEnglishNumber(match[1]));
}

export function splitQuestionBlocks(layoutPages) {
  const questionBlocks = [];
  let currentBlock = null;

  for (const page of layoutPages) {
    for (const item of page) {
      const text = item.text.trim();

      if (isQuestionStart(text)) {
        if (currentBlock) {
          questionBlocks.push(currentBlock);
        }

        currentBlock = {
          questionNo: getQuestionNo(text),
          items: [item],
        };
      } else if (currentBlock) {
        currentBlock.items.push(item);
      }
    }
  }

  if (currentBlock) {
    questionBlocks.push(currentBlock);
  }

  return questionBlocks.filter((block) => block.questionNo);
}