const loadEnv = require("./backend/src/config/loadEnv");
loadEnv();

const app = require("./backend/src/app");
const connectDB = require("./backend/src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel function startup error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: error?.expose && error?.message ? error.message : "Internal server error.",
      });
    }
  }
};
