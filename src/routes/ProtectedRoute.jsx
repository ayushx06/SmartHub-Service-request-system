import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function getRolePath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'provider') return '/provider';
  if (role === 'user') return '/user';
  return '/login';
}

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-sm font-medium text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading SmartHub...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={getRolePath(role)} replace />;
  }

  return <Outlet />;
}
