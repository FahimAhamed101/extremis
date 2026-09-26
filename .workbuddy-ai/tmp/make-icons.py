"""Generate PWA icons + a social share image for the Updates frontend.

The shipped "logo.png" is really a 1024x1024 JPEG: a 3D render of the app icon
sitting on a wooden desk. We detect the blue mark, crop away the photo
background, and re-emit crisp square icons plus a 1200x630 OG card.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

ROOT = r"C:\Users\Admin\Desktop\extremis\Frontend"
SRC = os.path.join(ROOT, "public", "images", "logo.png")
ICON_DIR = os.path.join(ROOT, "public", "icons")
os.makedirs(ICON_DIR, exist_ok=True)

BRAND = (3, 105, 161)        # #0369a1
BRAND_LIGHT = (2, 132, 199)  # #0284c7
BRAND_DARK = (7, 89, 133)    # #075985

src = Image.open(SRC).convert("RGB")


def is_blue(px, tol=52):
    r, g, b = px
    return b > 120 and b - r > tol and b - g > tol * 0.35


# --- locate the blue mark -------------------------------------------------
w, h = src.size
minx, miny, maxx, maxy = w, h, 0, 0
step = 2
for y in range(0, h, step):
    for x in range(0, w, step):
        if is_blue(src.getpixel((x, y))):
            if x < minx: minx = x
            if y < miny: miny = y
            if x > maxx: maxx = x
            if y > maxy: maxy = y

if maxx <= minx:
    # Fallback: the mark is roughly centred in the render.
    minx, miny, maxx, maxy = int(w * 0.14), int(h * 0.12), int(w * 0.86), int(h * 0.88)

print(f"blue mark bbox: ({minx},{miny})-({maxx},{maxy})  size={maxx-minx}x{maxy-miny}")

# Square it off around the mark centre.
cx, cy = (minx + maxx) // 2, (miny + maxy) // 2
half = int(max(maxx - minx, maxy - miny) / 2 * 1.06)
half = min(half, cx, cy, w - cx, h - cy)
box = (cx - half, cy - half, cx + half, cy + half)
mark = src.crop(box)
print("cropped mark:", mark.size)


def rounded(img, radius_ratio=0.22):
    """Apply a rounded-square alpha mask."""
    size = img.size[0]
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size * 4 - 1, size * 4 - 1), radius=int(size * 4 * radius_ratio), fill=255
    )
    mask = mask.resize((size, size), Image.LANCZOS)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def emit_icon(size, path, pad_ratio=0.0, bg=None, radius_ratio=0.22):
    """Render the mark at `size`, optionally inset on a solid/gradient plate."""
    inner = int(size * (1 - pad_ratio * 2))
    art = mark.resize((inner, inner), Image.LANCZOS)

    if bg is None:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        art = rounded(art, radius_ratio)
    else:
        canvas = Image.new("RGBA", (size, size), bg + (255,))
        art = rounded(art, radius_ratio)
    canvas.paste(art, ((size - inner) // 2, (size - inner) // 2), art)
    canvas.save(path, "PNG", optimize=True)
    print("wrote", os.path.relpath(path, ROOT), canvas.size, f"{os.path.getsize(path)/1024:.1f}KB")


# Standard icons: crop tight, no plate.
emit_icon(192, os.path.join(ICON_DIR, "icon-192.png"), 0.0)
emit_icon(512, os.path.join(ICON_DIR, "icon-512.png"), 0.0)

# Maskable: Android may crop to a circle, so keep the art inside the 80% safe zone.
emit_icon(512, os.path.join(ICON_DIR, "icon-maskable-512.png"), 0.14, bg=BRAND_DARK)

# iOS home-screen icon (iOS applies its own mask, so keep it edge-to-edge).
emit_icon(180, os.path.join(ICON_DIR, "apple-touch-icon.png"), 0.0)

# Favicons.
emit_icon(32, os.path.join(ROOT, "public", "images", "favicon-32.png"), 0.0)
emit_icon(16, os.path.join(ROOT, "public", "images", "favicon-16.png"), 0.0)


# --- 1200x630 Open Graph card --------------------------------------------
def font(size, bold=True):
    for name in (("segoeuib.ttf" if bold else "segoeui.ttf"), "arialbd.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


OW, OH = 1200, 630
og = Image.new("RGB", (OW, OH), BRAND_DARK)

# Diagonal brand gradient.
grad = Image.new("RGB", (OW, OH))
gd = ImageDraw.Draw(grad)
for y in range(OH):
    for_x = y / OH
    r = int(BRAND_DARK[0] + (BRAND_LIGHT[0] - BRAND_DARK[0]) * for_x)
    g = int(BRAND_DARK[1] + (BRAND_LIGHT[1] - BRAND_DARK[1]) * for_x)
    b = int(BRAND_DARK[2] + (BRAND_LIGHT[2] - BRAND_DARK[2]) * for_x)
    gd.line([(0, y), (OW, y)], fill=(r, g, b))
og.paste(grad, (0, 0))

d = ImageDraw.Draw(og, "RGBA")
# Soft highlight blobs for depth.
d.ellipse((-160, -220, 520, 420), fill=(255, 255, 255, 22))
d.ellipse((820, 300, 1420, 900), fill=(255, 255, 255, 16))

# App icon on the left.
plate = 250
icon = mark.resize((plate, plate), Image.LANCZOS)
icon = rounded(icon, 0.22)
shadow = Image.new("RGBA", (OW, OH), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle(
    (96 + 6, 190 + 10, 96 + plate + 6, 190 + plate + 10), radius=56, fill=(0, 0, 0, 90)
)
shadow = shadow.filter(ImageFilter.GaussianBlur(18))
og.paste(Image.alpha_composite(og.convert("RGBA"), shadow).convert("RGB"), (0, 0))
og.paste(icon, (96, 190), icon)

# Wordmark + tagline.
d = ImageDraw.Draw(og, "RGBA")
d.text((400, 214), "Updates", font=font(104), fill=(255, 255, 255, 255))
d.text((404, 336), "The Social Media Network", font=font(44, bold=False), fill=(224, 242, 254, 255))
d.text((404, 396), "Connect with friends & family", font=font(34, bold=False), fill=(186, 230, 253, 235))

og.save(os.path.join(ROOT, "public", "images", "og-image.png"), "PNG", optimize=True)
print("wrote public/images/og-image.png", og.size,
      f"{os.path.getsize(os.path.join(ROOT,'public','images','og-image.png'))/1024:.1f}KB")
