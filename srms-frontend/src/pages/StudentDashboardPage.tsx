import { useEffect, useState } from "react";
import * as styles from "../styles/certificateStyles";
import { getUser, getToken } from "../utils/auth";
import type { Student } from "../types/Student";

/* =======================
   FILE HELPERS
======================= */

// PDFs → open in new tab
async function openPdf(url: string) {
  const token = getToken();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert("Failed to load PDF");
    return;
  }

  const blobUrl = URL.createObjectURL(await res.blob());
  window.open(blobUrl, "_blank");
}

// Images → modal preview
async function fetchImage(url: string) {
  const token = getToken();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Failed to load image");

  return URL.createObjectURL(await res.blob());
}

// Download helper
async function downloadFile(url: string, filename: string) {
  const token = getToken();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert("Failed to download file");
    return;
  }

  const blobUrl = URL.createObjectURL(await res.blob());

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  a.remove();
  URL.revokeObjectURL(blobUrl);
}

/* =======================
   PAGE
======================= */

export default function StudentDashboardPage() {
  const user = getUser();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/students/${user.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(setStudent)
      .catch(() => alert("Failed to load student dashboard"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>Loading your certificates...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>No student data found</div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={{ ...styles.card, width: "95%", maxWidth: 1100 }}>
        <h2 style={{ marginBottom: 25 }}>🎓 My Digital Certificates</h2>

        {student.records.map(record => (
          <div
            key={record.recordId}
            style={{
              background: "#00000055",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20
            }}
          >
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>{student.name}</h3>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  {student.department} • Class of {record.graduationYear}
                </div>
              </div>

              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#22c55e",
                  color: "#000"
                }}
              >
                {record.status.toUpperCase()}
              </div>
            </div>

            <div
              style={{
                marginTop: 15,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 14
              }}
            >

              <div><b>Percentage:</b> {record.percentage}%</div>
              <div>
                <b>Record Hash:</b>
                <div style={{ fontSize: 12, wordBreak: "break-all" }}>
                  {record.recordId}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
              <button
                style={buttonStyle}
                onClick={() =>
                  openPdf(`http://localhost:5000/api/files/certificate/${record.recordId}`)
                }
              >
                 View Certificate
              </button>

              <button
                style={buttonStyle}
                onClick={() =>
                  openPdf(`http://localhost:5000/api/files/report/${record.recordId}`)
                }
              >
                 View Report Card
              </button>

              <button
                style={buttonStyle}
                onClick={async () =>
                  setPreview({
                    url: await fetchImage(
                      `http://localhost:5000/api/files/photo/${record.recordId}`
                    ),
                    title: "Student Photo",
                    downloadUrl: `http://localhost:5000/api/files/photo/${record.recordId}`,
                    filename: "student-photo.jpg"
                  })
                }
              >
                 View Photo
              </button>

              <button
                style={buttonStyle}
                onClick={async () =>
                  setPreview({
                    url: await fetchImage(
                      `http://localhost:5000/api/files/qr/${record.recordId}`
                    ),
                    title: "QR Code",
                    downloadUrl: `http://localhost:5000/api/files/qr/${record.recordId}`,
                    filename: "certificate-qr.png"
                  })
                }
              >
                 View QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {preview && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setPreview(null)}
              style={closeButton}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: 12 }}>{preview.title}</h3>

            <img
              src={preview.url}
              style={{
                maxWidth: "100%",
                borderRadius: 12,
                background: "#f1f5f9",
                display: "block",
                margin: "0 auto"
              }}
            />

            <button
              style={{ ...buttonStyle, marginTop: 18, width:"fit-content"}}
              onClick={() =>
                downloadFile(preview.downloadUrl, preview.filename)
              }
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   STYLES
======================= */

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  background: "linear-gradient(135deg, #f97316, #ef4444)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  cursor: "pointer"
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999
};

const modalCard: React.CSSProperties = {
  position: "relative",
  background: "#ffffff",
  color: "#0f172a",
  padding: 24,
  borderRadius: 18,
  maxWidth: 420,
  width: "92%",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const closeButton: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#e5e7eb",
  color: "#111827",
  fontSize: 16,
  cursor: "pointer"
};