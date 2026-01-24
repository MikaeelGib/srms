import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { isAuthenticated, isAdmin } from "../utils/auth";
import * as styles from "../styles/certificateStyles";

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(isAdmin() ? "/admin" : "/student/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await login(identifier, password, role);
      navigate(role === "admin" ? "/admin" : "/student/dashboard");
    } catch (err: unknown) {
      let message = "Invalid credentials";
      const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";

      if (isObject(err) && "response" in err) {
        try {
          const resp = (err as { response?: unknown }).response;
          if (isObject(resp) && "data" in resp) {
            const data = (resp as { data?: unknown }).data;
            const maybeMessage = isObject(data) && "message" in data ? (data as { message?: unknown }).message : undefined;
            if (typeof maybeMessage === "string") {
              message = maybeMessage;
            }
          }
        } catch {
          // ignore and use default message
        }
      } else if (isObject(err) && "message" in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string") message = maybeMessage;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: "center" }}>
          {role === "admin" ? "Admin Login" : "Student Login"}
        </h2>

        {error && (
          <div style={{ marginTop: 10, color: "#ffd166" }}>{error}</div>
        )}

        {/* ROLE SWITCH */}
        <div style={{ marginTop: 15 }}>
          <label style={styles.label}>Login As</label>
          <select
            value={role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRole(e.target.value as "admin" | "student")
            }
            style={styles.input}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* IDENTIFIER */}
        <label style={styles.label}>
          {role === "admin" ? "Admin Email" : "Roll Number"}
        </label>
        <input
          style={styles.input}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={role === "admin" ? "admin@example.com" : "2024001"}
        />

        {/* PASSWORD */}
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.buttonPrimary, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}