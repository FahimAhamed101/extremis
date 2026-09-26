/**
 * Mobile responsiveness audit for the Updates Next.js frontend.
 * Loads a set of routes at real phone viewports and reports:
 *   - horizontal overflow (the #1 mobile sin)
 *   - the specific elements causing it
 *   - tap targets that are too small
 *   - text that is too small to read
 *   - images that are not responsive
 */
const { chromium } = require("playwright-core");

const BASE = process.env.BASE || "http://localhost:3000";

const ROUTES = (process.env.ROUTES || [
  "/",
  "/login",
  "/signup",
  "/about",
  "/videos",
  "/products",
  "/courses",
  "/events",
  "/groups",
  "/books",
  "/blog",
  "/help",
  "/settings",
  "/messages",
  "/profile",
  "/nearby",
  "/live-stream",
  "/advertise",
  "/career",
  "/search",
].join(",")).split(",");

const VIEWPORTS = [
  { name: "iPhoneSE-375", width: 375, height: 667 },
  { name: "iPhone14-390", width: 390, height: 844 },
  { name: "Android-412", width: 412, height: 915 },
];

const AUDIT = `(() => {
  const vw = document.documentElement.clientWidth;
  const de = document.documentElement;
  const result = {
    viewport: vw,
    scrollWidth: de.scrollWidth,
    overflowX: de.scrollWidth - vw,
    offenders: [],
    smallTargets: [],
    smallText: [],
    nonResponsiveImages: [],
    longUnbrokenText: [],
  };

  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      s += '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.');
    }
    return s.slice(0, 110);
  };

  const isHidden = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return true;
    if (parseFloat(cs.opacity) === 0) return true;
    // Off-canvas drawers legitimately live outside the viewport.
    if (cs.position === 'fixed' || cs.position === 'absolute') {
      const t = cs.transform;
      if (t && t !== 'none') return true;
    }
    return false;
  };

  // Elements inside a horizontally scrollable container are fine.
  const inScrollable = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowX) && p.getBoundingClientRect().width <= vw + 1) return true;
      p = p.parentElement;
    }
    return false;
  };

  document.querySelectorAll('body *').forEach((el) => {
    if (isHidden(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;

    // Horizontal overflow
    const right = r.right, left = r.left;
    if ((right > vw + 2 || left < -2) && !inScrollable(el)) {
      const amount = Math.round(Math.max(right - vw, -left));
      if (amount > 2) {
        result.offenders.push({
          el: describe(el),
          amount,
          left: Math.round(left),
          right: Math.round(right),
          width: Math.round(r.width),
          pos: getComputedStyle(el).position,
        });
      }
    }

    // Tap targets (links/buttons only, visible text-bearing)
    const tag = el.tagName.toLowerCase();
    if ((tag === 'a' || tag === 'button') && (el.innerText || '').trim().length > 0) {
      if (r.width < 32 || r.height < 32) {
        result.smallTargets.push({ el: describe(el), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }

    // Text too small
    const txt = (el.childNodes && Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 3));
    if (txt) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 12) {
        result.smallText.push({ el: describe(el), fs });
      }
    }

    // Images without responsive sizing
    if (tag === 'img') {
      const cs = getComputedStyle(el);
      if (r.width > vw + 2 || (el.getAttribute('width') && parseInt(el.getAttribute('width'),10) > vw)) {
        result.nonResponsiveImages.push({ el: describe(el), w: Math.round(r.width) });
      }
      if (!el.hasAttribute('alt')) {
        result.nonResponsiveImages.push({ el: describe(el), w: Math.round(r.width), missingAlt: true });
      }
    }
  });

  // Deduplicate + sort by severity
  const dedupe = (arr, key) => {
    const seen = new Set();
    return arr.filter(x => { const k = x.el + key(x); if (seen.has(k)) return false; seen.add(k); return true; });
  };
  result.offenders = dedupe(result.offenders, x => x.amount).sort((a,b) => b.amount - a.amount).slice(0, 12);
  result.smallTargets = dedupe(result.smallTargets, x => x.w).slice(0, 10);
  result.smallText = dedupe(result.smallText, x => x.fs).slice(0, 10);
  result.nonResponsiveImages = dedupe(result.nonResponsiveImages, x => x.w + (x.missingAlt?'a':'')).slice(0, 10);

  return result;
})()`;

(async () => {
  // The bundled playwright-core expects a newer browser revision than the one
  // present in the ms-playwright cache, so pin the installed Chromium explicitly.
  const EXEC =
    process.env.CHROME_PATH ||
    "C:/Users/Admin/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";
  const browser = await chromium.launch({ executablePath: EXEC });
  const report = {};

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      const page = await ctx.newPage();
      const key = route + " @ " + vp.name;
      try {
        await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForTimeout(2200);
        const data = await page.evaluate(AUDIT);
        data.finalUrl = page.url();
        report[key] = data;
      } catch (e) {
        report[key] = { error: String(e.message).slice(0, 200) };
      }
      await ctx.close();
    }
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
