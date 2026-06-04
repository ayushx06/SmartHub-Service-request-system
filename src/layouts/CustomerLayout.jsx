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
    <div className="min-h-screen bg-brand-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-brand-950 px-5 py-8 text-white transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white/80 bg-brand-700 shadow-lg">
              <span className="text-xl font-black text-white">S</span>
            </div>
            <h1 className="text-2xl font-black tracking-wide">SmartHub</h1>
            <p className="mt-1 text-xs tracking-[0.25em] text-white/80">
              CUSTOMER
            </p>
          </div>

          <button
            className="rounded-lg p-2 text-brand-100 hover:bg-white/10 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close customer menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-5 py-3 font-bold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'text-brand-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 font-black text-brand-700">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-white">
                {userProfile?.name || 'Customer'}
              </p>
              <p className="text-xs text-white/80">Customer</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 font-bold text-brand-300 hover:bg-white/10"
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

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-100 bg-white/95 px-4 shadow-sm backdrop-blur md:hidden">
          <button
            className="rounded-lg border border-brand-100 bg-white p-2 text-brand-800"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open customer menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="font-black text-brand-950">SmartHub</p>
            <p className="text-xs font-semibold text-brand-700">Customer</p>
          </div>

          <button
            className="rounded-lg border border-brand-100 bg-white p-2 text-brand-800"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <main className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
