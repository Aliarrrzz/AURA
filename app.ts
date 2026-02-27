import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "./public")));

AppDataSource.initialize()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/main.html"));
});

app.use("/api/auth", authRoutes);

export default app;