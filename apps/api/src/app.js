import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevFlow API is running",
    timestamp: new Date().toISOString(),
  });
});
app.use((err, req, res, next) => {
  console.error("API error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.statusCode && err.statusCode < 500
        ? err.message
        : "Internal server error",
  });
});

export default app;