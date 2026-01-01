import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Student } from "../types/Student";

export default function StudentDetailsPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/students/${studentId}`)
      .then(res => res.json())
      .then(setStudent);
  }, [studentId]);

  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{student.name}</h1>
      <p>ID: {student.studentId}</p>
      <p>Department: {student.department}</p>

      <h3>Records</h3>
      <ul>
        {student.records.map(r => (
          <li key={r.recordId}>
            {r.recordId} – {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
