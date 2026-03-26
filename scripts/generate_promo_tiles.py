from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "store" / "chrome" / "assets"
SCREENSHOTS = ASSETS / "screenshots"
EXT = ROOT / "x_bookmark_summarizer"


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]

    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue

    return ImageFont.load_default()


FONT_TITLE_SMALL = load_font(29, bold=True)
FONT_SUB_SMALL = load_font(17)
FONT_TITLE_LARGE = load_font(78, bold=True)
FONT_SUB_LARGE = load_font(28)
FONT_BADGE = load_font(18, bold=True)
FONT_CAPTION = load_font(18)


def create_background(width: int, height: int) -> Image.Image:
    image = Image.new("RGBA", (width, height), "#0b1017")
    draw = ImageDraw.Draw(image)

    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(11 + (20 - 11) * t)
        g = int(16 + (27 - 16) * t)
        b = int(23 + (41 - 23) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    draw.ellipse((-width * 0.15, -height * 0.25, width * 0.45, height * 0.55), fill=(35, 90, 170, 90))
    draw.ellipse((width * 0.55, -height * 0.1, width * 1.15, height * 0.65), fill=(57, 165, 219, 72))
    draw.ellipse((width * 0.2, height * 0.55, width * 0.9, height * 1.25), fill=(10, 39, 79, 110))

    grid = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid)
    step = max(24, width // 24)
    for x in range(0, width, step):
        grid_draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 12))
    for y in range(0, height, step):
        grid_draw.line([(0, y), (width, y)], fill=(255, 255, 255, 10))
    return Image.alpha_composite(image, grid)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def fit_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    src_w, src_h = image.size
    dst_w, dst_h = size
    src_ratio = src_w / src_h
    dst_ratio = dst_w / dst_h

    if src_ratio > dst_ratio:
        new_h = dst_h
        new_w = int(dst_h * src_ratio)
    else:
        new_w = dst_w
        new_h = int(dst_w / src_ratio)

    resized = image.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - dst_w) // 2
    top = (new_h - dst_h) // 2
    return resized.crop((left, top, left + dst_w, top + dst_h))


def paste_card(canvas: Image.Image, image: Image.Image, box: tuple[int, int, int, int], radius: int = 20):
    x, y, w, h = box
    content = fit_cover(image.convert("RGBA"), (w, h))
    shadow = Image.new("RGBA", (w + 28, h + 28), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((14, 14, w + 14, h + 14), radius=radius + 6, fill=(0, 0, 0, 140))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(shadow, (x - 14, y - 10))

    frame = Image.new("RGBA", (w, h), (255, 255, 255, 26))
    ImageDraw.Draw(frame).rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, outline=(255, 255, 255, 76), width=2)

    mask = rounded_mask((w, h), radius)
    card = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    card.paste(content, (0, 0))
    card = Image.composite(card, Image.new("RGBA", (w, h), (0, 0, 0, 0)), mask)
    card.alpha_composite(frame)
    canvas.alpha_composite(card, (x, y))


def draw_badge(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str):
    x, y = xy
    bbox = draw.textbbox((0, 0), text, font=FONT_BADGE)
    width = bbox[2] - bbox[0] + 26
    height = bbox[3] - bbox[1] + 14
    draw.rounded_rectangle((x, y, x + width, y + height), radius=999, fill=(17, 34, 66, 212), outline=(123, 180, 255, 120))
    draw.text((x + 13, y + 7), text, font=FONT_BADGE, fill=(232, 241, 255, 255))
    return width


def generate_small():
    canvas = create_background(440, 280)
    draw = ImageDraw.Draw(canvas)
    icon = Image.open(EXT / "icon128.png").convert("RGBA").resize((50, 50), Image.LANCZOS)
    canvas.alpha_composite(icon, (26, 28))

    draw.text((82, 32), "X Bookmark\nSummarizer", font=FONT_TITLE_SMALL, fill=(248, 251, 255, 255), spacing=0)
    draw.text((28, 122), "Summarize saved bookmarks\nwith your own OpenAI key.", font=FONT_SUB_SMALL, fill=(214, 224, 240, 235), spacing=4)
    first_badge = draw_badge(draw, (28, 205), "Chrome")
    draw_badge(draw, (40 + first_badge, 205), "OpenAI")

    popup = Image.open(SCREENSHOTS / "screenshot-01-popup.png")
    paste_card(canvas, popup, (318, 24, 96, 228), radius=18)

    output = ASSETS / "promo-small-440x280.png"
    canvas.convert("RGB").save(output, "PNG")


def generate_marquee():
    canvas = create_background(1400, 560)
    draw = ImageDraw.Draw(canvas)
    icon = Image.open(EXT / "icon128.png").convert("RGBA").resize((88, 88), Image.LANCZOS)
    canvas.alpha_composite(icon, (74, 70))

    draw.text((182, 70), "X Bookmark\nSummarizer", font=FONT_TITLE_LARGE, fill=(248, 251, 255, 255), spacing=4)
    draw.text(
        (78, 268),
        "Collect bookmarked posts from your X bookmarks page and\nturn them into a structured summary with your own OpenAI API key.",
        font=FONT_SUB_LARGE,
        fill=(220, 228, 241, 238),
        spacing=8,
    )

    badge1 = draw_badge(draw, (80, 382), "Bookmarks Page Only")
    badge2 = draw_badge(draw, (96 + badge1, 382), "Local Settings")
    draw_badge(draw, (112 + badge1 + badge2, 382), "User-Initiated OpenAI Call")

    draw.text((82, 452), "Review saved posts, capture links, and export the collected bookmark set as JSON.", font=FONT_CAPTION, fill=(198, 209, 226, 224))

    popup = Image.open(SCREENSHOTS / "screenshot-01-popup.png")
    settings = Image.open(SCREENSHOTS / "screenshot-02-settings.png")
    summary = Image.open(SCREENSHOTS / "screenshot-03-summary.png")

    paste_card(canvas, summary, (850, 58, 470, 300), radius=24)
    paste_card(canvas, popup, (742, 230, 250, 250), radius=22)
    paste_card(canvas, settings, (1036, 318, 248, 170), radius=20)

    output = ASSETS / "marquee-1400x560.png"
    canvas.convert("RGB").save(output, "PNG")


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    generate_small()
    generate_marquee()


if __name__ == "__main__":
    main()
