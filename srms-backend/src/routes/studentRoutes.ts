import { Router } from "express";
import multer from "multer";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  issueCertificate
} from "../controllers/studentController";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();
const upload = multer();

router.get("/:studentId", requireAuth, getStudentById);
router.get("/", requireAuth, requireAdmin, getStudents);
router.post("/", requireAuth, requireAdmin, createStudent);
router.put("/:studentId", requireAuth, requireAdmin, updateStudent);
router.delete("/:studentId", requireAuth, requireAdmin, deleteStudent);

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

export default router;
