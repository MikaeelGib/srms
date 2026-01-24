import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import type { Student } from "../types/Student";
import * as styles from "../styles/certificateStyles";

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch {
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const hasOnChainRecord = (student: Student) =>
    student.records.some(r => r.status === "on-chain");

    const handleDelete = async (student: Student) => {
    if (hasOnChainRecord(student)) {
      return alert("❌ Cannot delete student with on-chain records");
    }

    const pin = prompt("Enter Admin PIN:");
    if (!pin) return;

    try {
      await deleteStudent(student.studentId, pin);
      setStudents(prev =>
        prev.filter(s => s.studentId !== student.studentId)
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    }
  };

  const goToIssueCertificate = (student: Student) => {
    navigate("/admin/issue", {
      state: { student }
    });
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>Loading records...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={{ ...styles.card, width: "95%", maxWidth: 1150 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          📜 Students Records
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
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Graduation</th>
                <th>Percentage</th>
                <th>Record Hash</th>
                <th>Status</th>
                <th>Blockchain</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map(student =>
                student.records.length > 0 ? (
                  student.records.map(record => (
                    <tr key={record.recordId}>
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>{student.department || "—"}</td>
                      <td>{record.graduationYear ?? "—"}</td>
                      <td>
                        {record.percentage !== undefined
                          ? `${record.percentage}%`
                          : "—"}
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {record.recordId.slice(0, 14)}…
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
                      <td align="center">
                        <button
                          disabled={hasOnChainRecord(student)}
                          onClick={() => handleDelete(student)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: hasOnChainRecord(student)
                              ? "#555"
                              : "#e63946",
                            color: "#fff",
                            border: "none",
                            cursor: hasOnChainRecord(student)
                              ? "not-allowed"
                              : "pointer"
                          }}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={student.studentId}>
                    <td>{student.name}</td>
                    <td>{student.studentId}</td>
                    <td>{student.department || "—"}</td>
                    <td colSpan={4} style={{ opacity: 0.6 }}>
                      ❌ No certificate issued
                    </td>
                    <td>—</td>
                    <td align="center">
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => goToIssueCertificate(student)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: "#17ae65",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          📄 Issue
                        </button>

                        <button
                          onClick={() => handleDelete(student)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: "#e63946",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
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