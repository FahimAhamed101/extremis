/**
 * Authenticated mobile audit: seeds the auth token into localStorage + cookie
 * so RequireAuth lets us through, then runs the same overflow/tap-target
 * checks on the real in-app pages.
 */
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

const ROUTES = (process.env.ROUTES || "/,/videos,/groups,/products,/books,/events,/messages,/profile,/settings,/nearby,/live-stream,/friends,/pages,/courses,/blog,/help").split(",");
const AUDIT = fs.readFileSync(path.join(TMP, "audit-snippet.js"), "utf8");

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const out = {};
  for (const route of ROUTES) {
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
      const data = await page.evaluate(AUDIT);
      data.finalUrl = page.url();
      out[route] = data;
    } catch (e) {
      out[route] = { error: String(e.message).slice(0, 160) };
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(TMP, "audit-auth.json"), JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) {
    if (v.error) { console.log(k.padEnd(16), "ERR", v.error.slice(0, 50)); continue; }
    const landed = v.finalUrl.replace(BASE, "") || "/";
    console.log(
      k.padEnd(16),
      "ovfX=" + String(v.overflowX).padStart(4),
      "off=" + String(v.offenders.length).padStart(2),
      "tap=" + String(v.smallTargets.length).padStart(2),
      "txt=" + String(v.smallText.length).padStart(2),
      "->",
      landed,
      v.overflowX > 1 ? "<== OVERFLOW" : ""
    );
  }
})();
