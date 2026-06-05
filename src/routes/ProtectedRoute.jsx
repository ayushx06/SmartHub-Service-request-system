import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function getRolePath(profile) {
  if (!profile) return '/login';
  if (profile.role === 'admin') return '/admin';
  if (profile.role === 'provider') {
    return profile.status === 'approved' ? '/provider' : '/provider/pending';
  }
  return '/user/dashboard';
}

export default function ProtectedRoute({ allowedRoles, requireApprovedProvider = false }) {
  const { currentUser, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-sm font-semibold text-slate-600">
        Loading SmartHub...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={getRolePath(userProfile)} replace />;
  }

  if (requireApprovedProvider && userProfile.status !== 'approved') {
    return <Navigate to="/provider/pending" replace />;
  }

  return <Outlet />;
}
