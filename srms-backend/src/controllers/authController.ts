import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StudentModel } from "../models/student.model";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN ATTEMPT:", email);

    const user = await StudentModel.findOne({ email });
    console.log("USER FOUND:", user ? "YES" : "NO");
  
    if (!user || !user.password) {
       console.log("❌ User not found or no password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

     console.log("STORED PASSWORD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    console.log("✅ LOGIN SUCCESS");

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
