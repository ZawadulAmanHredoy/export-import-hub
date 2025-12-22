import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container-x py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
