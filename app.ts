import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "./public")));

// Connect DB
AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Error:", err));

// Serve main page on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/main.html"));
});

// API Routes
app.use("/api/auth", authRoutes);

export default app;