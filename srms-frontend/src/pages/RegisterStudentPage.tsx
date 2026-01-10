import { useState } from "react";
import { registerStudent } from "../api/studentApi";

export default function RegisterStudentPage() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    department: "",
    graduationYear: "",
    finalGrade: "",
    percentage: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const submit = async () => {
    try {
      setLoading(true);

      await registerStudent({
        studentId: form.studentId,
        name: form.name,
        email: form.email,
        department: form.department,
        graduationYear: Number(form.graduationYear),
        finalGrade: form.finalGrade,
        percentage: Number(form.percentage),
        password: form.password
      });

      alert("✅ Student registered successfully");

      setForm({
        studentId: "",
        name: "",
        email: "",
        department: "",
        graduationYear: "",
        finalGrade: "",
        percentage: "",
        password: ""
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f4f6fb",
        padding: "60px 20px"
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          padding: 40,
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ fontSize: 28 }}>Register New Student</h2>
        <p style={{ color: "#666", marginBottom: 30 }}>
          Create a student profile and temporary login credentials
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20
          }}
        >
          <input placeholder="Roll Number" value={form.studentId}
            onChange={e => update("studentId", e.target.value)} />

          <input placeholder="Full Name" value={form.name}
            onChange={e => update("fullName", e.target.value)} />

          <input placeholder="Email" value={form.email}
            onChange={e => update("email", e.target.value)} />

          <input placeholder="Department" value={form.department}
            onChange={e => update("department", e.target.value)} />

          <input type="number" placeholder="Graduation Year"
            value={form.graduationYear}
            onChange={e => update("graduationYear", e.target.value)} />

          <input placeholder="Final Grade"
            value={form.finalGrade}
            onChange={e => update("finalGrade", e.target.value)} />

          <input type="number" placeholder="Percentage"
            value={form.percentage}
            onChange={e => update("percentage", e.target.value)} />

          <input placeholder="Temporary Password"
            value={form.password}
            onChange={e => update("password", e.target.value)} />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            marginTop: 40,
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}
