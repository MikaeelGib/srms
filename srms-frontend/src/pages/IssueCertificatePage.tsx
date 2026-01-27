import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllStudents, issueCertificate } from "../api/studentApi";
import type { Student } from "../types/Student";

type IssueResult = {
  recordHash: string;
  txHash: string;
};

export default function IssueCertificatePage() {
  const location = useLocation();
  const routedStudent = (location.state as { student?: Student })?.student;

  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [certificate, setCertificate] = useState<File | null>(null);
  const [reportCard, setReportCard] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [graduationYear, setGraduationYear] = useState("");
  const [percentage, setPercentage] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<IssueResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    getAllStudents().then(setStudents);
  }, []);

  useEffect(() => {
    if (routedStudent) {
      setSelectedStudent(routedStudent);
      setQuery(`${routedStudent.name} (${routedStudent.studentId})`);
    }
  }, [routedStudent]);

  const filteredStudents =
    query.length < 2 || selectedStudent
      ? []
      : students.filter(
          s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.studentId.toLowerCase().includes(query.toLowerCase())
        );

  // LOGIC: Restrict Percentage to 0-100
  const handlePercentageChange = (val: string) => {
    if (val === "") return setPercentage("");
    const num = parseFloat(val);
    if (num >= 0 && num <= 100) setPercentage(val);
  };

  // LOGIC: Restrict Year to 4 digits (e.g., 2024)
  const handleYearChange = (val: string) => {
    if (val === "") return setGraduationYear("");
    // Only allow digits and max 4 characters
    if (/^\d{0,4}$/.test(val)) {
      setGraduationYear(val);
    }
  };

  const issue = async () => {
    setConfirmOpen(false);
    setError(null);
    setResult(null);
    setProgress(0);

    if (!selectedStudent || !certificate || !reportCard || !photo || !graduationYear || !percentage) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("certificate", certificate);
    formData.append("reportCard", reportCard);
    formData.append("photo", photo);
    formData.append("graduationYear", graduationYear);
    formData.append("percentage", percentage);

    try {
      setLoading(true);
      setProgress(20);
      await new Promise(r => setTimeout(r, 400));
      setProgress(45);
      const res = await issueCertificate(selectedStudent.studentId, formData);
      setProgress(80);
      await new Promise(r => setTimeout(r, 300));
      setProgress(100);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  const numberInputClass = "rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl overflow-visible">

        <h2 className="text-3xl font-extrabold text-center mb-2">Issue Certificate</h2>
        <p className="text-center text-sm text-slate-400 mb-6">Upload documents and publish to blockchain</p>

        {error && <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm p-3">{error}</div>}

        <div className="relative mb-5 z-50">
          <input
            value={query}
            disabled={!!selectedStudent}
            placeholder="Student name or roll number"
            onChange={e => { setQuery(e.target.value); setSelectedStudent(null); }}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          {filteredStudents.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-52 overflow-y-auto z-[9999]">
              {filteredStudents.map(s => (
                <div key={s.studentId} onClick={() => { setSelectedStudent(s); setQuery(`${s.name} (${s.studentId})`); }} className="px-4 py-3 cursor-pointer hover:bg-slate-800 transition">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.studentId} • {s.department}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Graduation Year (YYYY)" value={graduationYear} onChange={e => handleYearChange(e.target.value)} className={numberInputClass} />
          <input type="number" placeholder="Percentage (0-100)" value={percentage} onChange={e => handlePercentageChange(e.target.value)} className={numberInputClass} />
        </div>

        <div className="mt-4 space-y-3">
          <FileUpload label="Certificate" file={certificate} accept="application/pdf" onSelect={setCertificate} />
          <FileUpload label="Report Card" file={reportCard} accept="application/pdf" onSelect={setReportCard} />
          <FileUpload label="Student Photo" file={photo} accept="image/*" onSelect={setPhoto} />
        </div>

        <button onClick={() => setConfirmOpen(true)} disabled={loading} className="w-full mt-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 transition active:scale-95 disabled:opacity-60">
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>

        {loading && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {result && (
          <div className="relative mt-6 p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-center">
            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-xl" />
            <p className="font-semibold">Certificate Issued Successfully</p>
            <img className="mx-auto mt-4 bg-white p-2 rounded-lg" src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${result.recordHash}`} alt="QR" />
            <p className="mt-3 text-xs break-all text-emerald-300 font-mono">{result.recordHash}</p>
          </div>
        )}
      </div>

      {confirmOpen && <ConfirmModal onCancel={() => setConfirmOpen(false)} onConfirm={issue} student={selectedStudent} year={graduationYear} percentage={percentage} />}
    </div>
  );
}

/* =======================
   SUB-COMPONENTS
======================= */

function FileUpload({ label, file, accept, onSelect }: { label: string; file: File | null; accept: string; onSelect: (f: File | null) => void; }) {
  return (
    <label className="block cursor-pointer">
      <div className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 hover:bg-slate-700 transition flex justify-between items-center text-sm">
        <span className={file ? "text-emerald-400" : ""}>{file ? file.name : label}</span>
        <span className="text-xs text-slate-400">{file ? "Replace" : "Select"}</span>
      </div>
      <input hidden type="file" accept={accept} onChange={e => onSelect(e.target.files?.[0] || null)} />
    </label>
  );
}

function ConfirmModal({ onCancel, onConfirm, student, year, percentage }: { onCancel: () => void; onConfirm: () => void; student: Student | null; year: string; percentage: string; }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-[92%] text-center">
        <h3 className="text-xl font-bold mb-2">Confirm Issuance</h3>
        <p className="text-sm text-slate-400 mb-4">This will permanently write to the blockchain</p>
        <div className="text-sm text-left mb-6 space-y-1">
          <p><b>Student:</b> {student?.name}</p>
          <p><b>Year:</b> {year}</p>
          <p><b>Percentage:</b> {percentage}%</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:brightness-110 transition">Confirm</button>
        </div>
      </div>
    </div>
  );
}