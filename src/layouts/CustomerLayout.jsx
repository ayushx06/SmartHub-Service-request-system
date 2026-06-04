import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customer/services', label: 'Find Taskers', icon: Search },
  { to: '/customer/bookings', label: 'My Tasks', icon: CalendarCheck },
  { to: '/customer/about', label: 'About SmartHub', icon: Info },
];

export default function CustomerLayout() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  const initials = (userProfile?.name || 'U')
    .split(' ')
    .map((namePart) => namePart[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-brand-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div>
            <h1 className="text-lg font-bold text-brand-700">SmartHub</h1>
            <p className="text-xs text-slate-500">Customer Workspace</p>
          </div>

          <button
            className="btn-muted p-2 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close customer menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-3 right-3 space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-brand-50 px-3 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {userProfile?.name || 'Customer'}
              </p>
              <p className="text-xs text-slate-500">Customer</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-muted w-full"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close customer menu overlay"
        />
      )}

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:hidden">
          <button
            className="btn-muted p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open customer menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="font-semibold text-slate-950">SmartHub</p>
            <p className="text-xs text-slate-500">Customer</p>
          </div>

          <button
            className="btn-muted p-2"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <main className="min-h-screen bg-brand-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
