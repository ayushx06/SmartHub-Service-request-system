import {
  BarChart3,
  CreditCard,
  FileText,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

export default function PaymentManagerLayout() {
  const { logout, userProfile } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const navItems = [
    {
      to: '/payment-manager',
      label: 'Dashboard',
      icon: BarChart3,
      end: true,
    },
    {
      to: '/payment-manager/verification',
      label: 'Payment Verification',
      icon: ShieldCheck,
    },
    {
      to: '/payment-manager/transactions',
      label: 'Transaction History',
      icon: CreditCard,
    },
    {
      to: '/payment-manager/reports',
      label: 'Financial Reports',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <h1 className="text-xl font-bold">
              SmartHub
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Payment Manager
            </p>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-4">
              <p className="text-sm font-medium">
                {userProfile?.fullName || 'Payment Manager'}
              </p>

              <p className="text-xs text-slate-500">
                {userProfile?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}