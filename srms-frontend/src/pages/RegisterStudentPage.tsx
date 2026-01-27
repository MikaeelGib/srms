import { useState } from "react";
import { registerStudent } from "../api/studentApi";
import { Eye, EyeOff } from "lucide-react";

const INITIAL_FORM = {
  studentId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  department: "",
  password: ""
};

export default function RegisterStudentPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const generatePassword = () => {
    setError(null);
    if (!form.studentId.trim()) {
      setError("Enter roll number first to generate password");
      return;
    }
    update("password", form.studentId.trim());
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);

    const {
      studentId,
      firstName,
      middleName,
      lastName,
      email,
      department,
      password
    } = form;

    if (
      !studentId.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !department.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    try {
      setLoading(true);

      await registerStudent({
        studentId: studentId.trim(),
        name: fullName,
        email: email.trim(),
        department: department.trim(),
        password: password.trim()
      });

      setSuccess("Student registered successfully");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

        {/* HEADER */}
        <h2 className="text-3xl font-extrabold text-center mb-2 animate-fade-in">
          Register Student
        </h2>
        <p className="text-center text-sm text-slate-400 mb-6 animate-fade-in delay-100">
          Create a student profile and login credentials
        </p>

        {/* SUCCESS */}
        {success && (
          <div className="relative mb-4 pl-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-sm p-3 animate-slide-up">
            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-xl" />
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm p-3 animate-slide-up">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">
          <AnimatedInput label="Roll Number *" delay={100}
            value={form.studentId}
            onChange={v => update("studentId", v)}
          />

          <AnimatedInput label="First Name *" delay={150}
            value={form.firstName}
            onChange={v => update("firstName", v)}
          />

          <AnimatedInput label="Middle Name" delay={200}
            value={form.middleName}
            onChange={v => update("middleName", v)}
          />

          <AnimatedInput label="Last Name *" delay={250}
            value={form.lastName}
            onChange={v => update("lastName", v)}
          />

          <AnimatedInput label="Email" delay={300}
            value={form.email}
            onChange={v => update("email", v)}
          />

          <AnimatedInput label="Department *" delay={350}
            value={form.department}
            onChange={v => update("department", v)}
          />

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Temporary Password *
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 pr-10
                             text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="button"
                onClick={generatePassword}
                className="px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-medium
                           transition hover:scale-105 active:scale-95"
              >
                Use Roll #
              </button>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-bold text-black 
                     shadow-lg shadow-emerald-500/10 transition-all 
                     hover:brightness-110 hover:scale-105 active:scale-95
                     bg-gradient-to-r from-sky-500 to-emerald-500
                     hover:brightness-110 transition
                     active:scale-95"
          style={{ animationDelay: "500ms" }}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>
    </div>
  );
}

/* =======================
   ANIMATED INPUT
======================= */

function AnimatedInput({
  label,
  value,
  onChange,
  
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  delay: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5
                   text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}