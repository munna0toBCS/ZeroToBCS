import re

ENGLISH_RE = re.compile(r"[A-Za-z]{3,}")


def detect_subject(text):
    if ENGLISH_RE.search(text):
        return "English"

    if any(kw in text for kw in ["বাংলাদেশ", "সংবিধান", "মুক্তিযুদ্ধ", "জাতীয়", "রাষ্ট্রপতি", "প্রধানমন্ত্রী"]):
        return "Bangladesh Affairs"

    if any(kw in text for kw in ["ধ্বনি", "শব্দ", "সন্ধি", "সমাস", "বাক্য", "রবীন্দ্র", "নজরুল", "কবি", "উপন্যাস", "নাটক", "বানান"]):
        return "Bangla"

    if any(kw in text for kw in ["মান", "ধারা", "সেট", "অনুপাত", "সমাধান", "সংখ্যা"]) or re.search(r"\d", text):
        return "Mathematics"

    return "General Knowledge"
