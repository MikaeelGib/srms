import { Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

import { StudentService } from "../services/studentService";
import { BlockchainService } from "../services/blockchainService";
import { AuthRequest } from "../@types/auth";

/* =======================
   GET ALL STUDENTS (ADMIN)
======================= */

export const getStudents = async (_req: AuthRequest, res: Response) => {
  try {
    const students = await StudentService.getAll();
    res.json(students);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* =======================
   STUDENT DASHBOARD
======================= */

export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const student = await StudentService.getStudentByMongoId(
      req.params.studentId.trim()
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (
      req.user?.role === "student" &&
      req.user.id !== student._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(student);
  } catch {
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

/* =======================
   CREATE STUDENT (ADMIN)
======================= */

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, name, email, department, password } = req.body;

    if (!studentId || !name || !department || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await StudentService.getStudentByStudentId(studentId.trim());
    if (exists) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await StudentService.create({
      studentId: studentId.trim(),
      name: name.trim(),
      email: email?.trim(),
      department: department.trim(),
      password: hashedPassword
    });

    res.status(201).json(student);
  } catch {
    res.status(500).json({ message: "Failed to create student" });
  }
};

/* =======================
   DELETE STUDENT (ADMIN)
======================= */

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  const adminPin = req.headers["x-admin-pin"];
  if (adminPin !== process.env.ADMIN_DELETE_PIN) {
    return res.status(403).json({ message: "Invalid admin PIN" });
  }

  const studentId = req.params.studentId.trim();
  const student = await StudentService.getStudentByStudentId(studentId);

  if (!student) return res.status(404).json({ message: "Student not found" });

  if (student.records.some(r => r.status === "on-chain")) {
    return res
      .status(403)
      .json({ message: "Cannot delete student with on-chain records" });
  }

  await StudentService.deleteStudentByStudentId(studentId);
  res.json({ message: "Student deleted successfully" });
};

/* =======================
   ISSUE CERTIFICATE
======================= */

export const issueCertificate = async (req: AuthRequest, res: Response) => {
  const studentId = req.params.studentId.trim();
  const graduationYear = Number(req.body.graduationYear);
  const percentage = Number(req.body.percentage);

  const student = await StudentService.getStudentByStudentId(studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const files = req.files as any;
  if (!files?.certificate || !files?.reportCard || !files?.photo) {
    return res.status(400).json({ message: "All files are required" });
  }

  const recordHash = crypto
    .createHash("sha256")
    .update(
      studentId +
        files.certificate[0].buffer.toString("hex") +
        files.reportCard[0].buffer.toString("hex")
    )
    .digest("hex");

  const baseDir = path.join(
    process.cwd(),
    "uploads",
    studentId,
    recordHash
  );
  fs.mkdirSync(baseDir, { recursive: true });

  fs.writeFileSync(path.join(baseDir, "certificate.pdf"), files.certificate[0].buffer);
  fs.writeFileSync(path.join(baseDir, "reportCard.pdf"), files.reportCard[0].buffer);
  fs.writeFileSync(path.join(baseDir, "photo.jpg"), files.photo[0].buffer);
  fs.writeFileSync(path.join(baseDir, "qr.png"), await QRCode.toBuffer(recordHash));

  const tx = await BlockchainService.addRecord(studentId, recordHash);

  await StudentService.addRecordToStudent(studentId, {
    recordId: recordHash,
    blockchainTxHash: tx.txHash,
    issuerAdmin: req.user?.id,
    status: "on-chain",
    graduationYear,
    percentage
  });

  res.status(201).json({ recordHash, txHash: tx.txHash });
};

/* =======================
   PUBLIC VERIFIER (KEPT ✅)
======================= */

export const verifyCertificate = async (req: AuthRequest, res: Response) => {
  const { recordHash } = req.body;
  if (!recordHash) return res.status(400).json({ message: "recordHash required" });

  const student = await StudentService.findByRecordHash(recordHash);
  if (!student) return res.status(404).json({ message: "Not found" });

  const record = student.records.find(r => r.recordId === recordHash);
  res.json({ valid: true, student, record });
};