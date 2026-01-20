import { useState } from "react";
import * as styles from "../styles/certificateStyles";
import type { VerifyResponse } from "../types/Verification";


export default function VerifyCertificatePage() {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState("");

  const verify = async () => {
    if (!hash) return setError("Please enter or scan a certificate hash");

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordHash: hash })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error).message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Verify Certificate
        </h2>

        <input
          placeholder="Paste certificate hash or scan QR"
          value={hash}
          onChange={e => setHash(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={verify}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>

        {error && (
          <p style={{ color: "#ffcccc", marginTop: 15 }}>{error}</p>
        )}

        {result?.valid && (
          <div style={styles.resultBox}>
            <p><b>Name:</b> {result.student.name}</p>
            <p><b>Roll No:</b> {result.student.studentId}</p>
            <p><b>Department:</b> {result.student.department}</p>
            <p><b>Graduation Year:</b> {result.record.graduationYear}</p>
            <p><b>Issued:</b> {new Date(result.record.issuedAt).toDateString()}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <a href={result.record.certUrl} target="_blank">
                <button>Certificate</button>
              </a>
              <a href={result.record.reportCardUrl} target="_blank">
                <button>Report Card</button>
              </a>
              <a href={result.record.photoUrl} target="_blank">
                <button>Photo</button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
