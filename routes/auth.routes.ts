import { Router } from "express";
import { signup, login, getMe, completeProfile, checkEmail, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/check-email", checkEmail);
router.post("/login", login);
router.post("/complete-profile", completeProfile); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMe);

export default router;