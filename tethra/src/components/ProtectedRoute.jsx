import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="screen center" style={{ paddingTop: 80 }}>
        <p className="muted">One moment…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
