import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StudentModel } from "../models/student.model";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await StudentModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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

    res.json({
      token,
      role: user.role
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};
