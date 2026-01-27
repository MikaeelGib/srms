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
    <nav
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-white/70 dark:bg-slate-900/70
        border-b border-slate-200 dark:border-slate-800
        transition-colors duration-300
      "
    >
      <div
        className="
          max-w-[1400px] mx-auto
          px-8 py-4
          flex items-center justify-between
        "
      >
        {/* =======================
            LEFT SECTION
        ======================= */}
        <div className="flex items-center gap-6">
          {/* BRAND */}
          <Link
            to="/"
            className="text-xl font-black tracking-tighter
                       text-slate-900 dark:text-white group"
          >
            SRMS
            <span className="text-emerald-500 group-hover:animate-pulse">.</span>
          </Link>

          {/* DASHBOARD + ROLE */}
          {isAuthenticated() && (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardRoute}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-xl
                  bg-slate-900 dark:bg-white
                  text-white dark:text-black
                  text-xs font-bold uppercase tracking-wider
                  transition-all hover:opacity-90 hover:scale-105
                  active:scale-95
                "
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* ROLE BADGE */}
              <span
                className={`
                  px-3 py-1 rounded-full
                  text-[10px] font-black tracking-widest
                  border
                  ${isAdmin()
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                    : "bg-sky-500/10 text-sky-400 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.1)]"}
                `}
              >
                {isAdmin() ? "ADMIN" : "STUDENT"}
              </span>
            </div>
          )}
        </div>

        {/* =======================
            RIGHT SECTION
        ======================= */}
        <div className="flex items-center gap-3">
          {/* AUTH */}
          {!isAuthenticated() ? (
            <Link
              to="/login"
              className="
                px-6 py-2 rounded-xl
                bg-gradient-to-r from-sky-500 to-emerald-500
                text-black text-sm font-bold
                transition-all hover:brightness-110 active:scale-95
              "
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="
                group
                flex items-center gap-2
                px-4 py-2 rounded-xl
                bg-red-500/5 text-red-500
                border border-red-500/10
                text-xs font-bold uppercase tracking-widest
                hover:bg-red-500 hover:text-white
                transition-all active:scale-95
              "
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}