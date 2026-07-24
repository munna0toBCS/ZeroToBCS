"""
PDF -> page images -> raw EasyOCR text detections, cached per page.

The source PDFs embed Bangla text through a non-Unicode legacy font encoding
(see project notes), so the extractable text layer is corrupted regardless of
which library reads it. Rendering pages to images and OCR'ing the pixels
sidesteps that entirely, since the visual rendering is correct.

Each page's raw detections are cached to disk as JSON so the slow OCR step
only ever runs once per page; the parsing logic in parse.py can be iterated
on freely against the cache.
"""
import json
import os

import fitz

DPI = 300


def render_pages(pdf_path, image_dir):
    """Render every page of a PDF to a PNG, skipping pages already rendered."""
    os.makedirs(image_dir, exist_ok=True)
    doc = fitz.open(pdf_path)

    image_paths = []
    for i, page in enumerate(doc):
        out_path = os.path.join(image_dir, f"page_{i + 1}.png")
        if not os.path.exists(out_path):
            pix = page.get_pixmap(dpi=DPI)
            pix.save(out_path)
        image_paths.append(out_path)

    return image_paths


def ocr_pages(image_paths, cache_dir, reader):
    """Run EasyOCR on each page image, caching raw detections as JSON."""
    os.makedirs(cache_dir, exist_ok=True)

    pages = []
    for image_path in image_paths:
        page_name = os.path.splitext(os.path.basename(image_path))[0]
        cache_path = os.path.join(cache_dir, f"{page_name}.json")

        if os.path.exists(cache_path):
            with open(cache_path, encoding="utf-8") as f:
                detections = json.load(f)
        else:
            results = reader.readtext(image_path, detail=1, paragraph=False)
            detections = [
                {
                    "bbox": [[int(x), int(y)] for x, y in bbox],
                    "text": text,
                    "conf": float(conf),
                }
                for bbox, text, conf in results
            ]
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(detections, f, ensure_ascii=False, indent=2)

        pages.append({"page": page_name, "detections": detections})

    return pages
