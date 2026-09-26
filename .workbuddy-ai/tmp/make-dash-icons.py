"""Generate dashboard favicons / PWA icons from public/images/logo.png.

The shipped logo is a small RGBA wordmark (60x46), which is unusable as a
favicon on its own — a browser tab needs a square mark. We scale it up with
LANCZOS and centre it on a rounded brand plate so it reads at 16px and still
looks deliberate at 512px.
"""
import os
from PIL import Image, ImageDraw

ROOT = r"C:\Users\Admin\Desktop\extremis\updatesdashbaord"
SRC = os.path.join(ROOT, "public", "images", "logo.png")
ICON_DIR = os.path.join(ROOT, "public", "icons")
os.makedirs(ICON_DIR, exist_ok=True)

BRAND = (3, 105, 161)       # #0369a1
BRAND_DARK = (7, 89, 133)   # #075985

logo = Image.open(SRC).convert("RGBA")


def rounded_mask(size, radius_ratio):
    scale = 4
    mask = Image.new("L", (size * scale, size * scale), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size * scale - 1, size * scale - 1),
        radius=int(size * scale * radius_ratio),
        fill=255,
    )
    return mask.resize((size, size), Image.LANCZOS)


def emit(size, path, plate=True, logo_width_ratio=0.62, radius_ratio=0.22, pad=0):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    if plate:
        plate_img = Image.new("RGBA", (size, size), BRAND_DARK + (255,))
        # Vertical brand gradient.
        grad = Image.new("RGB", (size, size))
        gd = ImageDraw.Draw(grad)
        for y in range(size):
            t = y / max(size - 1, 1)
            gd.line(
                [(0, y), (size, y)],
                fill=(
                    int(BRAND[0] + (BRAND_DARK[0] - BRAND[0]) * t),
                    int(BRAND[1] + (BRAND_DARK[1] - BRAND[1]) * t),
                    int(BRAND[2] + (BRAND_DARK[2] - BRAND[2]) * t),
                ),
            )
        plate_img = grad.convert("RGBA")
        plate_img.putalpha(rounded_mask(size, radius_ratio))
        canvas = plate_img

    # Scale the wordmark to the requested share of the icon width.
    target_w = int(size * logo_width_ratio)
    target_h = max(1, int(logo.height * (target_w / logo.width)))
    if target_h > int(size * 0.6):
        target_h = int(size * 0.6)
        target_w = max(1, int(logo.width * (target_h / logo.height)))
    art = logo.resize((target_w, target_h), Image.LANCZOS)
    canvas.paste(art, ((size - target_w) // 2, (size - target_h) // 2), art)

    if pad:
        canvas = canvas.crop((0, 0, size - pad, size - pad))

    canvas.save(path, "PNG", optimize=True)
    print("wrote", os.path.relpath(path, ROOT), canvas.size,
          f"{os.path.getsize(path) / 1024:.1f}KB")


emit(32, os.path.join(ICON_DIR, "favicon-32.png"), logo_width_ratio=0.68, radius_ratio=0.18)
emit(16, os.path.join(ICON_DIR, "favicon-16.png"), logo_width_ratio=0.72, radius_ratio=0.18)
emit(192, os.path.join(ICON_DIR, "icon-192.png"))
emit(512, os.path.join(ICON_DIR, "icon-512.png"))
emit(180, os.path.join(ICON_DIR, "apple-touch-icon.png"), radius_ratio=0.0)
# Android may mask to a circle — keep the mark inside the 80% safe zone.
emit(512, os.path.join(ICON_DIR, "icon-maskable-512.png"), logo_width_ratio=0.50)
