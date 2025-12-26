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

// Create student
router.post("/", createStudent);

// Get all students
router.get("/", getStudents);

// Get student by ID
router.get("/:studentId", getStudentById);

// Update student
router.put("/:studentId", updateStudent);

// Delete student
router.delete("/:studentId", deleteStudent);

// Add record to student
router.post("/:studentId/records", addStudentRecord);

// Add record on blockchain
router.post("/:studentId/records/onchain", addRecordOnChain);

//Update record status
router.patch("/:studentId/records/:recordId/status", 
  updateRecordStatus,
  requireAdmin,
  requireAuth
);

router.post("/:studentId/records/onchain", 
  addRecordOnChain,
  requireAdmin,
  requireAuth
);


export default router;
