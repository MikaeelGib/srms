import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Admin Panel</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <button onClick={() => navigate("/admin/register")}>
          Register New Student
        </button>

        <button onClick={() => navigate("/admin/issue")}>
          Issue Certificate
        </button>

        <button onClick={() => navigate("/admin/records")}>
          View All Records
        </button>
      </div>
    </div>
  );
}
