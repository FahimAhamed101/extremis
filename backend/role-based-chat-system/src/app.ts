import express from "express";
import cors from "cors";
import { chatRoutes } from "./routes/chat.routes";
import { authRoutes } from "./routes/auth.routes";
import { getAllowedOrigins } from "./config/clientOrigins";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

export default app;
