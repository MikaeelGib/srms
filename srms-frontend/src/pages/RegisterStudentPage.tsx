import { useState } from "react";
import { registerStudent } from "../api/studentApi";
import * as styles from "../styles/certificateStyles";

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

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

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
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={{ ...styles.card, width: 520 }}>
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>
          Register New Student
        </h2>
        <p style={{ textAlign: "center", opacity: 0.85, marginBottom: 25 }}>
          Create a student profile and login credentials
        </p>

        <label style={styles.label}>Roll Number</label>
        <input
          style={styles.input}
          placeholder="e.g. 22015021"
          value={form.studentId}
          onChange={e => update("studentId", e.target.value)}
        />

        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          placeholder="Student full name"
          value={form.name}
          onChange={e => update("name", e.target.value)} 
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          placeholder="student@email.com"
          value={form.email}
          onChange={e => update("email", e.target.value)}
        />

        <label style={styles.label}>Department</label>
        <input
          style={styles.input}
          placeholder="ITWT"
          value={form.department}
          onChange={e => update("department", e.target.value)}
        />

        <label style={styles.label}>Graduation Year</label>
        <input
          style={styles.input}
          type="number"
          placeholder="2025"
          value={form.graduationYear}
          onChange={e => update("graduationYear", e.target.value)}
        />

        <label style={styles.label}>Final Grade</label>
        <input
          style={styles.input}
          placeholder="First Class"
          value={form.finalGrade}
          onChange={e => update("finalGrade", e.target.value)}
        />

        <label style={styles.label}>Percentage</label>
        <input
          style={styles.input}
          type="number"
          placeholder="70"
          value={form.percentage}
          onChange={e => update("percentage", e.target.value)}
        />

        <label style={styles.label}>Temporary Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Auto-generated or manual"
          value={form.password}
          onChange={e => update("password", e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}
