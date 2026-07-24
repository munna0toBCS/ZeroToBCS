export function detectSubject(text) {
  if (/[A-Za-z]{3,}/.test(text)) return "English";

  if (
    text.includes("বাংলাদেশ") ||
    text.includes("সংবিধান") ||
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
    text.includes("সমাস") ||
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