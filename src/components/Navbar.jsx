import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import toast from "react-hot-toast";

const navClass = ({ isActive }) =>
  isActive
    ? "px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
    : "px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="container-x py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-extrabold text-lg tracking-tight">
            Import Export Hub
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/products" className={navClass}>All Products</NavLink>
            <NavLink to="/my-exports" className={navClass}>My Exports</NavLink>
            <NavLink to="/my-imports" className={navClass}>My Imports</NavLink>
            <NavLink to="/add-export" className={navClass}>Add Export</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!user ? (
            <Link to="/login" className="btn-primary">
              Login / Register
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || "https://i.ibb.co/0jZQZ6R/user.png"}
                alt="user"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
              <button onClick={handleLogout} className="btn-outline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden container-x pb-3 flex flex-wrap gap-2">
        <NavLink to="/products" className={navClass}>All Products</NavLink>
        <NavLink to="/my-exports" className={navClass}>My Exports</NavLink>
        <NavLink to="/my-imports" className={navClass}>My Imports</NavLink>
        <NavLink to="/add-export" className={navClass}>Add Export</NavLink>
      </div>
    </header>
  );
}
