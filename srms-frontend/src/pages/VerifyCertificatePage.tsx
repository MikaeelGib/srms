import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getToken } from "../utils/auth";
import * as styles from "../styles/certificateStyles";
import type { VerifyResponse } from "../types/Verification";

/* =======================
   HELPERS
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

/* =======================
   PAGE
======================= */

export default function VerifyCertificatePage() {
  const [hash, setHash] = useState("");
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    downloadUrl: string;
    filename: string;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  /* =======================
     CAMERA SCAN
  ======================= */

  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      decodedText => {
        setHash(decodedText);
        setShowScanner(false);
        scanner.stop();
      },
      () => {}
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [showScanner]);

  /* =======================
     UPLOAD QR IMAGE
  ======================= */

  const handleQrUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setQrPreview(previewUrl);

    const scanner = new Html5Qrcode("qr-hidden");
    try {
      const decoded = await scanner.scanFile(file, true);
      setHash(decoded);
    } catch {
      setError("Invalid QR code");
    }
  };

  /* =======================
     VERIFY
  ======================= */

  const verify = async () => {
    if (!hash) return setError("Please scan a QR code or enter a certificate hash");

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("http://localhost:5000/api/students/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordHash: hash })
      });

      if (!res.ok) throw new Error("Verification failed");
      setResult(await res.json());
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Verify Certificate</h2>

        <p style={{ textAlign: "center", opacity: 0.85 }}>
          Verify certificates using QR code or hash
        </p>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={styles.buttonSecondary}
            onClick={() => setShowScanner(true)}
          >
            📷 Scan QR
          </button>

          <label style={{ ...styles.buttonSecondary, cursor: "pointer" }}>
            🖼 Upload QR
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={e =>
                e.target.files && handleQrUpload(e.target.files[0])
              }
            />
          </label>
        </div>

        {/* QR PREVIEW */}
        {qrPreview && (
          <img
            src={qrPreview}
            style={{
              marginTop: 15,
              width: 160,
              borderRadius: 12,
              display: "block",
              marginInline: "auto",
              background: "#fff"
            }}
          />
        )}

        {/* MANUAL */}
        <p style={{ textAlign: "center", marginTop: 15, opacity: 0.7 }}>
          or enter manually
        </p>

        <input
          placeholder="Certificate hash"
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

        {error && <p style={{ color: "#ffcccc" }}>{error}</p>}
      </div>

      {/* CAMERA MODAL */}
      {showScanner && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Scan QR Code</h3>
            <div id="qr-reader" style={{ width: 260 }} />
            <button
              style={{ ...styles.buttonPrimary, marginTop: 15 }}
              onClick={() => setShowScanner(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {result?.valid && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>✅ Certificate Verified</h3>

            <p><b>Name:</b> {result.student.name}</p>
            <p><b>Roll No:</b> {result.student.studentId}</p>
            <p><b>Department:</b> {result.student.department}</p>
            <p><b>Graduation Year:</b> {result.record.graduationYear}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button
                style={styles.buttonSecondary}
                onClick={() =>
                  openPdf(
                    `http://localhost:5000/api/files/certificate/${result.record.recordId}`
                  )
                }
              >
                Certificate
              </button>

              <button
                style={styles.buttonSecondary}
                onClick={() =>
                  openPdf(
                    `http://localhost:5000/api/files/report/${result.record.recordId}`
                  )
                }
              >
                Report Card
              </button>

              <button
                style={styles.buttonSecondary}
                onClick={async () =>
                  setPreview({
                    url: await fetchImage(
                      `http://localhost:5000/api/files/photo/${result.record.recordId}`
                    ),
                    title: "Student Photo",
                    downloadUrl: `http://localhost:5000/api/files/photo/${result.record.recordId}`,
                    filename: "student-photo.jpg"
                  })
                }
              >
                Photo
              </button>
            </div>

            <button
              style={{ ...styles.buttonPrimary, marginTop: 20 }}
              onClick={() => setResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

        {/* PHOTO PREVIEW MODAL */}
        {preview && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <button
                onClick={() => setPreview(null)}
                style={{
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
                }}
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

            
            </div>
          </div>
        )}

      {/* INVALID */}
      {result && !result.valid && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>❌ Invalid Certificate</h3>
            <p>This certificate could not be verified.</p>

            <button
              style={{ ...styles.buttonPrimary, marginTop: 20 }}
              onClick={() => setResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* hidden scanner for image decode */}
      <div id="qr-hidden" style={{ display: "none" }} />
    </div>
  );
}