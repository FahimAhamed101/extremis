/** Capture mobile screenshots (with auth seeded) so mobile layout can be reviewed visually. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const TMP = __dirname;
const OUT = path.join(TMP, "shots");
fs.mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const EXEC =
  process.env.CHROME_PATH ||
  "C:/Users/Admin/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe";

const signup = JSON.parse(fs.readFileSync(path.join(TMP, "signup.json"), "utf8"));
const token = signup.token;
const user = JSON.stringify(signup.user);

const ROUTES = (process.env.ROUTES || "/videos,/groups,/messages,/nearby,/help,/courses").split(",");
const FULL = process.env.FULL === "1";

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
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
      await page.waitForTimeout(3000);
      const name = route.replace(/\//g, "_") || "_root";
      await page.screenshot({
        path: path.join(OUT, name + (FULL ? "-full" : "") + ".png"),
        fullPage: FULL,
      });
      console.log("shot", route);
    } catch (e) {
      console.log(route, "ERR", String(e.message).slice(0, 80));
    }
    await ctx.close();
  }
  await browser.close();
})();
