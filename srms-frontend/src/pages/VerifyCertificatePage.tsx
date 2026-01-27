import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { VerifyResponse } from "../types/Verification";
import { Camera, Upload, ShieldCheck, ExternalLink, X, Copy, Check } from "lucide-react";

/* =======================
   HELPERS (PUBLIC)
======================= */

async function openPdf(url: string) {
  const res = await fetch(url);
  if (!res.ok) return alert("Failed to load document");
  window.open(URL.createObjectURL(await res.blob()), "_blank");
}

async function fetchImage(url: string) {
  const res = await fetch(url);
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
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!showScanner) return;
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      decoded => {
        setHash(decoded);
        setShowScanner(false);
        scanner.stop();
      },
      () => {}
    );
    return () => { scanner.stop().catch(() => {}); };
  }, [showScanner]);

  const handleQrUpload = async (file: File) => {
    setQrPreview(URL.createObjectURL(file));
    const scanner = new Html5Qrcode("qr-hidden");
    try {
      const decoded = await scanner.scanFile(file, true);
      setHash(decoded);
      setError("");
    } catch {
      setError("Invalid QR code");
    }
  };

  const verify = async () => {
    if (!hash) {
      setError("Please scan a QR code or enter a hash");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/students/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordHash: hash })
      });
      if (!res.ok) throw new Error("Verification failed: Record not found");
      setResult(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6 text-white selection:bg-emerald-500/30">
      <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Verify Credential</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Enter a certificate hash or scan a QR code to verify authenticity.
          </p>
        </div>

        {/* INPUT BOX */}
        <div className="relative mb-6 group">
          <input
            value={hash}
            onChange={e => setHash(e.target.value)}
            placeholder="0x... or Certificate Hash"
            className="w-full bg-black/40 border border-slate-700 rounded-2xl py-4 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
          />
          {hash && (
            <button onClick={copyHash} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ActionButton onClick={() => setShowScanner(true)}>
            <Camera size={18} />
            Scan QR
          </ActionButton>

          <label className="cursor-pointer group">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-bold text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-all">
              <Upload size={18} />
              Upload QR
            </div>
            <input hidden type="file" accept="image/*" onChange={e => e.target.files && handleQrUpload(e.target.files[0])} />
          </label>
        </div>

        {qrPreview && (
          <div className="mb-6 p-2 bg-white rounded-2xl w-32 mx-auto relative group">
            <img src={qrPreview} className="rounded-xl w-full" />
            <button onClick={() => setQrPreview(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={12} />
            </button>
          </div>
        )}

        <PrimaryButton onClick={verify} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
               <span>Validating...</span>
            </div>
          ) : "Verify Authenticity"}
        </PrimaryButton>

        {error && <p className="text-red-400 text-xs font-bold text-center mt-6 animate-pulse uppercase tracking-widest">{error}</p>}
      </div>

      {/* CAMERA MODAL */}
      {showScanner && (
        <Modal onClose={() => setShowScanner(false)}>
          <h3 className="text-lg font-bold mb-6">QR Scanner</h3>
          <div id="qr-reader" className="w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl border border-slate-700" />
        </Modal>
      )}

      {/* RESULT MODAL */}
      {result?.valid && (
        <Modal large onClose={() => setResult(null)}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <ShieldCheck size={14} /> Official Verified Record
            </div>
            
            <h3 className="text-3xl font-bold mb-2">Validation Success</h3>
            <p className="text-slate-400 text-sm mb-10">The following record has been cryptographically verified.</p>

            <div className="relative p-8 rounded-[2rem] bg-black/40 border border-slate-800 text-left mb-8 overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-sky-500" />
               
               <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Student Name</p>
                    <p className="text-sm font-semibold text-white">{result.student.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Roll Number</p>
                    <p className="text-sm font-semibold text-white">{result.student.studentId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Department</p>
                    <p className="text-sm font-semibold text-white">{result.student.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Date</p>
                    <p className="text-sm font-semibold text-white">{new Date(result.record.issueDate).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Verified on Ethereum Sepolia</span>
                  <a href={`https://sepolia.etherscan.io/tx/${result.record.blockchainTxHash}`} target="_blank" rel="noreferrer" className="text-sky-400 text-[10px] font-bold flex items-center gap-1 hover:text-sky-300 transition-colors">
                    VIEW RECEIPT <ExternalLink size={12} />
                  </a>
               </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <FileButton onClick={() => openPdf(`http://localhost:5000/api/files/public/certificate/${result.record.recordId}`)}>
                Certificate
              </FileButton>
              <FileButton onClick={() => openPdf(`http://localhost:5000/api/files/public/report/${result.record.recordId}`)}>
                Report Card
              </FileButton>
              <FileButton onClick={async () => setPreview({
                title: "Student Photo",
                url: await fetchImage(`http://localhost:5000/api/files/public/photo/${result.record.recordId}`)
              })}>
                Student Photo
              </FileButton>
            </div>
          </div>
        </Modal>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <Modal onClose={() => setPreview(null)}>
          <h3 className="text-lg font-bold mb-6 text-slate-100">{preview.title}</h3>
          <img src={preview.url} className="rounded-2xl max-w-full border border-slate-800 shadow-2xl mx-auto" />
        </Modal>
      )}

      <div id="qr-hidden" className="hidden" />
    </div>
  );
}

/* =======================
   COMPONENTS
======================= */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

const ActionButton = ({ children, ...p }: BtnProps) => (
  <button {...p} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95">
    {children}
  </button>
);

const PrimaryButton = ({ children, ...p }: BtnProps) => (
  <button {...p} className="w-full py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-sky-500 to-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center">
    {children}
  </button>
);

const FileButton = ({ children, ...p }: BtnProps) => (
  <button {...p} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95">
    {children}
  </button>
);

const Modal = ({ children, onClose, large }: { children: ReactNode; onClose: () => void; large?: boolean }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className={`relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 ${large ? "max-w-2xl" : "max-w-md"} w-full`}>
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
        <X size={24} />
      </button>
      {children}
    </div>
  </div>
);