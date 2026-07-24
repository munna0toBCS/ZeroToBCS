export function normalizeText(text) {
  return String(text || "")
    .replace(/BCS, Bank, Primary & Other Job'?s Preparation/gi, "")
    .replace(/096\s*444\s*333\s*00/gi, "")
    .replace(/www\.[^\s]+/gi, "")
    .replace(/Page\s*[-–]?\s*\d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeTextItem(item) {
  return {
    ...item,
    text: normalizeText(item.text),
  };
}