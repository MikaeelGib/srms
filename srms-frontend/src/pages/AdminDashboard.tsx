import { useNavigate } from "react-router-dom";
import { LuUserPlus, LuFileCheck } from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cardBase: React.CSSProperties = {
    borderRadius: 16,
    padding: 30,
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 180
  };

  const cardHover = (el: HTMLDivElement, hover: boolean) => {
    el.style.transform = hover ? "translateY(-8px)" : "translateY(0)";
    el.style.boxShadow = hover
      ? "0 20px 40px rgba(0,0,0,0.12)"
      : "0 10px 30px rgba(0,0,0,0.08)";
  };

  const iconStyle: React.CSSProperties = {
    fontSize: 42,
    color: "#2563eb",
    marginBottom: 10
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(135deg, #f5f7fa, #e9eef5)",
        padding: "60px 20px"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#555", marginBottom: 50 }}>
          Manage students, certificates, and blockchain records
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 30
          }}
        >
          {/* Register Student */}
          <div
            style={cardBase}
            onClick={() => navigate("/admin/register")}
            onMouseEnter={e => cardHover(e.currentTarget, true)}
            onMouseLeave={e => cardHover(e.currentTarget, false)}
          >
            <div>
              <LuUserPlus style={iconStyle} />
              <h2 style={{ margin: "10px 0 8px" }}>
                Register Student
              </h2>
              <p style={{ color: "#666" }}>
                Add new students with academic details
              </p>
            </div>

            <span style={{ color: "#2563eb", fontWeight: 500 }}>
              Get started →
            </span>
          </div>

          {/* Issue Certificate */}
          <div
            style={cardBase}
            onClick={() => navigate("/admin/issue")}
            onMouseEnter={e => cardHover(e.currentTarget, true)}
            onMouseLeave={e => cardHover(e.currentTarget, false)}
          >
            <div>
              <LuFileCheck style={iconStyle} />
              <h2 style={{ margin: "10px 0 8px" }}>
                Issue Certificate
              </h2>
              <p style={{ color: "#666" }}>
                Upload certificates & push to blockchain
              </p>
            </div>

            <span style={{ color: "#2563eb", fontWeight: 500 }}>
              Issue now →
            </span>
          </div>

          {/* View Records */}
          <div
            style={cardBase}
            onClick={() => navigate("/admin/records")}
            onMouseEnter={e => cardHover(e.currentTarget, true)}
            onMouseLeave={e => cardHover(e.currentTarget, false)}
          >
            <div>
              <FiBarChart style={iconStyle} />
              <h2 style={{ margin: "10px 0 8px" }}>
                View Records
              </h2>
              <p style={{ color: "#666" }}>
                Browse all issued student certificates
              </p>
            </div>

            <span style={{ color: "#2563eb", fontWeight: 500 }}>
              View records →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
