import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Bell, CalendarCheck, Gauge, Menu, MessageSquareWarning, Search, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/providers', label: 'Providers', icon: ShieldCheck },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  // Mobile users open and close the sidebar without affecting desktop navigation.
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-5">
          <div>
            <p className="text-lg font-bold text-brand-700 dark:text-brand-300">SmartHub</p>
            <p className="text-xs text-slate-500">Admin Console</p>
          </div>
          <button className="btn-muted p-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu overlay" />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="btn-muted p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500 dark:text-slate-200"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search bookings, users, complaints"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-muted p-2" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm font-semibold text-white">AS</div>
              <div className="hidden text-sm sm:block">
                <p className="font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Operations</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
