"""
QuickFare Cover Engine — Test / Demo Script
============================================
Generates 3+ sample covers using solid-colour test backgrounds to verify
the typography overlay system works end-to-end.

Run:
    cd /mnt/agents/output
    python test_cover_engine.py

Output covers are saved to ``/mnt/agents/output/test_covers/``.
"""

import os
import sys
from PIL import Image, ImageDraw

# ensure our modules are importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cover_engine import CoverEngine, batch_generate

TEST_OUT = "/mnt/agents/output/test_covers"
TEST_BG = "/mnt/agents/output/test_backgrounds"


def make_solid_background(name: str, color: tuple, size: tuple = (1000, 1500)) -> str:
    """Create a solid-colour JPEG background for testing."""
    os.makedirs(TEST_BG, exist_ok=True)
    path = os.path.join(TEST_BG, name)
    img = Image.new("RGB", size, color)
    img.save(path, "JPEG", quality=90)
    return path


def make_gradient_background(name: str, top: tuple, bottom: tuple, size: tuple = (1000, 1500)) -> str:
    """Create a vertical-gradient JPEG background."""
    os.makedirs(TEST_BG, exist_ok=True)
    path = os.path.join(TEST_BG, name)
    w, h = size
    arr = []
    for y in range(h):
        ratio = y / (h - 1)
        r = int(top[0] * (1 - ratio) + bottom[0] * ratio)
        g = int(top[1] * (1 - ratio) + bottom[1] * ratio)
        b = int(top[2] * (1 - ratio) + bottom[2] * ratio)
        arr.extend([r, g, b] * w)
    img = Image.frombytes("RGB", size, bytes(arr))
    img.save(path, "JPEG", quality=90)
    return path


def make_noise_background(name: str, base: tuple, size: tuple = (1000, 1500)) -> str:
    """Create a textured noise background (simulates real AI art)."""
    import numpy as np
    os.makedirs(TEST_BG, exist_ok=True)
    path = os.path.join(TEST_BG, name)
    arr = np.full((*size, 3), base, dtype=np.uint8)
    noise = np.random.randint(-30, 30, arr.shape, dtype=np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(path, "JPEG", quality=90)
    return path


def demo_single_covers():
    """Generate individual demo covers."""
    engine = CoverEngine()
    os.makedirs(TEST_OUT, exist_ok=True)

    # ─── Cover 1: Quran / Hadith (dark emerald bg, bilingual) ─────────────
    bg1 = make_solid_background("bg_quran.jpg", (15, 45, 35))
    out1 = engine.generate_cover(
        background_path=bg1,
        title="Tafsir Ibn Kathir",
        subtitle="A Comprehensive Commentary on the Quran",
        category="Quran & Hadith",
        output_path=os.path.join(TEST_OUT, "demo_quran_bilingual.jpg"),
        language="bilingual",
        urdu_title="تفسیر ابن کثیر",
        price="₨ 450",
        quality=95,
    )
    print(f"[demo 1] {out1}")

    # ─── Cover 2: Seerah (twilight gradient, amber text, desert frame) ──
    bg2 = make_gradient_background("bg_seerah.jpg", (35, 20, 60), (80, 50, 100))
    out2 = engine.generate_cover(
        background_path=bg2,
        title="The Sealed Nectar",
        subtitle="Biography of the Noble Prophet",
        category="Seerah",
        output_path=os.path.join(TEST_OUT, "demo_seerah.jpg"),
        language="english",
        price="₨ 380",
        quality=95,
    )
    print(f"[demo 2] {out2}")

    # ─── Cover 3: Youth (void-black bg, neon glow, electric blue) ─────────
    bg3 = make_noise_background("bg_youth.jpg", (12, 12, 18))
    out3 = engine.generate_cover(
        background_path=bg3,
        title=" Muslim Youth in the Modern World",
        subtitle="Challenges, Identity & Faith",
        category="Youth",
        output_path=os.path.join(TEST_OUT, "demo_youth.jpg"),
        language="english",
        price="₨ 299",
        quality=95,
    )
    print(f"[demo 3] {out3}")

    # ─── Cover 4: Women (rose gradient, bilingual with Urdu) ─────────────
    bg4 = make_gradient_background("bg_women.jpg", (120, 50, 70), (80, 30, 50))
    out4 = engine.generate_cover(
        background_path=bg4,
        title="The Ideal Muslimah",
        subtitle="The True Islamic Personality",
        category="Women",
        output_path=os.path.join(TEST_OUT, "demo_women_urdu.jpg"),
        language="bilingual",
        urdu_title="مثالی مسلمان عورت",
        price="₨ 350",
        quality=95,
    )
    print(f"[demo 4] {out4}")

    # ─── Cover 5: Finance (dark slate, left-aligned) ──────────────────────
    bg5 = make_gradient_background("bg_finance.jpg", (25, 30, 35), (45, 50, 55))
    out5 = engine.generate_cover(
        background_path=bg5,
        title="Islamic Finance Principles",
        subtitle="A Guide to Halal Wealth Management",
        category="Finance",
        output_path=os.path.join(TEST_OUT, "demo_finance.jpg"),
        language="english",
        price="₨ 420",
        quality=95,
    )
    print(f"[demo 5] {out5}")

    # ─── Cover 6: Very long title stress-test ─────────────────────────────
    bg6 = make_solid_background("bg_long.jpg", (60, 80, 70))
    out6 = engine.generate_cover(
        background_path=bg6,
        title="The Comprehensive Encyclopedia of Islamic Jurisprudence According to the Four Major Schools of Thought",
        subtitle="Volume III: Transactions & Contracts",
        category="Fiqh",
        output_path=os.path.join(TEST_OUT, "demo_long_title.jpg"),
        language="english",
        quality=95,
    )
    print(f"[demo 6] {out6}")

    return [out1, out2, out3, out4, out5, out6]


def demo_batch():
    """Demonstrate the batch_generate helper."""
    engine = CoverEngine()
    books = [
        {
            "background_path": make_solid_background("bg_batch1.jpg", (40, 30, 20)),
            "title": "Hajj Made Easy",
            "subtitle": "A Step-by-Step Practical Guide",
            "category": "Hajj & Ziyarat",
            "language": "english",
            "price": "₨ 250",
            "output_name": "batch_hajj.jpg",
        },
        {
            "background_path": make_gradient_background("bg_batch2.jpg", (50, 70, 50), (80, 110, 80)),
            "title": "Healing with the Medicine of the Prophet",
            "subtitle": "Tibb Nabawi",
            "category": "Health",
            "language": "bilingual",
            "urdu_title": "نبی کی طب",
            "price": "₨ 320",
            "output_name": "batch_health.jpg",
        },
        {
            "background_path": make_solid_background("bg_batch3.jpg", (140, 100, 50)),
            "title": "Lost Islamic History",
            "subtitle": "Reclaiming Muslim Civilisation",
            "category": "Islamic History",
            "language": "english",
            "price": "₨ 399",
            "output_name": "batch_history.jpg",
        },
    ]
    return batch_generate(engine, books, output_dir=TEST_OUT)


def inspect_results(paths: list):
    """Quick sanity check on generated files."""
    print("\n" + "=" * 60)
    print("INSPECTION REPORT")
    print("=" * 60)
    for p in paths:
        if p and os.path.isfile(p):
            sz = os.path.getsize(p)
            img = Image.open(p)
            print(f"  {os.path.basename(p):30s}  {img.size}  {sz // 1024} KB")
        else:
            print(f"  MISSING: {p}")
    print("=" * 60)


def main():
    print("QuickFare Cover Engine — Test Suite")
    print("=" * 60)

    single_paths = demo_single_covers()
    batch_paths = demo_batch()

    all_paths = single_paths + [p for p in batch_paths if p]
    inspect_results(all_paths)

    # final summary
    ok = sum(1 for p in all_paths if p and os.path.isfile(p))
    print(f"\nSuccess: {ok}/{len(all_paths)} covers generated.")
    print(f"Output directory: {TEST_OUT}")


if __name__ == "__main__":
    main()
