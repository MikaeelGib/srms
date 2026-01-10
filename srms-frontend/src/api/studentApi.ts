import type { Student } from "../types/Student";
import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/students";

/* ===========================
   STUDENTS
=========================== */

export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }

  return res.json();
}

export async function getStudentById(studentId: string): Promise<Student> {
  const res = await fetch(`${API_BASE}/${studentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch student");
  }

  return res.json();
}

/* ===========================
   REGISTER STUDENT (ADMIN)
=========================== */

export async function registerStudent(data: {
  studentId: string;
  name: string;               
  email: string;
  department: string;
  graduationYear: number;
  finalGrade: string;
  percentage: number;
  password: string;           // temp password
}) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to register student");
  }

  return res.json();
}

/* ===========================
   ISSUE CERTIFICATE (ADMIN)
   - certificate PDF
   - student photo
   - graduationYear
   - percentage
=========================== */

export async function issueCertificate(
  studentId: string,
  formData: FormData
): Promise<{
  recordHash: string;
  txHash: string;
}> {
  const res = await fetch(`${API_BASE}/${studentId}/issue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to issue certificate");
  }

  return res.json();
}
