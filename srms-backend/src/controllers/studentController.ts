import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { BlockchainService } from "../services/blockchainService";
import crypto from "crypto";

/* =======================
   STUDENT CRUD
======================= */

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentService.getAll();
    res.json(students);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await StudentService.getStudentById(req.params.studentId.trim());
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch {
    res.status(500).json({ message: "Failed to fetch student" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, name, email, department } = req.body;
    if (!studentId || !name) {
      return res.status(400).json({ message: "studentId and name are required" });
    }

    const exists = await StudentService.getStudentById(studentId.trim());
    if (exists) return res.status(409).json({ message: "Student already exists" });

    const student = await StudentService.create({
      studentId: studentId.trim(),
      name,
      email,
      department
    });

    res.status(201).json(student);
  } catch {
    res.status(500).json({ message: "Failed to create student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updated = await StudentService.updateStudentById(
      req.params.studentId.trim(),
      req.body
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update student" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const removed = await StudentService.deleteStudentById(req.params.studentId.trim());
    if (!removed) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete student" });
  }
};

/* =======================
   ISSUE CERTIFICATE
======================= */

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();
    const student = await StudentService.getStudentById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const certificate = (req.files as any)?.certificate?.[0];
    const reportCard = (req.files as any)?.reportCard?.[0];
    const photo = (req.files as any)?.photo?.[0];

    if (!certificate || !reportCard || !photo) {
      return res.status(400).json({ message: "All files are required" });
    }

    // Individual file hashes
    const certHash = crypto.createHash("sha256").update(certificate.buffer).digest("hex");
    const reportHash = crypto.createHash("sha256").update(reportCard.buffer).digest("hex");
    const photoHash = crypto.createHash("sha256").update(photo.buffer).digest("hex");

    // Unified record hash (QR hash)
    const recordHash = crypto
      .createHash("sha256")
      .update(`${studentId}|${certHash}|${reportHash}|${photoHash}`)
      .digest("hex");

    // Prevent duplicate issuance
    if (student.records.some(r => r.recordId === recordHash)) {
      return res.status(409).json({ message: "Certificate already issued" });
    }

    // Blockchain write
    const tx = await BlockchainService.addRecord(studentId, recordHash);

    // MongoDB save
    await StudentService.addRecordToStudent(studentId, {
      recordId: recordHash,
      fileHash: certHash,
      blockchainTxHash: tx.txHash,
      status: "on-chain",
      issuerAdmin: req.user?.id
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
   VERIFIER ENDPOINT
======================= */

export const verifyCertificate = async (req: Request, res: Response) => {
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
      verified: true,
      student: {
        name: student.name,
        studentId: student.studentId,
        department: student.department
      },
      issuedAt: record.issueDate,
      blockchainTxHash: record.blockchainTxHash
    });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};
