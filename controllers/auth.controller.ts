import { Request, Response } from "express";
import bcrypt from "bcrypt";
import transporter from "../config/mail";
import crypto from "crypto";
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

    const existingEmail = await userRepo.findOne({ where: { email: normalizedEmail } });
    if (existingEmail) return res.status(400).json({ error: "Email already exists" });

    const existingUsername = await userRepo.findOne({ where: { username } });
    if (existingUsername) return res.status(400).json({ error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      email: normalizedEmail,
      password: hashed,
      username,
      birthdate: birthdate ? new Date(birthdate) : undefined
    });

    await userRepo.save(user);

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      message: "User created and logged in successfully",
      accessToken,
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

// ====================== CHECK EMAIL ======================
export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const existing = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (existing) return res.status(400).json({ error: "Email already exists" });

    return res.json({ available: true });
  } catch (err) {
    return res.status(500).json({ error: "Check failed" });
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
//===================forgot password==============================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: "No account found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 دقیقه

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetExpiry;
    await userRepo.save(user);

    const resetLink = `http://localhost:3000/reset-password.html?token=${resetToken}`;

    await transporter.sendMail({
      from: `"AURA System" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "AURA | Reset Access Protocol",
      html: `
        <div style="background:#030407;color:white;padding:40px;font-family:sans-serif;border-radius:16px;">
          <h2 style="color:#00F2FF;">AURA Recovery Protocol</h2>
          <p>A reset request was initiated for your account.</p>
          <a href="${resetLink}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#8B5CF6;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset Access Key
          </a>
          <p style="margin-top:20px;color:#64748b;font-size:12px;">This link expires in 30 minutes.</p>
        </div>
      `,
    });

    return res.json({ message: "Reset link sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send reset email" });
  }
};

// ====================== RESET PASSWORD ======================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) return res.status(400).json({ error: "Token and password are required" });

    const user = await userRepo.findOne({ where: { resetToken: token } });
    if (!user) return res.status(400).json({ error: "Invalid or expired reset link" });

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: "Reset link has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null!;
    user.resetTokenExpiry = null!;
    await userRepo.save(user);

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Reset failed" });
  }
};

