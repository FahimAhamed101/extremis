const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const groupRoutes = require("./routes/groupRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tourismRoutes = require("./routes/tourismRoutes");
const storyRoutes = require("./routes/storyRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const apiRouter = express.Router();

// Enable all origins with credentials & preflight support
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Range",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200,
  })
);

const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(uploadsDir));

app.use((req, res, next) => {
  if (req.body == null) {
    req.body = {};
    next();
    return;
  }

  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch {
      req.body = {};
    }

    next();
    return;
  }

  if (typeof req.body === "string") {
    const rawBody = req.body.trim();
    if (!rawBody) {
      req.body = {};
      next();
      return;
    }

    try {
      req.body = JSON.parse(rawBody);
    } catch {
      req.body = {};
    }
  }

  next();
});

apiRouter.get("/health", async (req, res) => {
  let dbStatus = "disconnected";
  try {
    const connectDB = require("./config/db");
    const conn = await connectDB();
    dbStatus = conn.readyState === 1 ? "connected" : "connecting";
  } catch (err) {
    dbStatus = "error";
  }

  res.status(200).json({
    ok: true,
    service: "auth-api",
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/uploads", express.static(uploadsDir));

apiRouter.post("/upload-image", (req, res) => {
  try {
    let { image, name } = req.body || {};
    if (!image && typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body);
        image = parsed.image;
        name = parsed.name;
      } catch (e) {}
    }

    if (!image) {
      return res.status(400).json({ success: false, message: "No image data provided" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `post_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `http://10.0.2.2:4000/uploads/${filename}`;
    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: filename,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


apiRouter.use("/auth", authRoutes);
apiRouter.use("/chat", chatRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/profile", profileRoutes);
apiRouter.use("/uploads", uploadRoutes);
apiRouter.use("/groups", groupRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/tourism", tourismRoutes);
apiRouter.use("/stories", storyRoutes);
apiRouter.use("/notifications", require("./routes/notificationRoutes"));
apiRouter.use("/reels", require("./routes/reelRoutes"));

// The route modules above remain the source of truth for every backend endpoint.
// Vercel forwards /api/* into this app through a single catch-all function, while
// local backend development still uses the direct /api/* mount below.
app.use("/api", apiRouter);
app.use(apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
