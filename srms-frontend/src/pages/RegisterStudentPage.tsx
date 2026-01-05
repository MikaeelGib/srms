import { useState } from "react";
import { registerStudent } from "../api/studentApi";
import { useNavigate } from "react-router-dom";

export default function RegisterStudentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
    department: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerStudent(form);
      setSuccess("Student registered successfully");
      setForm({ studentId: "", name: "", email: "", department: "" });

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Register New Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="studentId"
          placeholder="Roll Number"
          value={form.studentId}
          onChange={handleChange}
          required
        />

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Registering..." : "Register Student"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
