import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const AuthService = {
  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 10);
  },

  comparePassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },

  generateToken: (payload: { studentId: string; role: string }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  },
};
