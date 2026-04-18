const http = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10) || 3000;
const hostname = process.env.HOST || "0.0.0.0";
const app = next({
  dev: false,
  dir: __dirname,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        console.log(`Extremis frontend listening on http://${hostname}:${port}`);
      });
  })
  .catch((error) => {
    console.error("Failed to start Extremis frontend:", error);
    process.exit(1);
  });
