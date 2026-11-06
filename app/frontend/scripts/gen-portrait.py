#!/usr/bin/env python3
"""Ubah foto About menjadi titik-titik (dot-matrix) untuk <DotPortrait />."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "about.webp"
TARGET = ROOT / "src" / "data" / "portrait.ts"
PREVIEW = ROOT / "portrait-preview.png"

COLS = 80
ROW = 0.866
LEVELS = 9
CUTOFF = 0.09
GAMMA = 1.5


def load_tone(path: Path) -> np.ndarray:
    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"Foto tidak ditemukan: {path}")

    g = cv2.cvtColor(
        img, cv2.COLOR_BGR2GRAY
    ).astype(np.float32) / 255.0

    g = np.clip(
        g + 1.1 * (
            g - cv2.GaussianBlur(g, (0, 0), 9)
        ),
        0,
        1,
    )

    lo, hi = np.percentile(g, [40, 99.95])

    return np.clip(
        (g - lo) / max(hi - lo, 1e-6),
        0,
        1,
    ) ** GAMMA


def build(tone: np.ndarray) -> dict:
    h, w = tone.shape
    cell = w / COLS

    blurred = cv2.GaussianBlur(
        tone,
        (0, 0),
        sigmaX=cell * 0.4,
    )

    rows = int(h / (cell * ROW))
    pts: list[list[float]] = []

    for gy in range(rows):
        off = 0.5 if gy % 2 else 0.0

        py = min(
            h - 1,
            int((gy * ROW + 0.5) * cell),
        )

        for gx in range(COLS):
            px = min(
                w - 1,
                int((gx + off + 0.5) * cell),
            )

            t = float(blurred[py, px])

            if t < CUTOFF:
                continue

            pts.append([
                round(gx + off, 1),
                gy,
                max(
                    1,
                    min(
                        LEVELS,
                        int(np.ceil(t * LEVELS)),
                    ),
                ),
            ])

    return {
        "w": COLS,
        "h": rows,
        "d": pts,
    }


def write_ts(data: dict) -> None:
    body = json.dumps(data, separators=(",", ":"))

    TARGET.write_text(
        "/* DIHASILKAN oleh scripts/gen-portrait.py. Jangan diedit manual. */\n"
        "export interface PortraitData { w: number; h: number; d: [number, number, number][] }\n\n"
        f"export const PORTRAIT: PortraitData = {body};\n",
        encoding="utf-8",
    )


def write_preview(data: dict) -> None:
    S = 10

    canvas = np.zeros(
        (
            int(data["h"] * S * ROW) + S,
            data["w"] * S + S,
            3,
        ),
        np.uint8,
    )

    for x, y, s in data["d"]:
        r = max(
            1,
            int(S * 0.5 * (0.3 + 0.78 * s / LEVELS)),
        )

        cv2.circle(
            canvas,
            (
                int((x + 0.5) * S),
                int((y * ROW + 0.5) * S),
            ),
            r,
            (240, 240, 240),
            -1,
            cv2.LINE_AA,
        )

    cv2.imwrite(str(PREVIEW), canvas)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", action="store_true")
    args = ap.parse_args()

    data = build(load_tone(SOURCE))
    write_ts(data)

    print(
        f"{len(data['d'])} titik -> "
        f"{TARGET.relative_to(ROOT)}"
    )

    if args.preview:
        write_preview(data)
