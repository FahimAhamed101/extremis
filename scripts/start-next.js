const { spawn } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(port) || port < 0) {
  console.error(
    `Invalid PORT value "${process.env.PORT}". Please set PORT to a non-negative integer in .env.`
  );
  process.exit(1);
}

const nextBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

const child = spawn(process.execPath, [nextBin, "start", "-p", String(port), "-H", "0.0.0.0"], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
