import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"; 

const userRepo = AppDataSource.getRepository(User);

// ====================== SIGNUP ======================
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, username, birthdate } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Email, password, and username are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await userRepo.findOne({ where: [{ email: normalizedEmail }, { username }] });
    
    if (existing) return res.status(400).json({ error: "Email or Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    
    const user = userRepo.create({ 
      email: normalizedEmail, 
      password: hashed,
      username, 
      birthdate: birthdate ? new Date(birthdate) : undefined 
    });
    
    await userRepo.save(user);

    // --- بخش Auto-Login ---
    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      message: "User created and logged in successfully",
      accessToken, // توکن را به فرانت‌اِند برگردان
      refreshToken,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        avatar: `https://ui-avatars.com/api/?name=${user.username}&background=8B5CF6&color=fff`
      }
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
    const user = await userRepo.findOne({ where: { email: email?.toLowerCase() } });

    if (!user) return res.status(404).json({ error: "User record not found." });

    const usernameExists = await userRepo.findOne({ where: { username } });
    if (usernameExists) return res.status(400).json({ error: "Username is already taken." });

    user.username = username;
    user.birthdate = new Date(birthdate);
    await userRepo.save(user);

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);

    return res.json({ 
        message: "Profile synchronized successfully!",
        accessToken, 
        username: user.username 
    });
  } catch (err) {
    return res.status(500).json({ error: "Sync failed" });
  }
};

// ====================== LOGIN ======================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || 'Aura Explorer',
        avatar: `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=8B5CF6&color=fff`
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
};

// ====================== GET CURRENT USER ======================
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username, 
        avatar: `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=8B5CF6&color=fff`
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};