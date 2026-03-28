const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel API error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};
