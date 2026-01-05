import { useEffect, useState } from "react";
import { getAllStudents } from "../api/studentApi";
import type { Student } from "../types/Student";

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading records...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>All Student Records</h2>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Certificate Issued</th>
            <th>Hash</th>
            <th>On Chain</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student =>
            student.records?.length ? (
              student.records.map(record => (
                <tr key={record.recordId}>
                  <td>{student.fullName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.department}</td>
                  <td>✅ Yes</td>
                  <td style={{ fontSize: 12 }}>
                    {record.fileHash.slice(0, 16)}...
                  </td>
                  <td>
                    {record.txHash ? (
                      <a
                        href={`https://etherscan.io/tx/${record.txHash}`}
                        target="_blank"
                      >
                        🔗 View
                      </a>
                    ) : (
                      "⏳ Pending"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr key={student._id}>
                <td>{student.fullName}</td>
                <td>{student.studentId}</td>
                <td>{student.department}</td>
                <td colSpan={3}>❌ No certificate</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
