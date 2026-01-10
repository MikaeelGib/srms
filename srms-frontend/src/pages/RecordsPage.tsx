import { useEffect, useState } from "react";
import { getAllStudents } from "../api/studentApi";
import type { Student, Record } from "../types/Student";

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading records...</p>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 20 }}>📜 All Student Records</h2>

      <table
        width="100%"
        cellPadding={10}
        style={{
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th align="left">Student</th>
            <th align="left">Roll No</th>
            <th align="left">Department</th>
            <th align="left">Graduation</th>
            <th align="left">Percentage</th>
            <th align="left">Record Hash</th>
            <th align="left">Status</th>
            <th align="left">Blockchain</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student =>
            student.records && student.records.length > 0 ? (
              student.records.map((record: Record) => (
                <tr key={record.recordId} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>{student.department}</td>
                  <td>{record.graduationYear}</td>
                  <td>{record.percentage}%</td>

                  <td style={{ fontSize: 12 }}>
                    {record.recordId.slice(0, 18)}...
                  </td>

                  <td>
                    {record.status === "on-chain" && "✅ On-chain"}
                    {record.status === "verified" && "🟡 Verified"}
                    {record.status === "pending" && "⏳ Pending"}
                  </td>

                  <td>
                    {record.blockchainTxHash ? (
                      <a
                        href={`https://etherscan.io/tx/${record.blockchainTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🔗 View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr key={student._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td>{student.name}</td>
                <td>{student.studentId}</td>
                <td>{student.department}</td>
                <td colSpan={5} style={{ color: "#9ca3af" }}>
                  ❌ No certificates issued
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
