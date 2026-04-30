"""
QuickFare God-Level Cover Production Engine
============================================
Art-First Typography Workflow for the QuickFare Islamic ebook OTT platform.

This module overlays professional, publication-ready typography onto AI-generated
background images (NO TEXT).  It handles:
  • Smart text-contrast via background analysis
  • Category-specific colour systems, gradient bars, shadows & glows
  • RTL / Urdu Nastaliq typography
  • Dynamic font sizing, safe-margin layout, price badges
  • Decorative frames, QuickFare branding, quality validation

Dependencies
------------
  pip install Pillow numpy

Example
-------
  engine = CoverEngine()
  engine.generate_cover(
      background_path="bg.jpg",
      title="Tafsir Ibn Kathir",
      subtitle="Volume 1",
      category="Quran & Hadith",
      language="bilingual",
      urdu_title="تفسیر ابن کثیر",
      price="₨ 450",
      output_path="cover.jpg"
  )
"""

import os
import sys
import textwrap
import colorsys
from typing import Dict, Any, Tuple, Optional, List
from pathlib import Path

import numpy as np
from PIL import (
    Image,
    ImageDraw,
    ImageFont,
    ImageFilter,
    ImageEnhance,
    ImageChops,
)

import cover_config as cfg

# ──────────────────────────────────────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────────────────────────────────────
COVER_W = cfg.GLOBAL["width"]
COVER_H = cfg.GLOBAL["height"]
SAFE_MARGIN = cfg.GLOBAL["safe_margin"]


# ──────────────────────────────────────────────────────────────────────────────
# FontResolver
# ──────────────────────────────────────────────────────────────────────────────

class FontResolver:
    """
    Finds and caches the best available TTF/OTF font for Latin or Urdu scripts.

    Resolution order
    ----------------
    1. Custom fonts in ``/mnt/agents/output/fonts/``
    2. System fonts (DejaVu, Liberation, Noto families)
    3. Fallback to DejaVuSans (guaranteed on most Linux)
    """

    def __init__(self):
        self._cache: Dict[Tuple[str, int], ImageFont.FreeTypeFont] = {}

    def _find_path(self, role: str) -> str:
        """Return the first existing file for *role* or a hard fallback."""
        for candidate in cfg.get_font_candidates(role):
            if os.path.isfile(candidate):
                return candidate
        # ultimate fallback
        return "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

    def get(self, role: str, size: int) -> ImageFont.FreeTypeFont:
        key = (role, size)
        if key not in self._cache:
            path = self._find_path(role)
            try:
                self._cache[key] = ImageFont.truetype(path, size)
            except Exception:
                # last-ditch: load default PIL font (ugly but works)
                self._cache[key] = ImageFont.load_default()
        return self._cache[key]

    def english_font(self, size: int, weight: str = "bold") -> ImageFont.FreeTypeFont:
        role = "english_primary" if weight == "bold" else "english_secondary"
        return self.get(role, size)

    def urdu_font(self, size: int, weight: str = "bold") -> ImageFont.FreeTypeFont:
        role = "urdu_primary" if weight == "bold" else "urdu_secondary"
        return self.get(role, size)


# ──────────────────────────────────────────────────────────────────────────────
# Helpers (pure functions)
# ──────────────────────────────────────────────────────────────────────────────

def _lum(rgb: Tuple[int, ...]) -> float:
    """WCAG relative luminance."""
    def ch(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2])


def _contrast(a: Tuple[int, ...], b: Tuple[int, ...]) -> float:
    l1, l2 = _lum(a), _lum(b)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


def _blend(front: Tuple[int, int, int], back: Tuple[int, int, int], alpha: float):
    """Alpha-blend *front* over *back*.  alpha ∈ [0, 1]."""
    return tuple(int(f * alpha + b * (1 - alpha)) for f, b in zip(front, back))


def _hex_to_rgb(h: str) -> Tuple[int, int, int]:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def _resize_to_cover(img: Image.Image) -> Image.Image:
    """Resize *img* to exactly 1000×1500 using high-quality downsample."""
    if img.size != (COVER_W, COVER_H):
        return img.resize((COVER_W, COVER_H), Image.LANCZOS)
    return img


def _dominant_color(img: Image.Image, k: int = 5) -> Tuple[int, int, int]:
    """
    Quick dominant-colour estimate using resized histogram.
    Returns the most common RGB after aggressive quantisation.
    """
    small = img.resize((50, 75), Image.LANCZOS)
    arr = np.array(small).reshape(-1, 3)
    # quantise to 8 bins per channel
    bins = (arr // 32) * 32 + 16
    uniq, counts = np.unique(bins, axis=0, return_counts=True)
    dominant = uniq[np.argmax(counts)]
    return tuple(int(c) for c in dominant)


def _brightness(img: Image.Image) -> float:
    """Mean grey-scale brightness in [0, 255]."""
    grey = img.convert("L").resize((100, 150), Image.LANCZOS)
    return float(np.mean(np.array(grey)))


def _smart_text_color(bg_rgb: Tuple[int, int, int],
                     desired: Tuple[int, int, int],
                     min_contrast: float = 4.5) -> Tuple[int, int, int]:
    """
    Return *desired* if it already meets contrast against *bg_rgb*;
    otherwise flip to white or black and still verify.
    """
    if _contrast(desired, bg_rgb) >= min_contrast:
        return desired
    white, black = (255, 255, 255), (15, 15, 15)
    if _contrast(white, bg_rgb) >= _contrast(black, bg_rgb):
        return white
    return black


def _wrap_text(text: str, max_chars: int) -> List[str]:
    """Split *text* into lines no longer than *max_chars*."""
    if not text:
        return []
    return textwrap.wrap(text, width=max_chars)


def _text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> Tuple[int, int]:
    """Return (width, height) of *text* rendered with *font*."""
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def _scale_font_size(text: str,
                     max_width: int,
                     max_height: int,
                     font_fn,
                     draw: ImageDraw.ImageDraw,
                     start_size: int = 120,
                     min_size: int = 28) -> Tuple[ImageFont.FreeTypeFont, int, int]:
    """
    Binary-search the largest font size so the text fits inside
    (max_width, max_height).  Returns (font, text_width, text_height).
    """
    lo, hi = min_size, start_size
    best_font = font_fn(hi)
    best_w, best_h = _text_size(draw, text, best_font)

    while lo <= hi:
        mid = (lo + hi) // 2
        font = font_fn(mid)
        w, h = _text_size(draw, text, font)
        if w <= max_width and h <= max_height:
            best_font, best_w, best_h = font, w, h
            lo = mid + 1
        else:
            hi = mid - 1
    return best_font, best_w, best_h


def _fit_wrapped_text(text: str,
                      max_width: int,
                      max_height: int,
                      font_fn,
                      draw: ImageDraw.ImageDraw,
                      start_size: int = 120,
                      min_size: int = 28,
                      max_lines: int = 4) -> Tuple[ImageFont.FreeTypeFont, List[str], int, int]:
    """
    Find the best font size for *text*, wrapping into multiple lines if needed.

    Tries single-line first.  If the text does not fit even at *min_size*,
    progressively wraps into 2, 3, … up to *max_lines* lines and binary-searches
    again.  Returns (font, lines, total_width, total_height).
    """
    # 1) Try single-line
    font, w, h = _scale_font_size(text, max_width, max_height, font_fn, draw,
                                  start_size, min_size)
    if w <= max_width:
        return font, [text], w, h

    # 2) Single-line didn't fit even at min_size -> wrap
    for line_count in range(2, max_lines + 1):
        # estimate per-line height budget
        line_budget = max_height // line_count
        # binary-search a font size that fits *one* line
        best_font = font_fn(min_size)
        best_size = min_size
        lo, hi = min_size, start_size
        while lo <= hi:
            mid = (lo + hi) // 2
            font = font_fn(mid)
            # Find wrap width that keeps each line <= max_width
            for wrap_chars in range(len(text), 5, -1):
                lines = textwrap.wrap(text, width=wrap_chars)
                if len(lines) <= line_count:
                    max_line_w = max(
                        (_text_size(draw, line, font)[0] for line in lines),
                        default=0
                    )
                    if max_line_w <= max_width:
                        break
            else:
                hi = mid - 1
                continue
            # check total height
            line_h = _text_size(draw, "Ay", font)[1]
            total_h = line_h * len(lines) + 6 * (len(lines) - 1)  # 6px leading
            if total_h <= max_height:
                best_font, best_size = font, mid
                lo = mid + 1
            else:
                hi = mid - 1

        # Recompute with best_font
        for wrap_chars in range(len(text), 5, -1):
            lines = textwrap.wrap(text, width=wrap_chars)
            if len(lines) <= line_count:
                max_line_w = max(
                    (_text_size(draw, line, best_font)[0] for line in lines),
                    default=0
                )
                if max_line_w <= max_width:
                    break
        else:
            lines = textwrap.wrap(text, width=20)

        line_h = _text_size(draw, "Ay", best_font)[1]
        total_h = line_h * len(lines) + 6 * (len(lines) - 1)
        total_w = max((_text_size(draw, line, best_font)[0] for line in lines), default=0)
        if total_w <= max_width and total_h <= max_height:
            return best_font, lines, total_w, total_h

    # 3) Ultimate fallback: min_size, forced wrap at 20 chars
    font = font_fn(min_size)
    lines = textwrap.wrap(text, width=20)
    total_w = max((_text_size(draw, line, font)[0] for line in lines), default=0)
    line_h = _text_size(draw, "Ay", font)[1]
    total_h = line_h * len(lines) + 6 * (len(lines) - 1)
    return font, lines, total_w, total_h


def _draw_rounded_rect(draw: ImageDraw.ImageDraw,
                       xy: Tuple[int, int, int, int],
                       radius: int,
                       fill=None,
                       outline=None,
                       width: int = 1):
    """Draw a rounded rectangle (PIL ≥ 8.0 has native support)."""
    try:
        draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)
    except AttributeError:
        # fallback for very old PIL
        x1, y1, x2, y2 = xy
        draw.rectangle(xy, fill=fill, outline=outline, width=width)


def _create_gradient(size: Tuple[int, int],
                     color_top: Tuple[int, int, int],
                     color_bottom: Tuple[int, int, int],
                     direction: str = "vertical") -> Image.Image:
    """Create a simple linear gradient image."""
    w, h = size
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    if direction == "vertical":
        for y in range(h):
            ratio = y / (h - 1) if h > 1 else 0
            arr[y, :] = [
                int(color_top[i] * (1 - ratio) + color_bottom[i] * ratio)
                for i in range(3)
            ]
    else:
        for x in range(w):
            ratio = x / (w - 1) if w > 1 else 0
            arr[:, x] = [
                int(color_top[i] * (1 - ratio) + color_bottom[i] * ratio)
                for i in range(3)
            ]
    return Image.fromarray(arr)


# ──────────────────────────────────────────────────────────────────────────────
# CoverEngine
# ──────────────────────────────────────────────────────────────────────────────

class CoverEngine:
    """
    Production-grade cover typography engine.

    Parameters
    ----------
    config_path : str
        Ignored for now; all config lives in ``cover_config.py``.
        Reserved for future JSON overrides.
    """

    def __init__(self, config_path: str = "cover_config.py"):
        self.fonts = FontResolver()
        self.config_path = config_path
        # JSON override support
        self._json_override: Dict[str, Any] = {}
        if os.path.isfile(config_path) and config_path.endswith(".json"):
            self._json_override = cfg.load_json_config(config_path)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def generate_cover(self,
                       background_path: str,
                       title: str,
                       subtitle: str = "",
                       category: str = "Islamic",
                       output_path: str = "output.jpg",
                       language: str = "english",
                       urdu_title: str = "",
                       price: str = "",
                       quality: int = 95) -> str:
        """
        Main entry point.

        1. Load & resize background
        2. Analyse brightness / dominant colour
        3. Overlay gradient text bar
        4. Render title (English + optional Urdu)
        5. Render subtitle
        6. Add decorative frame / category badge
        7. Add price badge
        8. Add QuickFare brand watermark
        9. Validate contrast / save

        Returns absolute path to the saved cover image.
        """
        # --- load background ------------------------------------------------
        bg = Image.open(background_path).convert("RGB")
        bg = _resize_to_cover(bg)
        canvas = bg.copy()
        draw = ImageDraw.Draw(canvas)

        # --- analyse background ----------------------------------------------
        analysis = self._analyze_background(bg)
        bg_brightness = analysis["brightness"]
        dominant = analysis["dominant"]

        # --- resolve category style ------------------------------------------
        style = cfg.get_category_style(category)
        # merge JSON overrides if any
        if category in self._json_override:
            style.update(self._json_override[category])

        # --- smart text colours ----------------------------------------------
        title_color = _smart_text_color(
            dominant, style["title_color"], cfg.GLOBAL["min_contrast"]
        )
        subtitle_color = _smart_text_color(
            dominant, style["subtitle_color"], cfg.GLOBAL["min_contrast"]
        )

        # --- text spec dict (passed around) ----------------------------------
        text_spec = {
            "title": title,
            "subtitle": subtitle,
            "urdu_title": urdu_title,
            "language": language,
            "style": style,
            "title_color": title_color,
            "subtitle_color": subtitle_color,
            "dominant_bg": dominant,
            "brightness": bg_brightness,
        }

        # --- apply all overlays -----------------------------------------------
        canvas = self._apply_text_overlay(canvas, text_spec, draw)
        draw = ImageDraw.Draw(canvas)  # refresh after canvas swap

        # decorative frame
        canvas = self._add_category_frame(canvas, category, style)
        draw = ImageDraw.Draw(canvas)

        # price badge
        if price:
            canvas = self._add_price_badge(canvas, price, style)
            draw = ImageDraw.Draw(canvas)

        # QuickFare brand
        canvas = self._add_quickfare_brand(canvas, category)

        # --- quality / validation ---------------------------------------------
        self._validate_output(canvas, text_spec)

        # --- save -------------------------------------------------------------
        out_dir = os.path.dirname(os.path.abspath(output_path))
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        canvas.save(output_path, "JPEG", quality=quality, optimize=True)
        return os.path.abspath(output_path)

    # ------------------------------------------------------------------
    # Background Analysis
    # ------------------------------------------------------------------

    def _analyze_background(self, image: Image.Image) -> dict:
        """
        Compute brightness and dominant colour of *image*.

        Returns
        -------
        dict with keys ``brightness`` (0-255 float) and ``dominant`` (RGB tuple).
        """
        return {
            "brightness": _brightness(image),
            "dominant": _dominant_color(image),
        }

    # ------------------------------------------------------------------
    # Text Overlay
    # ------------------------------------------------------------------

    def _apply_text_overlay(self,
                            image: Image.Image,
                            spec: dict,
                            draw_ref: ImageDraw.ImageDraw) -> Image.Image:
        """
        Orchestrate the full text stack: gradient bar, title, subtitle,
        optional Urdu title, shadows / glows.

        Parameters
        ----------
        image : PIL.Image
            Current canvas (RGB).
        spec : dict
            Populated in ``generate_cover``.
        draw_ref : ImageDraw
            Reference draw object for text-size calculations.

        Returns
        -------
        PIL.Image
            Updated canvas.
        """
        style = spec["style"]
        title = spec["title"]
        subtitle = spec["subtitle"]
        urdu_title = spec["urdu_title"]
        language = spec["language"]

        # --- layout constants -------------------------------------------------
        margin = SAFE_MARGIN
        max_text_w = COVER_W - margin * 2
        center_x = COVER_W // 2

        # ------------------------------------------------------------------
        # Title sizing (with automatic wrapping for very long titles)
        # ------------------------------------------------------------------
        title_fn = lambda sz: self.fonts.english_font(sz, style.get("font_weight", "bold"))
        # Short titles get bigger, long titles shrink
        raw_len = len(title)
        start_sz = 110 if raw_len <= 20 else (80 if raw_len <= 40 else 55)
        title_font, title_lines, title_w, title_h = _fit_wrapped_text(
            title, max_text_w, 350, title_fn, draw_ref,
            start_size=start_sz, min_size=32, max_lines=4
        )
        # ------------------------------------------------------------------
        # Urdu sizing (if needed)
        # ------------------------------------------------------------------
        urdu_font, urdu_lines, urdu_w, urdu_h = None, [], 0, 0
        if language in ("urdu", "bilingual") and urdu_title:
            urdu_fn = lambda sz: self.fonts.urdu_font(sz, style.get("font_weight", "bold"))
            u_len = len(urdu_title)
            u_start = 90 if u_len <= 20 else (65 if u_len <= 40 else 48)
            urdu_font, urdu_lines, urdu_w, urdu_h = _fit_wrapped_text(
                urdu_title, max_text_w, 280, urdu_fn, draw_ref,
                start_size=u_start, min_size=30, max_lines=3
            )

        # ------------------------------------------------------------------
        # Subtitle sizing
        # ------------------------------------------------------------------
        sub_font, sub_lines, sub_w, sub_h = None, [], 0, 0
        if subtitle:
            sub_fn = lambda sz: self.fonts.english_font(sz, "normal")
            sub_max_h = 140
            sub_font, sub_lines, sub_w, sub_h = _fit_wrapped_text(
                subtitle, max_text_w, sub_max_h, sub_fn, draw_ref,
                start_size=42, min_size=22, max_lines=3
            )

        # ------------------------------------------------------------------
        # Compute vertical positions
        # ------------------------------------------------------------------
        line_gap = 18
        inter_line = 8  # extra leading inside multi-line blocks
        block_h = title_h
        if urdu_h:
            block_h += line_gap + urdu_h
        if sub_h:
            block_h += line_gap + sub_h

        # Centre block vertically around the "golden" zone (≈ 42 % down)
        golden_y = int(COVER_H * 0.42)
        start_y = golden_y - block_h // 2

        # ------------------------------------------------------------------
        # Draw gradient bar behind text block
        # ------------------------------------------------------------------
        bar_pad_x = 40
        bar_pad_y = 30
        bar_w = max(title_w, urdu_w, sub_w) + bar_pad_x * 2
        bar_h = block_h + bar_pad_y * 2
        bar_x = center_x - bar_w // 2
        bar_y = start_y - bar_pad_y

        # keep bar inside safe margins
        bar_x = max(margin, min(bar_x, COVER_W - margin - bar_w))
        bar_w = min(bar_w, COVER_W - margin * 2)

        image = self._draw_gradient_bar(image, (bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), style)
        draw = ImageDraw.Draw(image)

        # ------------------------------------------------------------------
        # Render title lines with shadow / glow
        # ------------------------------------------------------------------
        title_y = start_y
        for line in title_lines:
            lw, lh = _text_size(draw, line, title_font)
            title_x = center_x - lw // 2
            image = self._draw_text_with_effects(
                image, line, (title_x, title_y), title_font,
                spec["title_color"], style
            )
            draw = ImageDraw.Draw(image)
            title_y += lh + inter_line
        current_y = title_y + line_gap - inter_line

        # ------------------------------------------------------------------
        # Render Urdu title lines (Nastaliq, RTL)
        # ------------------------------------------------------------------
        if urdu_font and urdu_lines:
            for line in urdu_lines:
                lw, lh = _text_size(draw, line, urdu_font)
                urdu_x = center_x - lw // 2
                # Urdu is RTL; PIL renders it LTR visually if the font supports
                # the Unicode range, which Noto Nastaliq Urdu does.
                image = self._draw_text_with_effects(
                    image, line, (urdu_x, current_y), urdu_font,
                    spec["title_color"], style
                )
                draw = ImageDraw.Draw(image)
                current_y += lh + inter_line
            current_y += line_gap - inter_line

        # ------------------------------------------------------------------
        # Render subtitle lines
        # ------------------------------------------------------------------
        if sub_font and sub_lines:
            for line in sub_lines:
                lw, lh = _text_size(draw, line, sub_font)
                sub_x = center_x - lw // 2
                image = self._draw_text_with_effects(
                    image, line, (sub_x, current_y), sub_font,
                    spec["subtitle_color"], style, is_subtitle=True
                )
                draw = ImageDraw.Draw(image)
                current_y += lh + inter_line

        return image

    # ------------------------------------------------------------------
    # Gradient Bar
    # ------------------------------------------------------------------

    def _draw_gradient_bar(self,
                           image: Image.Image,
                           bbox: Tuple[int, int, int, int],
                           style: dict) -> Image.Image:
        """
        Paste a semi-transparent gradient bar behind text.
        Supports rounded corners when ``bar_rounded`` is present.
        """
        x1, y1, x2, y2 = bbox
        w, h = x2 - x1, y2 - y1
        if w <= 0 or h <= 0:
            return image

        bar_col = style["bar_color"]
        opacity = style.get("bar_opacity", 0.70)
        rounded = style.get("bar_rounded", 0)

        # Build gradient if requested
        if style.get("bar_gradient", False):
            # Slightly lighter version at top for depth
            lighter = tuple(min(255, int(c * 1.15)) for c in bar_col)
            grad = _create_gradient((w, h), lighter, bar_col, "vertical")
        else:
            grad = Image.new("RGB", (w, h), bar_col)

        # Convert to RGBA with opacity
        alpha = int(255 * opacity)
        grad_rgba = grad.convert("RGBA")
        # make a mask from the alpha channel
        a = grad_rgba.split()[-1]
        a = a.point(lambda p: int(p * (alpha / 255)))
        grad_rgba.putalpha(a)

        # rounded mask
        if rounded:
            mask = Image.new("L", (w, h), 0)
            md = ImageDraw.Draw(mask)
            _draw_rounded_rect(md, (0, 0, w, h), radius=rounded, fill=255)
            # composite the gradient through the rounded mask
            bar_rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            bar_rgba.paste(grad_rgba, (0, 0), mask)
            grad_rgba = bar_rgba
        else:
            # ensure we still have an alpha for the final paste
            pass

        # composite onto main image
        canvas = image.convert("RGBA")
        canvas.paste(grad_rgba, (x1, y1), grad_rgba)
        return canvas.convert("RGB")

    # ------------------------------------------------------------------
    # Text Effects (shadow + glow)
    # ------------------------------------------------------------------

    def _draw_text_with_effects(self,
                                image: Image.Image,
                                text: str,
                                pos: Tuple[int, int],
                                font: ImageFont.FreeTypeFont,
                                color: Tuple[int, int, int],
                                style: dict,
                                is_subtitle: bool = False) -> Image.Image:
        """
        Render text with optional multi-layer shadow and glow.
        Works on an RGB canvas by creating a temporary RGBA layer.
        """
        x, y = pos
        draw = ImageDraw.Draw(image)
        tw, th = _text_size(draw, text, font)

        # expand canvas for glow radius
        glow_r = style.get("glow_radius", 0)
        pad = glow_r + 10
        layer_w, layer_h = tw + pad * 2, th + pad * 2
        layer = Image.new("RGBA", (layer_w, layer_h), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)

        # ---- shadow layers ----
        shadow_type = style.get("shadow_type", "drop")
        sx, sy = style.get("shadow_offset", (3, 3))
        sc = style.get("shadow_color", (0, 0, 0))
        sr = style.get("shadow_radius", 5)

        if shadow_type == "hard":
            ld.text((pad + sx, pad + sy), text, font=font, fill=(*sc, 200))
        elif shadow_type == "soft":
            for i in range(3):
                off = sx + i, sy + i
                ld.text((pad + off[0], pad + off[1]), text, font=font,
                        fill=(*sc, 80 - i * 15))
        elif shadow_type == "drop":
            # multi-step blur shadow
            for i in range(4, 0, -1):
                alpha = int(120 / i)
                ld.text((pad + sx + i, pad + sy + i), text, font=font,
                        fill=(*sc, alpha))

        # ---- glow layer ----
        glow_color = style.get("glow_color")
        if glow_color and glow_r > 0 and not is_subtitle:
            glow_layer = Image.new("RGBA", (layer_w, layer_h), (0, 0, 0, 0))
            gd = ImageDraw.Draw(glow_layer)
            gd.text((pad, pad), text, font=font, fill=(*glow_color, 180))
            # blur for glow effect
            glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=glow_r))
            layer = Image.alpha_composite(layer, glow_layer)

        # ---- main text ----
        ld = ImageDraw.Draw(layer)
        ld.text((pad, pad), text, font=font, fill=(*color, 255))

        # ---- paste onto canvas ----
        canvas = image.convert("RGBA")
        canvas.paste(layer, (x - pad, y - pad), layer)
        return canvas.convert("RGB")

    def _add_category_badge(self,
                            image: Image.Image,
                            category: str) -> Image.Image:
        """
        Alias for ``_add_category_frame``.
        Adds category-specific decorative elements (frames, borders, motifs).
        """
        style = cfg.get_category_style(category)
        return self._add_category_frame(image, category, style)

    # ------------------------------------------------------------------
    # Category Frame / Badge
    # ------------------------------------------------------------------

    def _add_category_frame(self,
                            image: Image.Image,
                            category: str,
                            style: dict) -> Image.Image:
        """
        Add decorative frame elements based on category style.
        Includes corner motifs, border lines, or geometric patterns.
        """
        frame_style = style.get("frame_style", "minimal")
        frame_color = style.get("frame_color", (200, 200, 200))
        frame_opacity = style.get("frame_opacity", 0.25)
        canvas = image.convert("RGBA")
        draw = ImageDraw.Draw(canvas)
        m = SAFE_MARGIN

        if frame_style == "geometric":
            # Gold geometric corner brackets
            arm = 60
            thick = 4
            col = (*frame_color, int(255 * frame_opacity))
            corners = [
                (m, m), (COVER_W - m, m),
                (m, COVER_H - m), (COVER_W - m, COVER_H - m)
            ]
            for cx, cy in corners:
                # horizontal arm
                hx = cx - arm if cx < COVER_W // 2 else cx
                hy = cy
                draw.line([(hx, hy), (hx + arm, hy)], fill=col, width=thick)
                # vertical arm
                vx = cx
                vy = cy - arm if cy < COVER_H // 2 else cy
                draw.line([(vx, vy), (vx, vy + arm)], fill=col, width=thick)

        elif frame_style == "ornate":
            # Double-line border with corner flourishes
            col = (*frame_color, int(255 * frame_opacity))
            inset = 24
            draw.rectangle(
                [(m + inset, m + inset), (COVER_W - m - inset, COVER_H - m - inset)],
                outline=col, width=3
            )
            draw.rectangle(
                [(m + inset + 8, m + inset + 8),
                 (COVER_W - m - inset - 8, COVER_H - m - inset - 8)],
                outline=col, width=1
            )

        elif frame_style == "rounded":
            # Soft rounded rectangle border
            col = (*frame_color, int(255 * frame_opacity))
            inset = 30
            _draw_rounded_rect(
                draw,
                (m + inset, m + inset, COVER_W - m - inset, COVER_H - m - inset),
                radius=40, outline=col, width=3
            )

        elif frame_style == "minimal":
            # Thin top + bottom accent lines
            col = (*frame_color, int(255 * frame_opacity))
            draw.line([(m, m), (COVER_W - m, m)], fill=col, width=2)
            draw.line([(m, COVER_H - m), (COVER_W - m, COVER_H - m)], fill=col, width=2)

        elif frame_style in ("ethereal", "neon"):
            # Soft glowing border
            col = (*frame_color, int(255 * frame_opacity))
            inset = 20
            draw.rectangle(
                [(m + inset, m + inset), (COVER_W - m - inset, COVER_H - m - inset)],
                outline=col, width=2
            )

        elif frame_style == "desert_silhouette":
            # Dune-like curves at bottom
            col = (*frame_color, int(255 * frame_opacity * 0.6))
            points = []
            for i in range(0, COVER_W + 1, 40):
                y = COVER_H - m - 40 - int(30 * (1 + (i % 120) / 120))
                points.append((i, y))
            points += [(COVER_W, COVER_H - m), (0, COVER_H - m)]
            if len(points) >= 3:
                draw.polygon(points, fill=col)

        else:
            # Default thin border
            col = (*frame_color, int(255 * frame_opacity))
            inset = 20
            draw.rectangle(
                [(m + inset, m + inset), (COVER_W - m - inset, COVER_H - m - inset)],
                outline=col, width=2
            )

        return canvas.convert("RGB")

    # ------------------------------------------------------------------
    # Price Badge
    # ------------------------------------------------------------------

    def _add_price_badge(self,
                         image: Image.Image,
                         price: str,
                         style: dict) -> Image.Image:
        """
        Add a price badge in the bottom-right corner.
        Badge uses accent colour with a dark shadow for pop.
        """
        canvas = image.convert("RGBA")
        draw = ImageDraw.Draw(canvas)

        accent = style.get("accent_color", (200, 200, 200))
        text_col = (255, 255, 255)
        # dark border colour
        border = (30, 30, 30)

        # font size fixed for badge consistency
        try:
            badge_font = self.fonts.english_font(34, "bold")
        except Exception:
            badge_font = self.fonts.english_font(34, "normal")

        tw, th = _text_size(draw, price, badge_font)
        pad_x, pad_y = 20, 14
        badge_w = tw + pad_x * 2
        badge_h = th + pad_y * 2

        bx = COVER_W - SAFE_MARGIN - badge_w
        by = COVER_H - SAFE_MARGIN - badge_h - 10  # above brand

        # shadow
        for i in range(1, 5):
            draw.rounded_rectangle(
                (bx + i, by + i, bx + badge_w + i, by + badge_h + i),
                radius=10, fill=(*border, 60)
            )
        # badge body
        draw.rounded_rectangle(
            (bx, by, bx + badge_w, by + badge_h),
            radius=10, fill=(*accent, 230)
        )
        # text
        draw.text((bx + pad_x, by + pad_y), price, font=badge_font, fill=text_col)

        return canvas.convert("RGB")

    # ------------------------------------------------------------------
    # QuickFare Brand
    # ------------------------------------------------------------------

    def _add_quickfare_brand(self,
                             image: Image.Image,
                             category: str) -> Image.Image:
        """
        Subtle QuickFare logo text at bottom-center, small and semi-transparent.
        """
        canvas = image.convert("RGBA")
        draw = ImageDraw.Draw(canvas)

        brand = cfg.GLOBAL["brand_text"]
        size = cfg.GLOBAL["brand_font_size"]
        col = (*cfg.GLOBAL["brand_color"], cfg.GLOBAL["brand_opacity"])

        try:
            font = self.fonts.english_font(size, "normal")
        except Exception:
            font = self.fonts.english_font(size, "bold")

        tw, th = _text_size(draw, brand, font)
        x = (COVER_W - tw) // 2
        y = COVER_H - 36  # safe padding from bottom edge

        draw.text((x, y), brand, font=font, fill=col)
        return canvas.convert("RGB")

    # ------------------------------------------------------------------
    # Quality Validation
    # ------------------------------------------------------------------

    def _validate_output(self, image: Image.Image, spec: dict) -> dict:
        """
        Check that text areas have sufficient contrast.
        Returns a dict of metrics for logging / CI gating.
        """
        style = spec["style"]
        dom = spec["dominant_bg"]
        metrics = {
            "title_contrast": _contrast(spec["title_color"], dom),
            "subtitle_contrast": _contrast(spec["subtitle_color"], dom),
            "dominant_bg": dom,
            "brightness": spec["brightness"],
        }
        # warn if below threshold
        min_c = cfg.GLOBAL["min_contrast"]
        for k, v in metrics.items():
            if k.endswith("_contrast") and v < min_c:
                print(f"[WARN] {k} = {v:.2f} (below {min_c})")
        return metrics


# ──────────────────────────────────────────────────────────────────────────────
# Batch helper
# ──────────────────────────────────────────────────────────────────────────────

def batch_generate(engine: CoverEngine,
                   books: List[dict],
                   output_dir: str = "/mnt/agents/output/covers") -> List[str]:
    """
    Process a list of book dicts.

    Each dict must contain at least ``background_path`` and ``title``.
    Optional keys: subtitle, category, language, urdu_title, price, output_name.
    """
    os.makedirs(output_dir, exist_ok=True)
    paths = []
    for i, book in enumerate(books, 1):
        bg = book["background_path"]
        title = book["title"]
        out_name = book.get("output_name", f"cover_{i:04d}.jpg")
        out_path = os.path.join(output_dir, out_name)
        try:
            p = engine.generate_cover(
                background_path=bg,
                title=title,
                subtitle=book.get("subtitle", ""),
                category=book.get("category", "Islamic"),
                output_path=out_path,
                language=book.get("language", "english"),
                urdu_title=book.get("urdu_title", ""),
                price=book.get("price", ""),
                quality=book.get("quality", 95),
            )
            paths.append(p)
            print(f"[batch] {i}/{len(books)} -> {p}")
        except Exception as exc:
            print(f"[ERROR] Book {i} ({title}): {exc}")
            paths.append(None)
    return paths


# ──────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="QuickFare Cover Engine CLI")
    parser.add_argument("--bg", required=True, help="Background image path")
    parser.add_argument("--title", required=True, help="Book title")
    parser.add_argument("--subtitle", default="", help="Subtitle")
    parser.add_argument("--category", default="Islamic", help="Category name")
    parser.add_argument("--out", default="cover_output.jpg", help="Output path")
    parser.add_argument("--lang", default="english", choices=["english", "urdu", "bilingual"])
    parser.add_argument("--urdu", default="", help="Urdu title")
    parser.add_argument("--price", default="", help="Price string e.g. '₨ 450'")
    parser.add_argument("--quality", type=int, default=95)
    args = parser.parse_args()

    engine = CoverEngine()
    result = engine.generate_cover(
        background_path=args.bg,
        title=args.title,
        subtitle=args.subtitle,
        category=args.category,
        output_path=args.out,
        language=args.lang,
        urdu_title=args.urdu,
        price=args.price,
        quality=args.quality,
    )
    print(f"[done] Cover saved to: {result}")
