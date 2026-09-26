"""Crop + upscale regions of a device screenshot so small UI details are readable."""
import sys
from PIL import Image

src = sys.argv[1]
regions = sys.argv[2:]  # name:x1,y1,x2,y2

im = Image.open(src).convert("RGB")
print("source size:", im.size)

for spec in regions:
    name, box = spec.split(":")
    x1, y1, x2, y2 = (int(v) for v in box.split(","))
    crop = im.crop((x1, y1, x2, y2))
    crop = crop.resize((crop.width * 3, crop.height * 3), Image.NEAREST)
    out = src.replace(".png", f"_{name}.png")
    crop.save(out)
    print(f"{name}: {box} -> {out} {crop.size}")
