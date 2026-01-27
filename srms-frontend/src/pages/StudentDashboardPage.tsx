import { useEffect, useState } from "react";
import { getUser, getToken } from "../utils/auth";
import type { Student } from "../types/Student";
import { ExternalLink, Copy, Check, X, Mail,  } from "lucide-react";

/* =======================
   FILE HELPERS
======================= */

async function openPdf(url: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) return alert("Failed to load PDF");
  window.open(URL.createObjectURL(await res.blob()), "_blank");
}

async function fetchImage(url: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Failed to load image");
  return URL.createObjectURL(await res.blob());
}

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) return alert("Failed to download");

  const blobUrl = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.click();
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
    downloadUrl?: string;
    filename?: string;
  } | null>(null);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/students/${user.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(setStudent)
      .finally(() => setLoading(false));
  }, [user]);

  const handleEmailShare = (recordId: string) => {
    const subject = encodeURIComponent("My Verified Academic Record Hash");
    const body = encodeURIComponent(`Hello,\n\nPlease find my blockchain-verified record hash below for verification purposes:\n\nRecord Hash: ${recordId}\n\nYou can verify this on the official portal.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm tracking-widest">
        LOADING_SECURE_DATA...
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-6 text-white selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="text-2xl font-bold mb-8 tracking-tight">Academic Records</h2>

        <div className="space-y-6">
          {student.records.map(record => (
            <div
              key={record.recordId}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl transition-all hover:border-slate-700"
            >
              {/* HEADER: Name and Status Pill */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{student.name}</h3>
                  <p className="text-sm text-slate-500">Class of {record.graduationYear}</p>
                </div>

                <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  {record.status.toUpperCase()}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Department</p>
                  <p className="text-sm font-semibold text-slate-200">{student.department}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Percentage Score</p>
                  <p className="text-sm font-semibold text-slate-200">{record.percentage}%</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Record Hash</p>
                  <div className="flex items-center gap-3 bg-black/30 w-fit p-2 px-3 rounded-xl border border-slate-800">
                    <code className="text-xs text-slate-400 break-all leading-tight">
                      {record.recordId}
                    </code>
                    <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(record.recordId);
                          setCopiedHash(record.recordId);
                          setTimeout(() => setCopiedHash(null), 1500);
                        }}
                        className="p-1.5 text-slate-500 hover:text-white transition-colors"
                        title="Copy Hash"
                      >
                        {copiedHash === record.recordId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => handleEmailShare(record.recordId)}
                        className="p-1.5 text-slate-500 hover:text-sky-400 transition-colors"
                        title="Share via Email"
                      >
                        <Mail size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (At the bottom) */}
              <div className="flex flex-wrap gap-3 mb-8">
                <ActionBtn onClick={() => openPdf(`http://localhost:5000/api/files/certificate/${record.recordId}`)}>
                  View Certificate
                </ActionBtn>
                <ActionBtn onClick={() => openPdf(`http://localhost:5000/api/files/report/${record.recordId}`)}>
                  View Report
                </ActionBtn>
                <ActionBtn onClick={async () => setPreview({
                  url: await fetchImage(`http://localhost:5000/api/files/photo/${record.recordId}`),
                  title: "Student Photo"
                })}>
                  Photo
                </ActionBtn>
                <ActionBtn onClick={async () => setPreview({
                  url: await fetchImage(`http://localhost:5000/api/files/qr/${record.recordId}`),
                  title: "Verification QR",
                  downloadUrl: `http://localhost:5000/api/files/qr/${record.recordId}`,
                  filename: "verify-qr.png"
                })}>
                  QR Code
                </ActionBtn>
              </div>

              {/* FOOTER: Blockchain Link */}
              <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    Verified on Ethereum Sepolia
                 </div>
                 <a
                  href={`https://sepolia.etherscan.io/tx/${record.blockchainTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors tracking-tighter"
                >
                  BLOCKCHAIN RECEIPT <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {preview && (
        <Modal onClose={() => setPreview(null)}>
          <h3 className="text-lg font-bold mb-6 text-slate-100 text-center">{preview.title}</h3>
          <img src={preview.url} className="rounded-2xl max-w-full max-h-[60vh] mx-auto border border-slate-800" />
          {preview.downloadUrl && (
            <button
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-black font-bold text-sm shadow-lg hover:scale-[1.02] transition-all"
              onClick={() => downloadFile(preview.downloadUrl!, preview.filename!)}
            >
              Download 
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

/* =======================
   REUSABLES
======================= */

function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-slate-800 transition-all active:scale-95"
    >
      {children}
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-[2rem] max-w-md w-full animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}