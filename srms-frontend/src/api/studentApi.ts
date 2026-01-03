import type { Student } from "../types/Student";
import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/students";

export async function getAllStudents(): Promise<Student[]> {
  const token = getToken();

  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }

  return res.json();
}
