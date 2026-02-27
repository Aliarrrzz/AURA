// auth.routes.ts
import { Router } from "express";
import { signup, login, getMe, completeProfile, checkEmail } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/check-email", checkEmail);
router.post("/login", login);
router.post("/complete-profile", completeProfile); 
router.get("/me", authMiddleware, getMe);

export default router;