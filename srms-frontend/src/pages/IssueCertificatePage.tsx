import { useState } from "react";
import { hashFile } from "../utils/hash";
import { addStudentRecord, addRecordOnChain } from "../api/studentApi";

export default function IssueCertificatePage() {
  const [studentId, setStudentId] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [hash, setHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const issueCertificate = async () => {
    if (!studentId || !certificate || !photo) {
      return alert("Student ID, certificate, and photo are required");
    }

    setLoading(true);
    setSuccess("");

    try {
      // 1. Hash certificate
      const fileHash = await hashFile(certificate);
      setHash(fileHash);

      const recordId = `CERT-${Date.now()}`;

      // 2. Save record in DB
      await addStudentRecord(studentId, {
        recordId,
        fileHash,
        issuerAdmin: "admin"
      });

      // 3. Push on blockchain
      const chainResult = await addRecordOnChain(studentId, recordId);
      setTxHash(chainResult.txHash);

      setSuccess("Certificate issued successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Issue Certificate</h2>

      <input
        placeholder="Student ID"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
      />

      <div>
        <label>Certificate PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={e => setCertificate(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label>Student Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files?.[0] || null)}
        />
      </div>

      {/* 👇 Photo preview = photo is now USED */}
      {photo && (
        <div style={{ marginTop: 10 }}>
          <p>Photo preview:</p>
          <img
            src={URL.createObjectURL(photo)}
            alt="Student"
            style={{ width: 120, borderRadius: 6 }}
          />
        </div>
      )}

      <button disabled={loading} onClick={issueCertificate}>
        {loading ? "Issuing..." : "Issue Certificate"}
      </button>

      {success && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Success</h3>
          <p><strong>Certificate Hash:</strong> {hash}</p>
          <p><strong>Blockchain Tx:</strong> {txHash}</p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${hash}`}
            alt="QR Code"
          />
        </div>
      )}
    </div>
  );
}
