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
  password: string;
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
   DELETE STUDENT (ADMIN + PIN)
=========================== */
export async function deleteStudent(
  studentId: string,
  adminPassword: string // Renamed from adminPin for clarity
) {
  const res = await fetch(
    `http://localhost:5000/api/students/${studentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // If your backend still looks for 'x-admin-pin', keep the key as is, 
        // but pass the password value. 
        // If you've updated the backend, change this key to 'x-admin-password'
        "x-admin-pin": adminPassword 
      }
    }
  );

  if (!res.ok) {
    const err = await res.json();
    // Catch the specific PIN error message and make it user-friendly
    const errorMessage = err.message || "Failed to delete student";
    throw new Error(errorMessage.replace(/PIN/gi, "password"));
  }

  return res.json();
}
/* ===========================
   ISSUE CERTIFICATE (ADMIN)
=========================== */

export async function issueCertificate(
  studentId: string,
  formData: FormData
) {
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