import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { AdminModel } from "../models/admin.model";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB");

    const email = "admin@srms.com";
    const password = "admin123";

    const exists = await AdminModel.findOne({ email });
    if (exists) {
      console.log("❌ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminModel.create({
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("🔥 Failed to seed admin:", err);
    process.exit(1);
  }
}

seedAdmin();