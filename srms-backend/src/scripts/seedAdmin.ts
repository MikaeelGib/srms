import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { StudentModel } from "../models/student.model";

dotenv.config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI!);

  const email = "admin@srms.com";
  const password = "admin123";

  const exists = await StudentModel.findOne({ email });
  if (exists) {
    console.log("❌ Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await StudentModel.create({
    studentId: "ADMIN-001",
    name: "System Admin",
    email,
    password: hashedPassword,
    role: "admin",
    records: []
  });

  console.log("✅ Admin created successfully");
  process.exit(0);
}

seedAdmin();
