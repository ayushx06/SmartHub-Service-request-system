import { Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProviderPending() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="panel max-w-xl p-8 text-center">
        <Clock className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Provider request {userProfile.status}</h1>
        <p className="mt-2 text-slate-600">
          {userProfile.status === 'rejected'
            ? 'Your provider application was rejected. Contact the SmartHub admin team if you need more information.'
            : 'Your provider account is waiting for admin verification. You can log in, but provider tools unlock only after approval.'}
        </p>
        <button onClick={handleLogout} className="btn-muted mx-auto mt-6">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>
    </main>
  );
}
