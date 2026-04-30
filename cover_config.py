"""
QuickFare Cover Configuration Module
=====================================
Category design systems, color palettes, and style configurations
for the God-Level Cover Production Engine.

This module defines per-category visual systems used by cover_engine.py.
All colors are RGB tuples; fonts are resolved by the FontResolver.
"""

import os
import json
from typing import Dict, Any, Tuple, Optional, List

# ──────────────────────────────────────────────────────────────────────────────
# Global / default cover specs
# ──────────────────────────────────────────────────────────────────────────────
GLOBAL = {
    "width": 1000,
    "height": 1500,
    "safe_margin": 80,            # px from edges
    "brand_text": "QuickFare",
    "brand_font_size": 24,
    "brand_color": (255, 255, 255),
    "brand_opacity": 128,         # 0-255
    "min_contrast": 4.5,
}

# ──────────────────────────────────────────────────────────────────────────────
# Category Design Systems (fallback values)
# Each entry is a dict with:
#   title_color, subtitle_color, accent_color, bar_color, bar_opacity,
#   shadow_type, shadow_color, glow_color, glow_radius,
#   frame_style, frame_color, frame_opacity,
#   alignment, badge_style, texture_opacity, font_weight
# ──────────────────────────────────────────────────────────────────────────────

CATEGORY_STYLES: Dict[str, Dict[str, Any]] = {
    "Hajj & Ziyarat": {
        "title_color": (201, 168, 76),          # Gold #C9A84C
        "subtitle_color": (240, 240, 240),
        "accent_color": (201, 168, 76),
        "bar_color": (10, 20, 40),              # Navy dark
        "bar_opacity": 0.82,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (4, 4),
        "shadow_radius": 6,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "geometric",
        "frame_color": (201, 168, 76),
        "frame_opacity": 0.45,
        "alignment": "center",
        "badge_style": "corner_motif",
        "texture_opacity": 0.08,
        "font_weight": "bold",
    },

    "Parenting & Kids": {
        "title_color": (30, 30, 40),
        "subtitle_color": (60, 60, 70),
        "accent_color": (255, 160, 160),
        "bar_color": (255, 245, 245),            # Light pastel
        "bar_opacity": 0.78,
        "bar_gradient": True,
        "bar_rounded": 24,
        "shadow_type": "soft",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (2, 2),
        "shadow_radius": 4,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "rounded",
        "frame_color": (255, 180, 180),
        "frame_opacity": 0.35,
        "alignment": "center",
        "badge_style": "soft_circle",
        "texture_opacity": 0.0,
        "font_weight": "bold",
    },

    "Finance": {
        "title_color": (255, 255, 255),
        "subtitle_color": (220, 220, 220),
        "accent_color": (50, 200, 150),
        "bar_color": (20, 25, 30),               # Dark slate
        "bar_opacity": 0.70,
        "bar_gradient": True,
        "shadow_type": "hard",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (3, 3),
        "shadow_radius": 3,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "minimal",
        "frame_color": (100, 100, 100),
        "frame_opacity": 0.25,
        "alignment": "left",
        "badge_style": "minimal_badge",
        "texture_opacity": 0.0,
        "font_weight": "bold",
    },

    "Quran & Hadith": {
        "title_color": (212, 175, 55),           # Gold #D4AF37
        "subtitle_color": (240, 240, 220),
        "accent_color": (212, 175, 55),
        "bar_color": (10, 40, 30),               # Emerald dark
        "bar_opacity": 0.80,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (3, 4),
        "shadow_radius": 8,
        "glow_color": (212, 175, 55),
        "glow_radius": 12,
        "frame_style": "ornate",
        "frame_color": (180, 150, 50),
        "frame_opacity": 0.50,
        "alignment": "center",
        "badge_style": "islamic_motif",
        "texture_opacity": 0.12,
        "font_weight": "bold",
    },

    "Islamic History": {
        "title_color": (255, 255, 240),          # Ivory #FFFFF0
        "subtitle_color": (245, 235, 220),
        "accent_color": (200, 160, 80),
        "bar_color": (140, 80, 30),               # Ochre
        "bar_opacity": 0.72,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (60, 30, 10),
        "shadow_offset": (3, 3),
        "shadow_radius": 6,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "manuscript",
        "frame_color": (200, 170, 120),
        "frame_opacity": 0.40,
        "alignment": "center",
        "badge_style": "scroll",
        "texture_opacity": 0.15,
        "font_weight": "bold",
    },

    "Health": {
        "title_color": (255, 253, 208),           # Cream #FFFDD0
        "subtitle_color": (245, 245, 225),
        "accent_color": (150, 200, 100),
        "bar_color": (100, 140, 90),              # Sage
        "bar_opacity": 0.70,
        "bar_gradient": True,
        "shadow_type": "soft",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (2, 3),
        "shadow_radius": 5,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "botanical",
        "frame_color": (150, 200, 120),
        "frame_opacity": 0.35,
        "alignment": "center",
        "badge_style": "leaf",
        "texture_opacity": 0.08,
        "font_weight": "bold",
    },

    "Fiqh": {
        "title_color": (255, 255, 240),           # Ivory
        "subtitle_color": (240, 240, 235),
        "accent_color": (180, 60, 60),
        "bar_color": (80, 20, 30),                # Burgundy
        "bar_opacity": 0.78,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (3, 3),
        "shadow_radius": 5,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "formal",
        "frame_color": (200, 170, 140),
        "frame_opacity": 0.35,
        "alignment": "center",
        "badge_style": "seal",
        "texture_opacity": 0.08,
        "font_weight": "bold",
    },

    "Seerah": {
        "title_color": (255, 191, 0),             # Amber #FFBF00
        "subtitle_color": (255, 230, 180),
        "accent_color": (255, 191, 0),
        "bar_color": (40, 20, 60),                # Twilight dark
        "bar_opacity": 0.75,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (4, 4),
        "shadow_radius": 7,
        "glow_color": (255, 191, 0),
        "glow_radius": 8,
        "frame_style": "desert_silhouette",
        "frame_color": (200, 150, 80),
        "frame_opacity": 0.40,
        "alignment": "center",
        "badge_style": "crescent",
        "texture_opacity": 0.10,
        "font_weight": "bold",
    },

    "Spirituality": {
        "title_color": (192, 192, 192),           # Silver #C0C0C0
        "subtitle_color": (220, 220, 220),
        "accent_color": (180, 180, 220),
        "bar_color": (15, 15, 30),                # Midnight
        "bar_opacity": 0.72,
        "bar_gradient": True,
        "shadow_type": "soft",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (2, 4),
        "shadow_radius": 10,
        "glow_color": (180, 180, 220),
        "glow_radius": 15,
        "frame_style": "ethereal",
        "frame_color": (180, 180, 210),
        "frame_opacity": 0.30,
        "alignment": "center",
        "badge_style": "star",
        "texture_opacity": 0.08,
        "font_weight": "normal",
    },

    "Women": {
        "title_color": (255, 245, 240),           # Pearl
        "subtitle_color": (255, 235, 230),
        "accent_color": (220, 130, 150),
        "bar_color": (140, 60, 80),               # Rose
        "bar_opacity": 0.70,
        "bar_gradient": True,
        "shadow_type": "soft",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (2, 3),
        "shadow_radius": 6,
        "glow_color": (255, 200, 210),
        "glow_radius": 8,
        "frame_style": "arabesque",
        "frame_color": (230, 180, 190),
        "frame_opacity": 0.35,
        "alignment": "center",
        "badge_style": "floral",
        "texture_opacity": 0.10,
        "font_weight": "bold",
    },

    "Youth": {
        "title_color": (0, 217, 255),             # Electric Blue #00D9FF
        "subtitle_color": (200, 240, 255),
        "accent_color": (0, 217, 255),
        "bar_color": (10, 10, 15),                # Void black
        "bar_opacity": 0.65,
        "bar_gradient": True,
        "shadow_type": "hard",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (0, 0),
        "shadow_radius": 4,
        "glow_color": (0, 217, 255),
        "glow_radius": 18,
        "frame_style": "neon",
        "frame_color": (0, 217, 255),
        "frame_opacity": 0.50,
        "alignment": "center",
        "badge_style": "neon_pulse",
        "texture_opacity": 0.0,
        "font_weight": "bold",
    },

    "Food": {
        "title_color": (255, 200, 50),            # Saffron
        "subtitle_color": (255, 245, 220),
        "accent_color": (200, 180, 60),
        "bar_color": (60, 70, 40),                # Olive
        "bar_opacity": 0.70,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (2, 3),
        "shadow_radius": 5,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "organic",
        "frame_color": (200, 180, 80),
        "frame_opacity": 0.35,
        "alignment": "center",
        "badge_style": "spice",
        "texture_opacity": 0.08,
        "font_weight": "bold",
    },

    # ─── catch-all fallback ───
    "Islamic": {
        "title_color": (255, 255, 255),
        "subtitle_color": (230, 230, 230),
        "accent_color": (200, 200, 200),
        "bar_color": (20, 20, 30),
        "bar_opacity": 0.72,
        "bar_gradient": True,
        "shadow_type": "drop",
        "shadow_color": (0, 0, 0),
        "shadow_offset": (3, 3),
        "shadow_radius": 6,
        "glow_color": None,
        "glow_radius": 0,
        "frame_style": "minimal",
        "frame_color": (200, 200, 200),
        "frame_opacity": 0.25,
        "alignment": "center",
        "badge_style": "default",
        "texture_opacity": 0.0,
        "font_weight": "bold",
    },
}


# ──────────────────────────────────────────────────────────────────────────────
# Font resolution map
# ──────────────────────────────────────────────────────────────────────────────

FONT_MAP = {
    "english_primary": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
    ],
    "english_secondary": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    ],
    "urdu_primary": [
        "/usr/share/fonts/truetype/noto/NotoNastaliqUrdu-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoNastaliqUrdu-Regular.ttf",
    ],
    "urdu_secondary": [
        "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf",
    ],
}

# User override directory (highest priority)
FONT_OVERRIDE_DIR = "/mnt/agents/output/fonts"


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def get_category_style(category: str) -> Dict[str, Any]:
    """
    Return the design-system dict for a category.
    Falls back to the generic 'Islamic' entry if unknown.
    """
    return CATEGORY_STYLES.get(category, CATEGORY_STYLES["Islamic"]).copy()


def get_font_candidates(role: str) -> List[str]:
    """
    Return a prioritized list of absolute font-path candidates.
    *role* is one of:
        english_primary, english_secondary,
        urdu_primary, urdu_secondary
    """
    candidates = []

    # 1) User overrides first
    if os.path.isdir(FONT_OVERRIDE_DIR):
        for f in sorted(os.listdir(FONT_OVERRIDE_DIR)):
            lower = f.lower()
            if not lower.endswith((".ttf", ".otf")):
                continue
            if role.startswith("english") and any(
                k in lower for k in ("sans", "serif", "dejavu", "liberation", "noto")
            ):
                candidates.append(os.path.join(FONT_OVERRIDE_DIR, f))
            if role.startswith("urdu") and any(
                k in lower for k in ("urdu", "nastaliq", "naskh", "arabic")
            ):
                candidates.append(os.path.join(FONT_OVERRIDE_DIR, f))

    # 2) System defaults
    candidates.extend(FONT_MAP.get(role, []))
    return candidates


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert '#RRGGBB' or '#RGB' to (R, G, B)."""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    """Convert (R, G, B) to '#RRGGBB'."""
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def luminance(rgb: Tuple[int, int, int]) -> float:
    """Relative luminance per WCAG 2.1."""
    def _channel(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb
    return 0.2126 * _channel(r) + 0.7152 * _channel(g) + 0.0722 * _channel(b)


def contrast_ratio(rgb1: Tuple[int, int, int], rgb2: Tuple[int, int, int]) -> float:
    """WCAG contrast ratio between two RGB colours."""
    l1, l2 = luminance(rgb1), luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def suggest_text_color(bg_rgb: Tuple[int, int, int]) -> Tuple[int, int, int]:
    """Return white or near-black depending on background luminance."""
    lum = luminance(bg_rgb)
    return (255, 255, 255) if lum < 0.5 else (15, 15, 15)


def load_json_config(path: str) -> Dict[str, Any]:
    """Load an external JSON design-system override."""
    if not os.path.isfile(path):
        return {}
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


# ──────────────────────────────────────────────────────────────────────────────
# When imported, print sanity-check info
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"[cover_config] Loaded {len(CATEGORY_STYLES)} category styles.")
    for cat in sorted(CATEGORY_STYLES.keys()):
        style = CATEGORY_STYLES[cat]
        print(f"  {cat}: title={style['title_color']}, bar_opacity={style['bar_opacity']}")
