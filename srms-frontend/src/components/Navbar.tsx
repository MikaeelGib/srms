import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: 12 }}>Home</Link>
      <Link to="/students" style={{ marginRight: 12 }}>Students</Link>
      <Link to="/students/new">Add Student</Link>
    </nav>
  );
}
