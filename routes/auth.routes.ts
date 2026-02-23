// auth.routes.ts
import { Router } from "express";
import { signup, login, getMe, completeProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/complete-profile", authMiddleware, completeProfile); // نیاز به احراز هویت
router.get("/me", authMiddleware, getMe); // حتماً میدلور را اینجا بگذار

export default router;