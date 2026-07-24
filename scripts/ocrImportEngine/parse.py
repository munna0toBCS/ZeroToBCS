"""
Raw per-page EasyOCR detections -> reconstructed reading order -> parsed
question dicts (question text, ক/খ/গ/ঘ options, correct answer, subject).

Layout: source pages are a shared full-width header followed by two columns
of questions (title/header first, then left column top-to-bottom, then right
column top-to-bottom). Boxes are merged into lines by y-proximity (EasyOCR
frequently splits an option marker like "ক" from its value text into two
boxes with slightly different vertical centers).

Answers in these PDFs are printed as the full answer text after "উত্তর:",
not a bare ক/খ/গ/ঘ letter, so the correct option is determined by matching
that text against the four extracted option values.
"""
import difflib
import re

DIGIT_MAP = {"০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"}

Y_LINE_TOLERANCE = 25  # px, at 300 DPI — boxes within this are the same visual line
COLUMN_HEADER_WIDTH_RATIO = 0.5  # box wider than this fraction of page width -> full-width header line

OPTION_KEYS = ["ক", "খ", "গ", "ঘ"]
# The separator after the marker is mandatory: merged lines always join
# tokens with a space, so a real "ক"/"খ"/"গ"/"ঘ" marker is always followed
# by one. Without requiring it, this would also match ordinary Bangla words
# that happen to start with the same letter (e.g. "করেছে-", "গুরুচন্ডালী").
OPTION_LINE_RE = re.compile(r"^\s*([কখগঘ])[.\s)।:-]+(.*)$")
ANSWER_LINE_RE = re.compile(r"^\s*উত্তর\s*[:ঃ]?\s*(.*)$")

# Junk detections: watermark bleed-through and OCR noise tend to be short,
# low-confidence, non-Bangla fragments. Tunable — this is a first pass.
JUNK_RE = re.compile(r"^[A-Za-z0-9^_`~]{1,6}$")

BANGLA_CHAR_RE = re.compile(r"[ঀ-৿]")
LATIN_DIGIT_CHAR_RE = re.compile(r"[A-Za-z0-9]")
SHORT_LATIN_TOKEN_RE = re.compile(r"^[A-Za-z0-9^_`~]{1,8}$")


def option_has_junk(value):
    """
    Flag an already-non-empty option as still containing OCR/watermark
    debris, so "clean" means genuinely clean rather than just "not empty".
    Two signals, both aimed at the watermark bleed-through pattern actually
    seen in these PDFs ("nchnark", "ফid0", stray "|"), not at legitimate
    mixed-script content (e.g. math options with Latin variables, English-
    subject options) — those are single-script per token, so they pass:
      1. A token that itself mixes Bangla and Latin/digit characters
         (a real word essentially never does this).
      2. A short (<=8 char) pure Latin/digit token sitting inside an
         option that otherwise contains Bangla text.
    """
    if "|" in value:
        return True

    has_bangla_anywhere = bool(BANGLA_CHAR_RE.search(value))

    for token in value.split():
        stripped = token.strip(".,;:!?()'\"")
        if not stripped:
            continue
        if BANGLA_CHAR_RE.search(stripped) and LATIN_DIGIT_CHAR_RE.search(stripped):
            return True
        if has_bangla_anywhere and SHORT_LATIN_TOKEN_RE.match(stripped):
            return True

    return False

# Recurring page boilerplate (source watermark, phone number, footer URL).
# These repeat on every page and occasionally OCR with a stray leading digit
# (e.g. the "Biddabari" logo misread as "3iddaba_li"), so they're stripped
# outright rather than relied on to just fail the question-start check.
NOISE_LINE_RES = [
    re.compile(r"iddaba", re.IGNORECASE),
    re.compile(r"www|\.com", re.IGNORECASE),
    re.compile(r"^\s*0\d{2}\D+\d{3}\D+\d{3}\D+\d{2}\s*$"),
    re.compile(r"BCS,\s*Bank", re.IGNORECASE),
    re.compile(r"তম\s*বিসিএস"),  # "Nth BCS" page title, repeats every page
    re.compile(r"প্রিলিমিনারি প্রশ্ন সমাধান"),  # page subtitle
]


def is_noise_line(line):
    return any(pattern.search(line) for pattern in NOISE_LINE_RES)


def to_english_digits(text):
    return "".join(DIGIT_MAP.get(ch, ch) for ch in text)


def is_junk(item):
    text = item["text"].strip()
    if not text:
        return True
    if item["conf"] < 0.15:
        return True
    if JUNK_RE.match(text) and item["conf"] < 0.6:
        return True
    return False


def bbox_bounds(bbox):
    xs = [p[0] for p in bbox]
    ys = [p[1] for p in bbox]
    return min(xs), min(ys), max(xs), max(ys)


def reconstruct_lines(detections, page_width):
    """Order a page's detections into reading-order text lines."""
    items = []
    for d in detections:
        if is_junk(d):
            continue
        x0, y0, x1, y1 = bbox_bounds(d["bbox"])
        items.append({"text": d["text"].strip(), "conf": d["conf"], "x0": x0, "y0": y0, "x1": x1, "cx": (x0 + x1) / 2})

    headers = [it for it in items if (it["x1"] - it["x0"]) > page_width * COLUMN_HEADER_WIDTH_RATIO]
    mid_x = page_width / 2
    left = [it for it in items if it not in headers and it["cx"] < mid_x]
    right = [it for it in items if it not in headers and it["cx"] >= mid_x]

    def merge_into_lines(column_items):
        column_items = sorted(column_items, key=lambda it: it["y0"])
        lines = []
        current = []
        current_y = None

        for it in column_items:
            if current and abs(it["y0"] - current_y) > Y_LINE_TOLERANCE:
                lines.append(current)
                current = []
                current_y = None
            current.append(it)
            current_y = it["y0"] if current_y is None else (current_y + it["y0"]) / 2

        if current:
            lines.append(current)

        return [" ".join(w["text"] for w in sorted(line, key=lambda it: it["x0"])) for line in lines]

    header_lines = [it["text"] for it in sorted(headers, key=lambda it: it["y0"])]
    return header_lines + merge_into_lines(left) + merge_into_lines(right)


def is_question_start(line):
    match = re.match(r"^([0-9০-৯]{1,3})\s*[.)।,]?\s*(.*)$", line.strip())
    if not match:
        return None
    return int(to_english_digits(match.group(1))), match.group(2).strip()


# How far ahead of the last real question number a candidate is still
# plausible as "the next question" rather than OCR noise (a misread phone
# number, watermark fragment, stray digit) — these routinely land far
# outside a believable next-question gap. Real exams are numbered strictly
# increasing, so this single constraint rejects footer/logo/noise digits
# regardless of what specific text produced them.
MAX_FORWARD_GAP = 5


def split_into_blocks(lines):
    """Group a sequence of reconstructed lines into per-question blocks."""
    blocks = []
    current = None
    last_question_no = 0

    for line in lines:
        start = is_question_start(line)
        is_plausible_next = (
            start
            and last_question_no < start[0] <= last_question_no + MAX_FORWARD_GAP
        )

        if is_plausible_next:
            if current:
                blocks.append(current)
            current = {"questionNo": start[0], "lines": [start[1]] if start[1] else []}
            last_question_no = start[0]
        elif current:
            current["lines"].append(line)

    if current:
        blocks.append(current)

    return blocks


def normalize(text):
    return re.sub(r"\s+", " ", text or "").strip()


FUZZY_MATCH_THRESHOLD = 0.7


def match_answer(options, answer_text):
    """
    Find which option the answer text refers to, filling in a plausible gap
    when needed. Three passes, most to least certain:
      1. Exact/substring match against options that were extracted cleanly.
      2. Fuzzy match (character-level similarity) for an option that differs
         from the answer text by a small OCR slip (a dropped/misread letter).
      3. If exactly one option came back empty (its marker or value was lost
         during OCR/parsing) and nothing else matched, assume the answer
         belongs there — it's the only slot left it could be.
    Ambiguous cases (multiple empty options, or no confident match) are left
    unresolved rather than guessed.
    """
    if not answer_text:
        return "", options

    for key in OPTION_KEYS:
        value = options.get(key)
        if value and (value == answer_text or value in answer_text or answer_text in value):
            return key, options

    scored = [
        (key, difflib.SequenceMatcher(None, options[key], answer_text).ratio())
        for key in OPTION_KEYS
        if options.get(key)
    ]
    if scored:
        best_key, best_score = max(scored, key=lambda kv: kv[1])
        if best_score >= FUZZY_MATCH_THRESHOLD:
            return best_key, options

    empty_keys = [k for k in OPTION_KEYS if not options.get(k)]
    if len(empty_keys) == 1:
        filled = {**options, empty_keys[0]: answer_text}
        return empty_keys[0], filled

    return "", options


def parse_block(block, exam):
    lines = block["lines"]
    question_parts = []
    options = {}
    answer_text = None

    for line in lines:
        option_match = OPTION_LINE_RE.match(line)
        answer_match = ANSWER_LINE_RE.match(line)

        if answer_match:
            answer_text = normalize(answer_match.group(1))
        elif option_match and option_match.group(1) not in options:
            options[option_match.group(1)] = normalize(option_match.group(2))
        elif not options:
            # Still before the first option — part of the question text.
            question_parts.append(line)

    question = normalize(" ".join(question_parts))
    correct_key, options = match_answer(options, answer_text)

    has_all_options = all(options.get(k) for k in OPTION_KEYS)
    has_clean_options = has_all_options and not any(
        option_has_junk(options[k]) for k in OPTION_KEYS
    )
    status = (
        "parsed_clean"
        if question and has_clean_options and correct_key
        else "needs_manual_review"
    )

    return {
        "id": f"{exam['examCode']}_{str(block['questionNo']).zfill(3)}",
        "exam": exam["examName"],
        "examCode": exam["examCode"],
        "questionNo": block["questionNo"],
        "question": question,
        "options": {k: options.get(k, "") for k in OPTION_KEYS},
        "correctAnswer": correct_key,
        "answerText": answer_text or "",
        "status": status,
    }


def parse_pages(pages, exam, page_width):
    """pages: list of {"page": name, "detections": [...]}, in page order."""
    all_lines = []
    for page in pages:
        all_lines.extend(reconstruct_lines(page["detections"], page_width))

    all_lines = [line for line in all_lines if not is_noise_line(line)]

    blocks = split_into_blocks(all_lines)
    return [parse_block(block, exam) for block in blocks]
