import { useEffect, useState } from "react";
import { getAllStudents, issueCertificate } from "../api/studentApi";
import type { Student } from "../types/Student";
import * as styles from "../styles/certificateStyles";

type IssueResult = {
  recordHash: string;
  txHash: string;
};

export default function IssueCertificatePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [certificate, setCertificate] = useState<File | null>(null);
  const [reportCard, setReportCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IssueResult | null>(null);

  useEffect(() => {
    getAllStudents().then(setStudents);
  }, []);

  const filteredStudents =
    query.length < 2
      ? []
      : students.filter(
          s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.studentId.toLowerCase().includes(query.toLowerCase())
        );

  const issue = async () => {
    if (!selectedStudent || !certificate || !reportCard || !photo) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    formData.append("certificate", certificate);
    formData.append("reportCard", reportCard);
    formData.append("photo", photo);
    formData.append("graduationYear", String(selectedStudent.graduationYear));
    formData.append("percentage", String(selectedStudent.percentage));

    try {
      setLoading(true);
      const res = await issueCertificate(selectedStudent.studentId, formData);
      setResult(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Issue Certificate
        </h2>

        {/* STUDENT AUTOCOMPLETE */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            style={styles.input}
            placeholder="Student name or roll number"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedStudent(null);
            }}
          />

          {filteredStudents.length > 0 && !selectedStudent && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                color: "#000",
                borderRadius: 10,
                marginTop: 6,
                maxHeight: 180,
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                zIndex: 10
              }}
            >
              {filteredStudents.map(s => (
                <div
                  key={s.studentId}
                  style={{
                    padding: 10,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee"
                  }}
                  onClick={() => {
                    setSelectedStudent(s);
                    setQuery(`${s.name} (${s.studentId})`);
                  }}
                >
                  <b>{s.name}</b>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {s.studentId} • {s.department}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FILE INPUTS */}
        <label style={styles.label}>Certificate PDF</label>
        <input type="file" accept=".pdf" onChange={e => setCertificate(e.target.files?.[0] || null)} />

        <label style={styles.label}>Report Card PDF</label>
        <input type="file" accept=".pdf" onChange={e => setReportCard(e.target.files?.[0] || null)} />

        <label style={styles.label}>Student Photo</label>
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />

        <button
          onClick={issue}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>

        {/* SUCCESS */}
        {result && (
          <div style={styles.resultBox}>
            <p><b>Record Hash</b></p>
            <code style={styles.code}>{result.recordHash}</code>

            <p><b>Transaction Hash</b></p>
            <code style={styles.code}>{result.txHash}</code>

            <img
              style={{ marginTop: 15 }}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${result.recordHash}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
