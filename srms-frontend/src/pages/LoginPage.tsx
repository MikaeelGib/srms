import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { isAuthenticated } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in → redirect
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/students");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/students");
    } catch (err: unknown) {
      // Narrow unknown error to a shape that may come from the API (e.g. axios)
      type ApiError = { response?: { data?: { message?: string } } };
      const apiErr = err as ApiError;
      const message = apiErr?.response?.data?.message ?? (err instanceof Error ? err.message : undefined);
      setError(message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 360,
    padding: 24,
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12,
  },
  input: {
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 12,
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    backgroundColor: "#1976d2",
    color: "#fff",
  },
  error: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    fontSize: 14,
  },
};
