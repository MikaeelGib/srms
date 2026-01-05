import type { Student } from "../types/Student";
import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/students";

export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function registerStudent(data: {
  studentId: string;
  name: string;
  email: string;
  department: string;
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

export async function addStudentRecord(
  studentId: string,
  record: {
    recordId: string;
    fileHash: string;
    issuerAdmin: string;
  }
) {
 const res = await fetch(
    `http://localhost:5000/api/students/${studentId}/records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(record)
    }
  );

  if (!res.ok) throw new Error("Failed to add student record");
  return res.json();
}
export async function addRecordOnChain(
  studentId: string,
  recordId: string
) {
  const res = await fetch(
    `http://localhost:5000/api/students/${studentId}/records/onchain`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ recordId })
    }
  );

  if (!res.ok) throw new Error("Blockchain tx failed");
  return res.json();
}