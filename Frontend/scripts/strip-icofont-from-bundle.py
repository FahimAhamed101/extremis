"""Remove the bundled IcoFont payload from the legacy main.min.css.

main.min.css ships the complete 2095-glyph IcoFont: an @font-face pointing at a
525KB woff2 plus every glyph rule. The app uses ~154 of those glyphs, which are
now served from the generated icofont-subset.css. Dropping the original block
stops browsers downloading the 525KB font and trims the stylesheet.

The original is backed up to main.min.css.bak once; re-running is a no-op.
"""
import os
import re
import shutil

ROOT = r"C:\Users\Admin\Desktop\extremis\Frontend"
TARGET = os.path.join(ROOT, "public", "css", "main.min.css")
BACKUP = TARGET + ".bak"

if not os.path.exists(BACKUP):
    shutil.copy2(TARGET, BACKUP)
    print("backed up ->", os.path.relpath(BACKUP, ROOT))
else:
    print("backup already exists, working from it")
    shutil.copy2(BACKUP, TARGET)

css = open(TARGET, encoding="utf-8", errors="ignore").read()
before = len(css)

# 1. the @font-face that pulls in the 525KB font
face = re.search(r"@font-face\s*\{[^}]*?IcoFont[^}]*?\}", css)
if face:
    css = css[: face.start()] + css[face.end():]
    print("removed IcoFont @font-face")
else:
    print("WARNING: IcoFont @font-face not found")

# 2. every .icofont-*:before glyph rule
css, n_rules = re.subn(
    r"\.icofont-[a-z0-9-]+:before\{content:\"[^\"]*\"\}", "", css
)
print(f"removed {n_rules} glyph rules")

# 3. the shared [class^="icofont-"] base rule, if present
css, n_base = re.subn(
    r"\[class\^=\"icofont-\"\],\[class\*=\" icofont-\"\]\{[^}]*\}", "", css
)
print(f"removed {n_base} base selector rule(s)")

open(TARGET, "w", encoding="utf-8").write(css)
after = len(css)
print(f"main.min.css: {before/1024:.0f}KB -> {after/1024:.0f}KB "
      f"({(before-after)/1024:.0f}KB removed)")
