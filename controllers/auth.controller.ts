import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.model";

const userRepo = AppDataSource.getRepository(User);

// ====================== SIGNUP ======================
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1) اعتبارسنجی ساده (می‌تونی بعداً DTO/validator اضافه کنی)
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2) نرمال‌سازی ایمیل
    const normalizedEmail = email.toLowerCase();

    // 3) چک کردن وجود ایمیل
    const existing = await userRepo.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 4) هش کردن پسورد
    const hashed = await bcrypt.hash(password, 10);

    // 5) ساخت یوزر (username و birthdate فعلاً خالی)
    const user = userRepo.create({
      email: normalizedEmail,
      password: hashed,
    });

    await userRepo.save(user);

    // 6) پاسخ نهایی
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

// ====================== COMPLETE PROFILE ======================
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const { email, username, birthdate } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.username = username;
    user.birthdate = birthdate;

    await userRepo.save(user);

    return res.json({ message: "Profile completed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Profile update failed" });
  }
};

// ====================== LOGIN ======================
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await userRepo.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // در انتهای متد login
    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        // اگر username نداشت، بخش اول ایمیل را بفرست یا یک اسم پیش‌فرض
        username: user.username || user.email.split('@')[0],
        birthdate: user.birthdate,
        // آواتار یوزر (می‌توانی از یک URL پیش‌فرض بر اساس اسم استفاده کنی)
        avatar: `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=8B5CF6&color=fff`
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};
// ====================== GET CURRENT USER ======================
export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user توسط authMiddleware که قبلاً داشتی پر می‌شود
    const userId = (req as any).user.id; 

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username || user.email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=8B5CF6&color=fff`
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};