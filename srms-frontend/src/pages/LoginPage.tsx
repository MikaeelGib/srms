import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { isAuthenticated, isAdmin } from "../utils/auth";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student">("student");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(isAdmin() ? "/admin" : "/student/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("remember_login");
    if (!saved) return;
    const data = JSON.parse(saved);
    setIdentifier(data.identifier || "");
    setRole(data.role || "student");
    setRemember(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Please enter your credentials");
      return;
    }

    try {
      setLoading(true);
      if (remember) {
        localStorage.setItem("remember_login", JSON.stringify({ identifier, role }));
      } else {
        localStorage.removeItem("remember_login");
      }
      await login(identifier, password, role);
      navigate(role === "admin" ? "/admin" : "/student/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-md relative">
        {/* BACKGROUND GLOW DECORATION */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

        <form
          onSubmit={handleSubmit}
          className={`relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl transition-all duration-500 ${
            loading ? "opacity-70 scale-[0.98]" : "opacity-100"
          }`}
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          {/* ROLE SELECTOR (CLEANER UI) */}
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">
              Portal Access
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "student" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "admin" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* IDENTIFIER */}
          <div className="mb-5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">
              {role === "admin" ? "Admin Email" : "Student Roll Number"}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                <User size={18} />
              </div>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "admin" ? "admin@example.com" : "220XXXXXXX"}
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* REMEMBER ME */}
          <label className="flex items-center gap-3 mb-8 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-slate-700 rounded-md checked:bg-sky-500 checked:border-sky-500 transition-all cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Remember my session</span>
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Sign In to Portal"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 text-xs font-medium">
          Secure Blockchain Authentication Protocol v2.4
        </p>
      </div>
    </div>
  );
}