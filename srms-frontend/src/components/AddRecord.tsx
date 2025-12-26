import { useState } from "react";

export default function AddRecord({ studentId }: { studentId: string }) {
  const [recordId, setRecordId] = useState("");

  async function submit() {
    await fetch(`http://localhost:5000/api/students/${studentId}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId }),
    });

    alert("Record added");
  }

  return (
    <div>
      <input
        placeholder="Record ID"
        value={recordId}
        onChange={(e) => setRecordId(e.target.value)}
      />
      <button onClick={submit}>Add Record</button>
    </div>
  );
}
