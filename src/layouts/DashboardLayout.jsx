import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const sideLink = ({ isActive }) =>
  isActive
    ? "px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
    : "px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="container-x py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-extrabold tracking-tight">Dashboard</div>
            <div className="text-sm text-slate-600 dark:text-slate-300 hidden md:block">
              {user?.displayName || user?.email || "User"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <img
              src={user?.photoURL || "https://i.ibb.co/0jZQZ6R/user.png"}
              alt="user"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-x py-6 grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="card p-4 h-fit md:sticky md:top-[84px]">
          <div className="font-semibold mb-3">Menu</div>
          <nav className="grid gap-2">
            <NavLink to="/dashboard" end className={sideLink}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/my-exports" className={sideLink}>
              My Exports
            </NavLink>
            <NavLink to="/dashboard/my-imports" className={sideLink}>
              My Imports
            </NavLink>
            <NavLink to="/dashboard/add-export" className={sideLink}>
              Add Export
            </NavLink>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
