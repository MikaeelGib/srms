import { Router } from "express";
import multer from "multer";
import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  issueCertificate,
  verifyCertificate
} from "../controllers/studentController";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();
const upload = multer();

/* =======================
   ADMIN
======================= */

router.get("/", requireAuth, requireAdmin, getStudents);
router.post("/", requireAuth, requireAdmin, createStudent);
router.delete("/:studentId", requireAuth, requireAdmin, deleteStudent);

/* =======================
   STUDENT (DASHBOARD)
======================= */

router.get("/:studentId", requireAuth, getStudentById);

/* =======================
   CERTIFICATE
======================= */

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

/* =======================
   PUBLIC VERIFY
======================= */

router.post("/verify", verifyCertificate);

export default router;