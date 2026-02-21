import express from "express";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

// Connect DB
AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);

export default app;