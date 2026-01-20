import { useEffect, useState } from "react";
import { getAllStudents } from "../api/studentApi";
import type { Student, Record } from "../types/Student";
import * as styles from "../styles/certificateStyles";

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
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>Loading records...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div
        style={{
          ...styles.card,
          width: "95%",
          maxWidth: 1100,
          padding: 30
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          📜 All Issued Certificates
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            width="100%"
            cellPadding={10}
            style={{
              borderCollapse: "collapse",
              background: "#ffffff22",
              borderRadius: 12,
              color: "#fff"
            }}
          >
            <thead>
              <tr style={{ background: "#00000044" }}>
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
                    <tr
                      key={record.recordId}
                      style={{ borderTop: "1px solid #ffffff33" }}
                    >
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>{student.department || "—"}</td>

                      <td>
                        {record.graduationYear ?? "—"}
                      </td>

                      <td>
                        {record.percentage != null
                          ? `${record.percentage}%`
                          : "—"}
                      </td>

                      <td style={{ fontSize: 12 }}>
                        {record.recordId.slice(0, 16)}...
                      </td>

                      <td>
                        {record.status === "on-chain" && "✅ On-chain"}
                        {record.status === "verified" && "🟡 Verified"}
                        {record.status === "pending" && "⏳ Pending"}
                      </td>

                      <td>
                        {record.blockchainTxHash ? (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${record.blockchainTxHash}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#ffd166" }}
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
                  <tr
                    key={student._id}
                    style={{ borderTop: "1px solid #ffffff33" }}
                  >
                    <td>{student.name}</td>
                    <td>{student.studentId}</td>
                    <td>{student.department || "—"}</td>
                    <td colSpan={5} style={{ opacity: 0.6 }}>
                      ❌ No certificates issued
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
