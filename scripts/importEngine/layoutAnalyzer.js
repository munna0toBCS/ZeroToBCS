import { normalizeTextItem } from "./textNormalizer.js";

export function analyzeLayout(pages) {
  const blocks = [];

  for (const page of pages) {
    const cleaned = page
      .map(normalizeTextItem)
      .filter((item) => item.text.length > 0)
      .sort((a, b) => {
        if (Math.abs(a.y - b.y) < 0.3) {
          return a.x - b.x;
        }
        return a.y - b.y;
      });

    blocks.push(cleaned);
  }

  return blocks;
}