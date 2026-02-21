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

    // Check if email exists
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user (username is null for now)
    const user = userRepo.create({
      email,
      password: hashed,
    });

    await userRepo.save(user);

    return res.status(201).json({ message: "User created successfully" });
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
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};