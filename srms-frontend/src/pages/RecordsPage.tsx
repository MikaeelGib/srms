import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import { Search, Filter, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import type { Student, Record as CertificateRecord } from "../types/Student";

/* =======================
   PAGE
======================= */

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

  // Reset page when filters change
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
  //  FILTERING & PAGINATION
  // ==========================

  const filteredData = useMemo(() => {
    return students.filter(student => {
      // 1. Search Logic
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filter Tab Logic
      const hasRecords = student.records.length > 0;
      if (filterStatus === "issued") return hasRecords;
      if (filterStatus === "pending") return !hasRecords;

      return true; // 'all'
    });
  }, [students, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ==========================
  //  ACTIONS
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
    }   finally {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-medium">Loading records…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-6 text-white flex flex-col items-center">
      
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
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl backdrop-blur-sm">
          
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by Name or Roll No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* FILTERS */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(["all", "issued", "pending"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterStatus === status 
                    ? "bg-slate-700 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-fade-in min-h-[500px] flex flex-col">
          
          {paginatedData.length > 0 ? (
            <>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-300">
                      <th className="px-6 py-4 text-left font-semibold">Student</th>
                      <th className="px-4 py-4 font-semibold text-center">Roll No</th>
                      <th className="px-4 py-4 font-semibold text-center">Department</th>
                      <th className="px-4 py-4 font-semibold text-center">Graduation</th>
                      <th className="px-4 py-4 font-semibold text-center text-emerald-400">Status</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(student =>
                      student.records.length > 0 ? (
                        student.records.map(record => (
                          <tr
                            key={record.recordId}
                            className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                          >
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
                        <tr key={student.studentId} className="border-t border-slate-800/50 hover:bg-slate-800/30">
                          <td className="px-6 py-4 font-medium text-slate-200">{student.name}</td>
                          <td className="px-4 py-4 text-center font-mono text-slate-300">{student.studentId}</td>
                          <td className="px-4 py-4 text-center text-slate-400">{student.department || "—"}</td>
                          <td colSpan={2} className="px-4 py-4 text-slate-600 italic text-center text-xs">
                            No certificate issued
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
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing <span className="text-white font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-white font-mono">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="text-white font-mono">{filteredData.length}</span> students
                </span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-slate-500 py-20">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No records found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* =======================
          MODALS
      ======================= */}

      {/* VIEW RECORD MODAL */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl animate-slide-up text-left">
            <button
              onClick={() => setActiveRecord(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-90"
            >
              ✕
            </button>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Academic Record</h3>
              <p className="text-slate-400 text-sm">Official blockchain-verified credential details</p>
            </div>

            <div className="border border-slate-700/50 rounded-2xl p-6 bg-slate-800/30">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <Field label="Student Name" value={activeRecord.student.name} />
                <Field label="Roll Number" value={activeRecord.student.studentId} />
                <Field label="Department" value={activeRecord.student.department || "—"} />
                <Field label="Graduation Year" value={activeRecord.record.graduationYear} />
                <Field label="Academic Percentage" value={activeRecord.record.percentage ? `${activeRecord.record.percentage}%` : "—"} />
                <Field label="Current Status">
                  <StatusPill status={activeRecord.record.status} />
                </Field>
              </div>

              {/* HASH BOX */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Record Hash</span>
                  <button
                    onClick={() => copyHash(activeRecord.record.recordId)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-200 hover:bg-emerald-500 hover:text-black transition-all font-bold active:scale-95"
                  >
                    {copied ? "Copied!" : "Copy Hash"}
                  </button>
                </div>
                <div className="p-3 bg-black/40 rounded-lg text-[10px] font-mono break-all text-emerald-500/80 border border-emerald-500/10">
                  {activeRecord.record.recordId}
                </div>
              </div>

              {/* ACTION BUTTONS (MODAL) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GradientButton onClick={() => window.open(`http://localhost:5000/api/files/public/certificate/${activeRecord.record.recordId}`, "_blank")} className="py-3 text-base">
                  View Certificate
                </GradientButton>
                <GradientButton onClick={() => window.open(`http://localhost:5000/api/files/public/report/${activeRecord.record.recordId}`, "_blank")} className="py-3 text-base">
                  View Report Card
                </GradientButton>
                {activeRecord.record.blockchainTxHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${activeRecord.record.blockchainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-2 text-center px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 hover:bg-slate-700 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    View on Blockchain
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)] animate-slide-up text-center">
            
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <XCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Delete Student Record?</h3>
            <p className="text-slate-400 text-sm mb-6">
              You are about to delete <span className="text-white font-semibold">{studentToDelete.name}</span>. This action is irreversible.
            </p>
            
            <div className="relative mb-6">
              <input 
                type="password"
                placeholder="Enter Admin Password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  if(deleteError) setDeleteError(null);
                }}
                className={`w-full bg-slate-800 border ${deleteError ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-red-500/50`}
              />
              {deleteError && (
                <p className="text-red-500 text-xs mt-2 font-semibold animate-pulse">{deleteError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { 
                  setStudentToDelete(null); 
                  setAdminPassword(""); 
                  setDeleteError(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={!adminPassword || isDeleting}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   COMPONENTS
======================= */

function GradientButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500
                 text-xs font-bold text-black shadow-lg shadow-emerald-500/10
                 transition-all hover:brightness-110 hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function ActionButton({ children, onClick, variant, disabled }: { children: React.ReactNode; onClick: () => void; variant: 'danger' | 'success'; disabled?: boolean; }) {
  const themes = {
    danger: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-black font-bold"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all 
                 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100
                 ${themes[variant]}`}
    >
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { "on-chain": "On-chain", verified: "Verified", pending: "Pending" };
  const color: Record<string, string> = {
    "on-chain": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    verified: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    pending: "bg-slate-500/10 text-slate-400 border-slate-500/30"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${color[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'on-chain' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`}></span>
      {map[status] || status}
    </span>
  );
}

function Field({ label, value, children }: { label: string; value?: string | number; children?: React.ReactNode; }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">{label}</span>
      <span className="text-slate-200 font-semibold tracking-tight">{children ?? (value || "—")}</span>
    </div>
  );
}