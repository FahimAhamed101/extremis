const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, ".env"),
];

for (const envPath of [...new Set(envCandidates)]) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const connectDB = require("./config/db");
const app = require("./app");

const parsedPort = Number(process.env.AUTH_PORT || process.env.PORT || 4000);
const PORT = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 4000;

async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start auth API:", error);
    process.exit(1);
  }
}

bootstrap();
