const express = require("express");
const next = require("next");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const port = process.env.PORT || 3000;
const dev = false;
const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./backend/src/routes/authRoutes");
// const userRoutes = require("./backend/src/routes/userRoutes");

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

nextApp.prepare().then(() => {
  app.all(/.*/, (req, res) => handle(req, res));

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});