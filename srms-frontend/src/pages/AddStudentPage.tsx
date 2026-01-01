import { useState } from "react";

export default function AddStudentPage() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, name, department }),
    });

    alert("Student added");
    setStudentId("");
    setName("");
    setDepartment("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Student</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <br />

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
