import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleHome({ title, description }) {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-brand-700 dark:text-brand-300">SmartHub</p>
            <h1 className="page-title mt-2">{title}</h1>
            <p className="muted mt-1">{description}</p>
          </div>
          <button className="btn-muted" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        <div className="panel p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <p className="mt-2 text-lg font-semibold">{userProfile?.name || userProfile?.email}</p>
          <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-400">{userProfile?.role}</p>
        </div>
      </section>
    </main>
  );
}
