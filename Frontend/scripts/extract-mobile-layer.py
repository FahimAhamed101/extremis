"""Move the mobile layer out of globals.css into a standalone stylesheet.

globals.css is emitted by Next as `layout.css`, which is injected BEFORE the
legacy /css/*.css files in <head>. With equal specificity the legacy rules win,
so the mobile overrides were being ignored. Loading the layer from a plain
public/ stylesheet referenced last fixes the cascade order.

Idempotent: running twice leaves globals.css without the block and rewrites
public/css/mobile-app.css.
"""
import os
import re

ROOT = r"C:\Users\Admin\Desktop\extremis\Frontend"
GLOBALS = os.path.join(ROOT, "app", "globals.css")
OUT = os.path.join(ROOT, "public", "css", "mobile-app.css")

MARKER = "MOBILE APP EXPERIENCE LAYER"

src = open(GLOBALS, encoding="utf-8").read()

start = src.find(MARKER)
if start == -1:
    print("marker not found in globals.css — nothing to extract")
    raise SystemExit(0)

# Back up to the start of the comment banner that introduces the section.
banner = src.rfind("/* ====", 0, start)
if banner == -1:
    banner = start

block = src[banner:].rstrip()

header = """/* ==========================================================================
   MOBILE APP EXPERIENCE LAYER
   --------------------------------------------------------------------------
   Loaded LAST from app/layout.tsx, after the legacy /css/*.css files.

   Why a separate file: globals.css is emitted by Next as `layout.css` and is
   injected BEFORE the legacy stylesheets in <head>. Any rule of equal
   specificity in style.css therefore beat the mobile overrides and they were
   silently ignored. Loading this file last makes the cascade order correct.

   Everything here is mobile-only and scoped behind media queries, so the
   desktop layout is untouched.
   ========================================================================== */

"""

# Drop the old banner comment from the extracted block (we supply a new one).
block = re.sub(
    r"^/\* =+\s*\n\s*MOBILE APP EXPERIENCE LAYER\s*\n.*?\*/\s*",
    "",
    block,
    count=1,
    flags=re.S,
)

open(OUT, "w", encoding="utf-8").write(header + block.lstrip() + "\n")
print(f"wrote {os.path.relpath(OUT, ROOT)} ({len(header + block)} chars)")

open(GLOBALS, "w", encoding="utf-8").write(src[:banner].rstrip() + "\n")
print(f"globals.css trimmed: {len(src)} -> {len(src[:banner].rstrip()) + 1} chars")
