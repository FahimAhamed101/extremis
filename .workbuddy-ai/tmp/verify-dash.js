/**
 * Mobile-responsiveness verification for the updatesdashbaord app.
 *
 * Runs a real Chromium at 390x844 (iPhone 14 class) and asserts the things that
 * actually break the dashboard on a phone: sideways scroll, sub-40px buttons,
 * sub-12px body copy, sub-16px inputs (iOS zooms the page on focus), the
 * off-canvas sidebar leaking into the viewport, and tables escaping their box.
 */
const { chromium } = require("playwright-core");

const BASE = process.env.BASE || "http://localhost:3100";
const EXEC =
  process.env.CHROME_PATH ||
  "C:/Users/Admin/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";

const CHECK = `(() => {
  const out = { url: location.pathname, checks: [] };
  const add = (name, pass, detail) => out.checks.push({ name, pass, detail });

  const vw = document.documentElement.clientWidth;

  add('no horizontal scroll', document.documentElement.scrollWidth <= vw + 1,
      'scrollWidth=' + document.documentElement.scrollWidth + ' vw=' + vw);

  // Off-canvas sidebar must not be parked inside the viewport.
  const sb = document.querySelector('nav.sidebar');
  if (sb) {
    const r = sb.getBoundingClientRect();
    const hidden = r.right <= 2 || r.left >= vw - 2 || getComputedStyle(sb).display === 'none';
    add('sidebar is off-canvas or hidden', hidden,
        'left=' + Math.round(r.left) + ' right=' + Math.round(r.right) + ' vw=' + vw);
  }

  // The compact header must be the one visible on a phone.
  const rh = document.querySelector('.responsive-header');
  if (rh) {
    const cs = getComputedStyle(rh);
    add('compact header is visible', cs.display !== 'none',
        'display=' + cs.display);
    const r = rh.getBoundingClientRect();
    add('compact header fits viewport', r.width <= vw + 1,
        'width=' + Math.round(r.width) + ' vw=' + vw);
  }

  // Panel content must not be pushed off the right edge.
  const pc = document.querySelector('.panel-content');
  if (pc) {
    const r = pc.getBoundingClientRect();
    add('panel content fits viewport', r.right <= vw + 1 && r.left >= -1,
        'left=' + Math.round(r.left) + ' right=' + Math.round(r.right) + ' vw=' + vw);
  }

  // Tables: they are wider than a phone, so they must scroll inside their own box.
  const wide = Array.from(document.querySelectorAll('table'))
    .filter(t => t.offsetParent !== null && t.scrollWidth > t.clientWidth + 1);
  const trapped = wide.filter(t => {
    const cs = getComputedStyle(t);
    return !(cs.overflowX === 'auto' || cs.overflowX === 'scroll' || t.closest('.table-responsive'));
  });
  add('wide tables scroll inside their box', trapped.length === 0,
      trapped.length + '/' + wide.length + ' tables overflow with no scroll container');

  // Tap targets: buttons only (inline text links are exempt per WCAG 2.5.8).
  // Skip anything inside a transform — a closed dropdown is scaled down and
  // getBoundingClientRect then reports a misleadingly tiny box.
  const inTransformed = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const t = getComputedStyle(p).transform;
      if (t && t !== 'none') return true;
      p = p.parentElement;
    }
    return false;
  };
  const btns = Array.from(document.querySelectorAll('button, [role="button"], input[type=submit]'))
    .filter(el => el.offsetParent !== null && !inTransformed(el));
  const small = btns.filter(b => b.getBoundingClientRect().height < 40);
  add('buttons >= 40px tall', small.length === 0,
      small.length + '/' + btns.length + ' too small' +
      (small[0] ? ' e.g. ' + small[0].className.toString().slice(0, 40) : ''));

  // Body copy >= 12px
  const tiny = Array.from(document.querySelectorAll('p, li, td, .desc'))
    .filter(el => el.offsetParent !== null && (el.innerText || '').trim().length > 20)
    .filter(el => parseFloat(getComputedStyle(el).fontSize) < 12);
  add('body copy >= 12px', tiny.length === 0, tiny.length + ' elements below 12px');

  // Inputs >= 16px (prevents iOS zoom-on-focus)
  const inputs = Array.from(document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea, select'))
    .filter(el => el.offsetParent !== null);
  const smallInputs = inputs.filter(el => parseFloat(getComputedStyle(el).fontSize) < 16);
  add('inputs >= 16px (no iOS zoom)', smallInputs.length === 0,
      smallInputs.length + '/' + inputs.length + ' too small');

  // Expensive effects off
  const bf = getComputedStyle(document.body).backdropFilter;
  add('backdrop-filter disabled on mobile', !bf || bf === 'none', 'backdropFilter=' + bf);

  return out;
})()`;

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const routes = (
    process.env.ROUTES ||
    "/,/analytics,/advertisements,/blog,/events,/messages,/products,/profile,/reviews,/team,/login"
  ).split(",");
  let failures = 0;

  for (const route of routes) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(3000);
      const res = await page.evaluate(CHECK);
      console.log("\n=== " + route + " ===");
      for (const c of res.checks) {
        if (!c.pass) failures++;
        console.log("  " + (c.pass ? "PASS" : "FAIL") + "  " + c.name + "  (" + c.detail + ")");
      }
    } catch (e) {
      console.log("\n=== " + route + " === ERROR " + String(e.message).slice(0, 90));
      failures++;
    }
    await ctx.close();
  }

  await browser.close();
  console.log("\n" + (failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"));
})();
