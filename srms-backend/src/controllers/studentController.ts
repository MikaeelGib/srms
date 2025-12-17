import { Request, Response } from "express";
import { StudentService } from "../services/studentService";

// GET /api/students
export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentService.getAll();
    res.json(students);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// GET /api/students/:studentId
export const getStudentById = async (req: Request, res: Response) => {
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

// POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, name, email, department } = req.body;

    if (!studentId || !name) {
      return res
        .status(400)
        .json({ message: "studentId and name are required" });
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
      department,
      records: [],
    } as any);

    res.status(201).json(student);
  } catch {
    res.status(500).json({ message: "Failed to create student" });
  }
};

// PUT /api/students/:studentId
export const updateStudent = async (req: Request, res: Response) => {
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

// DELETE /api/students/:studentId
export const deleteStudent = async (req: Request, res: Response) => {
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

// POST /api/students/:studentId/records
export const addStudentRecord = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();
    const { recordId, fileHash, ipfsCid, blockchainTxHash, issuerAdmin, status } =
      req.body;

    if (!recordId) {
      return res.status(400).json({ message: "recordId is required" });
    }

    const student = await StudentService.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const duplicate = student.records.some(
      (r) => r.recordId === recordId
    );

    if (duplicate) {
      return res.status(409).json({
        message: "Record with this recordId already exists for this student",
      });
    }

    const updatedStudent = await StudentService.addRecordToStudent(studentId, {
      recordId,
      fileHash,
      ipfsCid,
      blockchainTxHash,
      issuerAdmin,
      status,
    });

    res.status(201).json(updatedStudent);
  } catch {
    res.status(500).json({ message: "Failed to add record" });
  }
};

// PATCH /api/students/:studentId/records/:recordId/status
export const updateRecordStatus = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId.trim();
    const recordId = req.params.recordId.trim();
    const { status } = req.body;

    const allowedStatuses = ["pending", "verified", "on-chain"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedStudent = await StudentService.updateRecordStatus(
      studentId,
      recordId,
      status
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student or record not found",
      });
    }

    res.json(updatedStudent);
  } catch {
    res.status(500).json({ message: "Failed to update record status" });
  }
};
