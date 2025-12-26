import { useEffect, useState } from "react";
import { getAllStudents } from "../api/studentApi";
import type { Student } from "../types/Student.ts";
import AddRecord from "./AddRecord";


export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getAllStudents().then(setStudents);
  }, []);

  return (
    <div>
      <h2>Students</h2>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.studentId} — {s.name} ({s.department})
            <AddRecord studentId={s._id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
