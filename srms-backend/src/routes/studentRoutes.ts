import { Router } from "express";
import {
  createStudent,
  getStudentById,
  getStudents,
  updateStudent,
  deleteStudent,
  addStudentRecord,
  updateRecordStatus,
  addRecordOnChain
} from "../controllers/studentController";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware";  

const router = Router();


// Get student by ID - Authenticated users
router.get("/:studentId", requireAuth, getStudentById);

// ADMIN ONLY - Get all students
router.get("/", requireAuth, requireAdmin, getStudents);

// ADMIN ONLY - Create student
router.post("/", requireAuth, requireAdmin, createStudent);

// ADMIN ONLY - Update student
router.put("/:studentId", requireAuth, requireAdmin, updateStudent);

// ADMIN ONLY - Delete student
router.delete("/:studentId", requireAuth, requireAdmin, deleteStudent);

// ADMIN ONLY - Add student record
router.post("/:studentId/records",
  requireAuth,
  requireAdmin, 
  addStudentRecord
);

// ADMIN ONLY - Add student record on-chain
router.post("/:studentId/records/onchain",
  requireAuth,
  requireAdmin,
  addRecordOnChain
);

// ADMIN ONLY - Update record status
router.patch("/:studentId/records/:recordId/status", 
  requireAuth,
  requireAdmin,
  updateRecordStatus
);

export default router;
