import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StudentModel } from "../models/student.model";
import { AdminModel } from "../models/admin.model";

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    let user: any = null;

    /* ================= ADMIN LOGIN ================= */
    if (role === "admin") {
      user = await AdminModel.findOne({ email: identifier });
    }

    /* ================= STUDENT LOGIN ================= */
    if (role === "student") {
      user = await StudentModel.findOne({ studentId: identifier });
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,               // ✅ Mongo ID
        role,
        studentId: role === "student" ? user.studentId : undefined
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};