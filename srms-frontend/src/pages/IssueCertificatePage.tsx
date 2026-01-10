import { useEffect, useState } from "react";
import { getAllStudents, issueCertificate } from "../api/studentApi";
import type { Student } from "../types/Student";

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
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(135deg, #04a4ef, #02396f)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        style={{
          width: 420,
          background: "linear-gradient(135deg, #1fe29e, #005b7f)",
          borderRadius: 20,
          padding: 50,
          color: "#fff",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Issue New Certificate
        </h2>

        {/* STUDENT AUTOCOMPLETE */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input
            placeholder="Student name or roll number"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedStudent(null);
            }}
            style={inputStyle}
          />

          {filteredStudents.length > 0 && !selectedStudent && (
            <div style={dropdownStyle}>
              {filteredStudents.map(s => (
                <div
                  key={s.studentId}
                  style={optionStyle}
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
        <label style={labelStyle}>Certificate PDF</label>
        <input type="file" accept=".pdf" onChange={e => setCertificate(e.target.files?.[0] || null)} />

        <label style={labelStyle}>Report Card PDF</label>
        <input type="file" accept=".pdf" onChange={e => setReportCard(e.target.files?.[0] || null)} />

        <label style={labelStyle}>Student Photo</label>
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />

        <button
          onClick={issue}
          disabled={loading}
          style={{
            marginTop: 25,
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>

        {/* SUCCESS */}
        {result && (
          <div style={{ marginTop: 30, background: "#00000055", padding: 16, borderRadius: 12 }}>
            <p><b>Record Hash</b></p>
            <code style={codeStyle}>{result.recordHash}</code>

            <p><b>Transaction</b></p>
            <code style={codeStyle}>{result.txHash}</code>

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

/* ---------- styles ---------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  outline: "none",
  fontSize: 14
};

const dropdownStyle: React.CSSProperties = {
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
};

const optionStyle: React.CSSProperties = {
  padding: 10,
  cursor: "pointer",
  borderBottom: "1px solid #eee"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  marginTop: 15,
  marginBottom: 6
};

const codeStyle: React.CSSProperties = {
  display: "block",
  wordBreak: "break-all",
  fontSize: 12
};
