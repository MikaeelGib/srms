import { useState } from "react";
import { registerStudent } from "../api/studentApi";
import * as styles from "../styles/certificateStyles";

const INITIAL_FORM = {
  studentId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  department: "",
  password: ""
};

export default function RegisterStudentPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const generatePassword = () => {
    setError(null);

    if (!form.studentId.trim()) {
      setError("Enter roll number first to generate password");
      return;
    }

    update("password", form.studentId.trim());
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);

    const {
      studentId,
      firstName,
      middleName,
      lastName,
      email,
      department,
      password
    } = form;

    /* ---------- FRONTEND VALIDATION ---------- */

    if (
      !studentId.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !department.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    try {
      setLoading(true);

      await registerStudent({
        studentId: studentId.trim(),
        name: fullName,
        email: email.trim(),
        department: department.trim(),
        password: password.trim()
      });

      setSuccess("✅ Student registered successfully");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={{ ...styles.card, width: 560 }}>
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>
          Register New Student
        </h2>

        <p style={{ textAlign: "center", opacity: 0.85, marginBottom: 25 }}>
          Create a student profile and login credentials
        </p>

        {success && (
          <div style={styles.resultBox}>
            <strong>{success}</strong>
          </div>
        )}

        {error && (
          <div style={{ ...styles.resultBox, background: "#ff000055" }}>
            <strong>{error}</strong>
          </div>
        )}

        <label style={styles.label}>Roll Number *</label>
        <input
          style={styles.input}
          value={form.studentId}
          onChange={e => update("studentId", e.target.value)}
        />

        <label style={styles.label}>First Name *</label>
        <input
          style={styles.input}
          value={form.firstName}
          onChange={e => update("firstName", e.target.value)}
        />

        <label style={styles.label}>Middle Name</label>
        <input
          style={styles.input}
          value={form.middleName}
          onChange={e => update("middleName", e.target.value)}
        />

        <label style={styles.label}>Last Name *</label>
        <input
          style={styles.input}
          value={form.lastName}
          onChange={e => update("lastName", e.target.value)}
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          value={form.email}
          onChange={e => update("email", e.target.value)}
        />

        <label style={styles.label}>Department *</label>
        <input
          style={styles.input}
          value={form.department}
          onChange={e => update("department", e.target.value)}
        />

        <label style={styles.label}>Temporary Password *</label>

        {/* PASSWORD + SMALL BUTTON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <input
            type="password"
            style={styles.input}
            value={form.password}
            onChange={e => update("password", e.target.value)}
          />

          <button
            type="button"
            onClick={generatePassword}
            style={{
              padding: "8px 12px",
              fontSize: 13,
              whiteSpace: "nowrap",
              height: 40
            }}
          >
            Use Roll #
          </button>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            opacity: loading ? 0.7 : 1,
            marginTop: 20
          }}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}