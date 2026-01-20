import { Response } from "express";
import crypto from "crypto";

import { StudentService } from "../services/studentService";
import { BlockchainService } from "../services/blockchainService";
import { AuthRequest } from "../@types/auth";

/* =======================
   STUDENT CRUD
======================= */

export const getStudents = async (_req: AuthRequest, res: Response) => {
  try {
    const students = await StudentService.getAll();
    res.json(students);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();
    const student = await StudentService.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch {
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, name, email, department } = req.body;

    if (!studentId || !name) {
      return res.status(400).json({
        message: "studentId and name are required"
      });
    }

    const trimmedStudentId = studentId.trim();
    const exists = await StudentService.getStudentById(trimmedStudentId);

    if (exists) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const student = await StudentService.create({
      studentId: trimmedStudentId,
      name,
      email,
      department
    });

    res.status(201).json(student);
  } catch {
    res.status(500).json({ message: "Failed to create student" });
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();

    const updated = await StudentService.updateStudentById(
      studentId,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update student" });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();
    const removed = await StudentService.deleteStudentById(studentId);

    if (!removed) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete student" });
  }
};

/* =======================
   ISSUE CERTIFICATE
======================= */

export const issueCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();

    /* ---------- SANITIZE INPUT ---------- */
    const graduationYearRaw = req.body.graduationYear;
    const percentageRaw = req.body.percentage;

    const graduationYear =
      graduationYearRaw !== undefined && graduationYearRaw !== ""
        ? Number(graduationYearRaw)
        : undefined;

    const percentage =
      percentageRaw !== undefined && percentageRaw !== ""
        ? Number(percentageRaw)
        : undefined;

    if (
      graduationYear !== undefined &&
      Number.isNaN(graduationYear)
    ) {
      return res.status(400).json({ message: "Invalid graduationYear" });
    }

    if (
      percentage !== undefined &&
      Number.isNaN(percentage)
    ) {
      return res.status(400).json({ message: "Invalid percentage" });
    }

    const student = await StudentService.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const certificate = (req.files as any)?.certificate?.[0];
    const reportCard = (req.files as any)?.reportCard?.[0];
    const photo = (req.files as any)?.photo?.[0];

    if (!certificate || !reportCard || !photo) {
      return res.status(400).json({ message: "All files are required" });
    }

    /* ---------- FILE HASHES ---------- */

    const certHash = crypto
      .createHash("sha256")
      .update(certificate.buffer)
      .digest("hex");

    const reportHash = crypto
      .createHash("sha256")
      .update(reportCard.buffer)
      .digest("hex");

    const photoHash = crypto
      .createHash("sha256")
      .update(photo.buffer)
      .digest("hex");

    /* ---------- UNIFIED RECORD HASH ---------- */

    const recordHash = crypto
      .createHash("sha256")
      .update(`${studentId}|${certHash}|${reportHash}|${photoHash}`)
      .digest("hex");

    if (student.records.some(r => r.recordId === recordHash)) {
      return res.status(409).json({ message: "Certificate already issued" });
    }

    /* ---------- BLOCKCHAIN ---------- */

    const tx = await BlockchainService.addRecord(studentId, recordHash);

    /* ---------- DATABASE ---------- */

    await StudentService.addRecordToStudent(studentId, {
      recordId: recordHash,
      fileHash: certHash,
      blockchainTxHash: tx.txHash,
      issuerAdmin: req.user?.id,
      status: "on-chain",
      ...(graduationYear !== undefined && { graduationYear }),
      ...(percentage !== undefined && { percentage })
    });

    res.status(201).json({
      message: "Certificate issued successfully",
      recordHash,
      txHash: tx.txHash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Certificate issuance failed" });
  }
};

/* =======================
   PUBLIC VERIFIER
======================= */

export const verifyCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { recordHash } = req.body;

    if (!recordHash) {
      return res.status(400).json({ message: "recordHash is required" });
    }

    const student = await StudentService.findByRecordHash(recordHash);
    if (!student) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const record = student.records.find(r => r.recordId === recordHash);
    if (!record || !record.blockchainTxHash) {
      return res.status(400).json({ message: "Certificate not on blockchain" });
    }

    res.json({
      valid: true,
      student: {
        name: student.name,
        studentId: student.studentId,
        department: student.department
      },
      record: {
        recordId: record.recordId,
        issuedAt: record.issueDate,
        graduationYear: record.graduationYear,
        percentage: record.percentage,
        blockchainTxHash: record.blockchainTxHash
      }
    });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};
