import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import { Search, Filter, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import type { Student, Record as CertificateRecord } from "../types/Student";

const ITEMS_PER_PAGE = 8;

export default function RecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Data Ergonomics State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "issued" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [activeRecord, setActiveRecord] = useState<{ student: Student; record: CertificateRecord } | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const loadStudents = async () => {
    try {
      setStudents(await getAllStudents());
    } catch {
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const hasOnChainRecord = (student: Student) =>
    student.records.some(r => r.status === "on-chain");

  // ==========================
  // FILTERING & COUNTS
  // ==========================

  // Calculate counts for badges
  const counts = useMemo(() => ({
    all: students.length,
    issued: students.filter(s => s.records.length > 0).length,
    pending: students.filter(s => s.records.length === 0).length
  }), [students]);

  const filteredData = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      const hasRecords = student.records.length > 0;
      if (filterStatus === "issued") return hasRecords;
      if (filterStatus === "pending") return !hasRecords;

      return true;
    });
  }, [students, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ==========================
  // ACTIONS
  // ==========================

  const confirmDelete = async () => {
    if (!studentToDelete || !adminPassword) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteStudent(studentToDelete.studentId, adminPassword);
      setStudents(prev => prev.filter(s => s.studentId !== studentToDelete.studentId));
      setStudentToDelete(null);
      setAdminPassword("");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed"); 
    } finally {
      setIsDeleting(false);
    }
  };
  
  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Loading records…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl text-center mb-8 mt-4">
        <h2 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Student Records
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Manage, issue, and verify academic blockchain credentials.
        </p>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        
        {/* CONTROLS BAR */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
          
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by Name or Roll No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* FILTERS WITH BADGES */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(["all", "issued", "pending"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterStatus === status 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {status}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  filterStatus === status ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600"
                }`}>
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl min-h-[500px] flex flex-col">
          
          {paginatedData.length > 0 ? (
            <>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-800/30 text-slate-400">
                      <th className="px-6 py-4 text-left font-semibold">Student</th>
                      <th className="px-4 py-4 font-semibold text-center">Roll No</th>
                      <th className="px-4 py-4 font-semibold text-center">Department</th>
                      <th className="px-4 py-4 font-semibold text-center">Graduation</th>
                      <th className="px-4 py-4 font-semibold text-center text-emerald-400/80">Status</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(student =>
                      student.records.length > 0 ? (
                        student.records.map(record => (
                          <tr key={record.recordId} className="border-t border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-200">{student.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-tight">{student.email}</div>
                            </td>
                            <td className="px-4 py-4 text-center font-mono text-slate-300">{student.studentId}</td>
                            <td className="px-4 py-4 text-center text-slate-400">{student.department || "—"}</td>
                            <td className="px-4 py-4 text-center">{record.graduationYear ?? "—"}</td>
                            <td className="px-4 py-4 text-center">
                              <StatusPill status={record.status} />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                <GradientButton onClick={() => setActiveRecord({ student, record })}>
                                  View
                                </GradientButton>
                                <ActionButton 
                                  variant="danger" 
                                  disabled={hasOnChainRecord(student)} 
                                  onClick={() => setStudentToDelete(student)}
                                >
                                  Delete
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={student.studentId} className="border-t border-slate-800/50 hover:bg-slate-800/20">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-200">{student.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-tight">{student.email}</div>
                          </td>
                          <td className="px-4 py-4 text-center font-mono text-slate-300">{student.studentId}</td>
                          <td className="px-4 py-4 text-center text-slate-400">{student.department || "—"}</td>
                          <td className="px-4 py-4 text-center text-slate-600">—</td>
                          <td className="px-4 py-4 text-center">
                            <StatusPill status="pending" />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <ActionButton variant="success" onClick={() => navigate("/admin/issue", { state: { student } })}>
                                Issue
                              </ActionButton>
                              <ActionButton variant="danger" onClick={() => setStudentToDelete(student)}>
                                Delete
                              </ActionButton>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <span className="text-white font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-white font-mono">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="text-white font-mono">{filteredData.length}</span> students
                </span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-slate-600 py-20">
              <Filter className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-lg font-medium">No records found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-left">
            <button
              onClick={() => setActiveRecord(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-500 hover:text-white transition-all"
            >✕</button>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Academic Record</h3>
              <p className="text-slate-500 text-sm">Blockchain-verified credential</p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <Field label="Student" value={activeRecord.student.name} />
              <Field label="ID" value={activeRecord.student.studentId} />
              <Field label="Department" value={activeRecord.student.department || "—"} />
              <Field label="Year" value={activeRecord.record.graduationYear} />
              <Field label="GPA / %" value={activeRecord.record.percentage ? `${activeRecord.record.percentage}%` : "—"} />
              <Field label="Status">
                <StatusPill status={activeRecord.record.status} />
              </Field>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <GradientButton className="flex-1 py-3" onClick={() => window.open(`http://localhost:5000/api/files/public/certificate/${activeRecord.record.recordId}`)}>View Certificate</GradientButton>
                <GradientButton className="flex-1 py-3" onClick={() => window.open(`http://localhost:5000/api/files/public/report/${activeRecord.record.recordId}`)}>View Report</GradientButton>
              </div>
              {activeRecord.record.blockchainTxHash && (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${activeRecord.record.blockchainTxHash}`}
                  target="_blank" rel="noreferrer"
                  className="block text-center py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold hover:text-white transition-all"
                >
                  View on Blockchain
                </a>
              )}
              {/* Record Hash with copyHash functionality */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Record Hash</span>
                  <button
                    onClick={() => copyHash(activeRecord.record.recordId)}
                    className={`text-[10px] px-3 py-1 rounded-full font-bold transition-all ${
                      copied ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {copied ? "COPIED!" : "COPY HASH"}
                  </button>
                </div>
                <div className="p-3 bg-black rounded-lg text-[10px] font-mono break-all text-emerald-500/80 border border-emerald-500/10">
                  {activeRecord.record.recordId}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-lg px-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-950 border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
            <p className="text-slate-500 text-sm mb-6">Enter password to delete <span className="text-white">{studentToDelete.name}</span></p>
            
            <input 
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-500/30"
            />
            
            <div className="flex gap-3">
              <button onClick={() => setStudentToDelete(null)} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-slate-400 font-semibold">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
            {deleteError && <p className="mt-4 text-red-500 text-xs font-bold">{deleteError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// UI HELPER COMPONENTS
function GradientButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-s font-bold text-black transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/10 ${className}`}>
      {children}
    </button>
  );
}

function ActionButton({ children, onClick, variant, disabled }: { children: React.ReactNode; onClick: () => void; variant: 'danger' | 'success'; disabled?: boolean; }) {
  const styles = {
    danger: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-black"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-20 ${styles[variant]}`}>
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const themes: Record<string, string> = {
    "on-chain": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    pending: "bg-slate-800 text-slate-500 border-slate-700"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${themes[status] || themes.pending}`}>
      <span className={`w-1 h-1 rounded-full mr-2 ${status === 'on-chain' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
      {status}
    </span>
  );
}

function Field({ label, value, children }: { label: string; value?: string | number; children?: React.ReactNode; }) {
  return (
    <div>
      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{label}</span>
      <span className="text-slate-200 font-semibold">{children ?? (value || "—")}</span>
    </div>
  );
}
