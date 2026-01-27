import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, logout } from "../utils/auth";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardRoute = isAdmin() 
    ? "/admin" 
    : "/student/dashboard";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* =======================
            LEFT SECTION
        ======================= */}
        <div className="flex items-center gap-8">
          {/* BRAND */}
          <Link
            to="/"
            className="text-xl font-black tracking-tighter text-white group"
          >
            SRMS
            <span className="text-emerald-500 group-hover:animate-pulse">.</span>
          </Link>

          {/* DASHBOARD LINK (Only if logged in) */}
          {isAuthenticated() && (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to={dashboardRoute}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              
              {/* ROLE BADGE */}
              <span className={`
                px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest border uppercase
                ${isAdmin()
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                }
              `}>
                {isAdmin() ? "Admin" : "Student"}
              </span>
            </div>
          )}
        </div>

        {/* =======================
            RIGHT SECTION
        ======================= */}
        <div className="flex items-center gap-4">
          {!isAuthenticated() ? (
            <Link
              to="/login"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-black text-sm font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}