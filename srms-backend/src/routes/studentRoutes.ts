import { Router } from "express";
import multer from "multer";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  issueCertificate,
  verifyCertificate
} from "../controllers/studentController";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();
const upload = multer();

// Admin routes
router.get("/", requireAuth, requireAdmin, getStudents);
router.post("/", requireAuth, requireAdmin, createStudent);
router.put("/:studentId", requireAuth, requireAdmin, updateStudent);
router.delete("/:studentId", requireAuth, requireAdmin, deleteStudent);

// Student
router.get("/:studentId", requireAuth, getStudentById);

// Issue certificate
router.post(
  "/:studentId/issue",
  requireAuth,
  requireAdmin,
  upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "reportCard", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  issueCertificate
);

// 🔓 Public verifier route (NO AUTH)
router.post("/verify", verifyCertificate);

export default router;
