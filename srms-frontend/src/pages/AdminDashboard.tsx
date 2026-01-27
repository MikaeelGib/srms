import { useNavigate } from "react-router-dom";
import { LuUserPlus, LuFileCheck } from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Manage students, certificates, and blockchain records
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* REGISTER STUDENT */}
          <DashboardCard
            icon={<LuUserPlus />}
            title="Register Student"
            description="Add new students with academic details"
            action="Get started"
            onClick={() => navigate("/admin/register")}
          />

          {/* ISSUE CERTIFICATE */}
          <DashboardCard
            icon={<LuFileCheck />}
            title="Issue Certificate"
            description="Upload certificates & push to blockchain"
            action="Issue now"
            onClick={() => navigate("/admin/issue")}
          />

          {/* VIEW RECORDS */}
          <DashboardCard
            icon={<FiBarChart />}
            title="View Students"
            description="Browse all registered students and certificates"
            action="View students"
            onClick={() => navigate("/admin/records")}
          />
        </div>
      </div>
    </div>
  );
}

/* =======================
   CARD COMPONENT
======================= */

function DashboardCard({
  icon,
  title,
  description,
  action,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group relative text-left
        rounded-2xl p-6
        bg-slate-900/80 backdrop-blur
        border border-slate-700/50
        shadow-xl
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-emerald-500/10
        hover:border-emerald-500/40
        active:scale-[0.98]
      "
    >
      {/* ICON */}
      <div className="
        mb-4 inline-flex items-center justify-center
        w-12 h-12 rounded-xl
        bg-gradient-to-br from-emerald-500/20 to-cyan-500/20
        text-emerald-400
        text-2xl
        transition group-hover:scale-110
      ">
        {icon}
      </div>

      {/* TEXT */}
      <h2 className="text-lg font-semibold mb-1">
        {title}
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        {description}
      </p>

      {/* CTA */}
      <span className="
        inline-flex items-center gap-1
        text-sm font-medium
        text-emerald-400
        group-hover:underline
      ">
        {action}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
}