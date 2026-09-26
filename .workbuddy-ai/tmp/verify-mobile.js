/** Targeted verification of the mobile fixes (computed styles in a real browser). */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const TMP = __dirname;
const BASE = "http://localhost:3000";
const EXEC =
  process.env.CHROME_PATH ||
  "C:/Users/Admin/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";

const signup = JSON.parse(fs.readFileSync(path.join(TMP, "signup.json"), "utf8"));
const token = signup.token;
const user = JSON.stringify(signup.user);

const CHECK = `(() => {
  const out = { url: location.pathname, checks: [] };
  const add = (name, pass, detail) => out.checks.push({ name, pass, detail });

  const vw = document.documentElement.clientWidth;
  add('no horizontal scroll', document.documentElement.scrollWidth <= vw + 1,
      'scrollWidth=' + document.documentElement.scrollWidth + ' vw=' + vw);

  // 1. /help two-column shell must stack
  const grid = document.querySelector('.ul-page-grid');
  if (grid) {
    const cs = getComputedStyle(grid);
    add('ul-page-grid stacks to 1 column',
        cs.gridTemplateColumns.split(' ').length === 1,
        'columns=' + cs.gridTemplateColumns);
    const aside = document.querySelector('.ul-page-aside');
    if (aside) {
      const r = aside.getBoundingClientRect();
      add('sidebar is full width (not clipped)', r.width >= vw - 40,
          'aside width=' + Math.round(r.width));
    }
  }

  // 2. message header: the row is long, so it must be scrollable somehow.
  //    perfect-scrollbar adds .ps-container and takes over overflow itself, so
  //    accept either native overflow-x:auto/scroll OR a ps-container wrapper
  //    that really does overflow.
  const mh = document.querySelector('.message-box .message-header');
  if (mh) {
    const cs = getComputedStyle(mh);
    const native = cs.overflowX === 'auto' || cs.overflowX === 'scroll';
    const ps = mh.classList.contains('ps-container') && mh.scrollWidth > mh.clientWidth;
    add('message-header is scrollable', native || ps,
        'overflowX=' + cs.overflowX + ' ps=' + mh.classList.contains('ps-container') +
        ' scrollW=' + mh.scrollWidth + ' clientW=' + mh.clientWidth);
    add('message-header fits viewport', mh.getBoundingClientRect().width <= vw + 1,
        'width=' + Math.round(mh.getBoundingClientRect().width));
    const span = mh.querySelector('.useravatar span');
    if (span) {
      const scs = getComputedStyle(span);
      add('contact name truncates', scs.textOverflow === 'ellipsis' && scs.whiteSpace === 'nowrap',
          'textOverflow=' + scs.textOverflow + ' whiteSpace=' + scs.whiteSpace);
    }
  }

  // 3. tap targets: buttons only (inline text links are exempt per WCAG 2.5.8).
  //    Skip anything inside a transform: a closed dropdown/popup is scaled down,
  //    so getBoundingClientRect reports a misleadingly tiny box.
  const inTransformed = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const t = getComputedStyle(p).transform;
      if (t && t !== 'none') return true;
      p = p.parentElement;
    }
    return false;
  };
  const btns = Array.from(document.querySelectorAll('button, [role="button"]'))
    .filter(el => el.offsetParent !== null && !inTransformed(el));
  const small = btns.filter(b => b.getBoundingClientRect().height < 40);
  add('buttons >= 40px tall', small.length === 0,
      small.length + '/' + btns.length + ' too small' +
      (small[0] ? ' e.g. ' + small[0].className.toString().slice(0, 40) : ''));

  // 4. body copy >= 12px
  const tiny = Array.from(document.querySelectorAll('p, li, .post-text, .comment-text'))
    .filter(el => el.offsetParent !== null && (el.innerText || '').trim().length > 20)
    .filter(el => parseFloat(getComputedStyle(el).fontSize) < 12);
  add('body copy >= 12px', tiny.length === 0, tiny.length + ' elements below 12px');

  // 5. inputs >= 16px (prevents iOS zoom-on-focus)
  const inputs = Array.from(document.querySelectorAll('input:not([type=checkbox]):not([type=radio]), textarea, select'))
    .filter(el => el.offsetParent !== null);
  const smallInputs = inputs.filter(el => parseFloat(getComputedStyle(el).fontSize) < 16);
  add('inputs >= 16px (no iOS zoom)', smallInputs.length === 0, smallInputs.length + '/' + inputs.length + ' too small');

  // 6. safe-area + no backdrop-filter
  const bf = getComputedStyle(document.body).backdropFilter;
  add('backdrop-filter disabled on mobile', !bf || bf === 'none', 'backdropFilter=' + bf);

  // 7. headings
  add('page has an <h1>', document.querySelectorAll('h1').length === 1,
      document.querySelectorAll('h1').length + ' h1 element(s)');

  return out;
})()`;

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const routes = (process.env.ROUTES || "/help,/messages,/videos,/products").split(",");
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
    await ctx.addInitScript(
      ([t, u]) => {
        try {
          localStorage.setItem("auth_token", t);
          localStorage.setItem("auth_user", u);
          document.cookie = "auth_token=" + encodeURIComponent(t) + "; Path=/; SameSite=Lax";
        } catch (e) {}
      },
      [token, user]
    );
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(2500);
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
