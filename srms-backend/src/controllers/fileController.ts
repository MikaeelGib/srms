import { Response } from "express";
import fs from "fs";
import path from "path";
import { AuthRequest } from "../@types/auth";
import { StudentService } from "../services/studentService";

const sendIfAllowed = async (
  req: AuthRequest,
  res: Response,
  filename: string,
  mimeType: string,
  inline = true
) => {
  const recordId = req.params.recordId;

  const student = await StudentService.findByRecordHash(recordId);
  if (!student) {
    return res.status(404).json({ message: "Record not found" });
  }

  // 🔒 student access check
  if (
    req.user?.role === "student" &&
    req.user.id !== student._id.toString()
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  const studentId = student.studentId;

  const filePath = path.join(
    process.cwd(),
    "uploads",
    studentId,
    recordId,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found on disk" });
  }

  res.setHeader("Content-Type", mimeType);
  res.setHeader(
    "Content-Disposition",
    inline ? "inline" : "attachment"
  );

  fs.createReadStream(filePath).pipe(res);
};

// New Helper: No Auth check, just checks if record exists
const sendPublicFile = async (
  req: any, 
  res: Response, 
  filename: string, 
  mimeType: string
) => {
  const { recordId } = req.params;

  // Find student by the record hash (which is your recordId folder name)
  const student = await StudentService.findByRecordHash(recordId);
  if (!student) {
    return res.status(404).json({ message: "Record not found" });
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    student.studentId,
    recordId,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", "inline");
  fs.createReadStream(filePath).pipe(res);
};

// Exported Public Versions
export const getPublicCertificate = (req: any, res: Response) => 
  sendPublicFile(req, res, "certificate.pdf", "application/pdf");

export const getPublicReportCard = (req: any, res: Response) => 
  sendPublicFile(req, res, "reportCard.pdf", "application/pdf");

export const getPublicPhoto = (req: any, res: Response) => 
  sendPublicFile(req, res, "photo.jpg", "image/jpeg");

/* ======================
   FILE ENDPOINTS
====================== */

export const getCertificate = async (req: AuthRequest, res: Response) => {
  await sendIfAllowed(
    req,
    res,
    "certificate.pdf",
    "application/pdf",
    true
  );
};

export const getReportCard = async (req: AuthRequest, res: Response) => {
  await sendIfAllowed(
    req,
    res,
    "reportCard.pdf",
    "application/pdf",
    true
  );
};

export const getPhoto = async (req: AuthRequest, res: Response) => {
  await sendIfAllowed(
    req,
    res,
    "photo.jpg",
    "image/jpeg",
    true
  );
};

export const getQR = async (req: AuthRequest, res: Response) => {
  await sendIfAllowed(
    req,
    res,
    "qr.png",
    "image/png",
    true
  );
};