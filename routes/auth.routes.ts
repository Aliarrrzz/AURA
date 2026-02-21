import { Router } from "express";
import { signup, login, completeProfile } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/complete-profile", completeProfile);

export default router;