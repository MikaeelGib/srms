import type { Student } from "../types/Student.ts";

const API_BASE = "http://localhost:5000/api/students";

export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}
