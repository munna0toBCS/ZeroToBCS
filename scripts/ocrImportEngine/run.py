"""
CLI entry point: OCR-based extraction for the Kalpurush-encoded BCS PDFs.

Usage:
    python3 scripts/ocrImportEngine/run.py "10 BCS preliminary .pdf"
    python3 scripts/ocrImportEngine/run.py --all

Source PDFs are read from ~/Desktop/BCS_PDFs. Rendered page images and raw
OCR detections are cached under questionBank/.ocr_cache/<examCode>/ so
re-runs (e.g. while tuning parse.py) skip the slow OCR step. Final parsed
JSON is written to questionBank/ocr_<examCode>_parsed.json.
"""
import argparse
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from extract import render_pages, ocr_pages
from parse import parse_pages
from subjectDetector import detect_subject

SOURCE_DIR = os.path.expanduser("~/Desktop/BCS_PDFs")
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "questionBank")
CACHE_ROOT = os.path.join(OUTPUT_DIR, ".ocr_cache")

PAGE_WIDTH_AT_300DPI = 2550


def detect_exam(file_name):
    match = re.search(r"\d{1,2}", file_name)
    number = match.group(0) if match else "unknown"
    return {
        "examName": file_name if number == "unknown" else f"{number}th BCS Preliminary",
        "examCode": "unknown_exam" if number == "unknown" else f"bcs_{number}",
    }


def remove_duplicate_questions(questions):
    seen = set()
    deduped = []
    for q in questions:
        if q["questionNo"] in seen:
            continue
        seen.add(q["questionNo"])
        deduped.append(q)
    return sorted(deduped, key=lambda q: q["questionNo"])


def validate(questions):
    numbers = [q["questionNo"] for q in questions]
    unique_numbers = set(numbers)
    highest = max(numbers) if numbers else 0
    missing = [i for i in range(1, highest + 1) if i not in unique_numbers]
    needs_review = [q for q in questions if q["status"] == "needs_manual_review"]

    return {
        "totalDetected": len(questions),
        "highestQuestionNo": highest,
        "missing": missing,
        "hasDuplicateNumbers": len(unique_numbers) != len(numbers),
        "needsReviewCount": len(needs_review),
        "isClean": not missing and len(unique_numbers) == len(numbers) and not needs_review,
    }


def process_file(file_name, reader):
    exam = detect_exam(file_name)
    pdf_path = os.path.join(SOURCE_DIR, file_name)
    image_dir = os.path.join(CACHE_ROOT, exam["examCode"], "images")
    cache_dir = os.path.join(CACHE_ROOT, exam["examCode"], "ocr")

    print(f"\n=== {exam['examName']} ({file_name}) ===")

    t0 = time.time()
    image_paths = render_pages(pdf_path, image_dir)
    print(f"Rendered {len(image_paths)} pages ({time.time() - t0:.1f}s)")

    t0 = time.time()
    pages = ocr_pages(image_paths, cache_dir, reader)
    print(f"OCR complete ({time.time() - t0:.1f}s)")

    questions = parse_pages(pages, exam, PAGE_WIDTH_AT_300DPI)
    questions = remove_duplicate_questions(questions)

    for q in questions:
        q["subject"] = detect_subject(q["question"])
        q["examType"] = "Preliminary"
        q["tags"] = ["BCS", exam["examName"], "Preliminary", q["subject"]]

    validation = validate(questions)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_path = os.path.join(OUTPUT_DIR, f"ocr_{exam['examCode']}_parsed.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "examName": exam["examName"],
                "examCode": exam["examCode"],
                "totalQuestions": len(questions),
                "validation": validation,
                "status": "parsed_clean" if validation["isClean"] else "parsed_needs_review",
                "questions": questions,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    print(f"Output: {output_path}")
    print(f"Detected: {validation['totalDetected']} | Highest: {validation['highestQuestionNo']}")
    print(f"Missing: {validation['missing'] or 'None'}")
    print(f"Needs review: {validation['needsReviewCount']}")

    return output_path, validation


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", nargs="?", help="PDF filename in ~/Desktop/BCS_PDFs")
    parser.add_argument("--all", action="store_true", help="Process every PDF in the source folder")
    args = parser.parse_args()

    if not args.file and not args.all:
        parser.error("Provide a filename or --all")

    import easyocr
    reader = easyocr.Reader(["bn", "en"], gpu=False, verbose=False)

    if args.all:
        # The 39th-special file uses different fonts and a different
        # question layout — handled separately, not part of this batch.
        files = sorted(
            f
            for f in os.listdir(SOURCE_DIR)
            if f.lower().endswith(".pdf") and "special" not in f.lower()
        )
    else:
        files = [args.file]

    results = []
    for file_name in files:
        try:
            output_path, validation = process_file(file_name, reader)
            results.append((file_name, "ok", validation))
        except Exception as exc:
            print(f"FAILED: {file_name}: {exc}")
            results.append((file_name, "failed", str(exc)))

    print("\n\n=== BATCH SUMMARY ===")
    for file_name, outcome, info in results:
        if outcome == "ok":
            print(f"{file_name}: {info['totalDetected']} detected, {info['needsReviewCount']} need review, missing {len(info['missing'])}")
        else:
            print(f"{file_name}: FAILED — {info}")


if __name__ == "__main__":
    main()
