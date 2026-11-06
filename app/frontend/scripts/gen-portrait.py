from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
IMAGE = ROOT / "public" / "about.webp"
OUTPUT = ROOT / "src" / "data" / "portrait.ts"
PREVIEW = ROOT / "portrait-preview.png"

COLS = 80
ROW = 0.866
LEVELS = 9
CUTOFF = 0.09
GAMMA = 1.5

image = cv2.imread(str(IMAGE))
if image is None:
    raise FileNotFoundError(f"Tidak dapat membaca gambar: {IMAGE}")

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
height, width = gray.shape
rows = max(1, round((height / width) * COLS / ROW))
small = cv2.resize(gray, (COLS, rows), interpolation=cv2.INTER_AREA)
brightness = small.astype(np.float32) / 255.0
brightness = np.power(brightness, GAMMA)

points = []
for y in range(rows):
    for x in range(COLS):
        value = float(brightness[y, x])
        if value < CUTOFF:
            continue
        level = max(1, min(LEVELS, round(value * LEVELS)))
        points.append([x, y, level])

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(
    "/* DIHASILKAN oleh scripts/gen-portrait.py. Jangan diedit manual.\n"
    "   d = [x, y, ukuran]; x dalam kolom, y dalam baris, ukuran 1..9. */\n"
    "export interface PortraitData { w: number; h: number; d: [number, number, number][] }\n\n"
    f"export const PORTRAIT: PortraitData = {{w:{COLS},h:{rows},d:{points}}};\n",
    encoding="utf-8",
)

preview = cv2.resize(small, (COLS * 8, rows * 8), interpolation=cv2.INTER_NEAREST)
cv2.imwrite(str(PREVIEW), preview)
print(f"Portrait tersimpan: {OUTPUT} ({len(points)} titik)")
