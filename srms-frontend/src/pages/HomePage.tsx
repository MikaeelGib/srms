import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Access Your Portal</h1>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("/login")}>
          <h3>Admin Panel</h3>
          <p>Issue certificates and manage students</p>
          <button>Enter Admin</button>
        </div>

        <div style={styles.card}>
          <h3>Verifier</h3>
          <p>Verify certificate authenticity</p>
          <button disabled>Enter Verifier</button>
        </div>

        <div style={styles.card}>
          <h3>Student Portal</h3>
          <p>View and download certificates</p>
          <button disabled>Enter Student</button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "80vh",
    padding: 40,
    textAlign: "center",
  },
  title: {
    marginBottom: 40,
  },
  grid: {
    display: "flex",
    gap: 24,
    justifyContent: "center",
  },
  card: {
    width: 260,
    padding: 20,
    borderRadius: 12,
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "#fff",
    cursor: "pointer",
  },
};
