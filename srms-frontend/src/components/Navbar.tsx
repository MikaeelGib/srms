import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>

      {isAuthenticated() && isAdmin() && (
        <>
          <Link to="/students" style={{ marginRight: 12 }}>
            Students
          </Link>
          <Link to="/students/new" style={{ marginRight: 12 }}>
            Add Student
          </Link>
        </>
      )}

      {!isAuthenticated() ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}
