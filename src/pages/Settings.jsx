import { Moon, Save, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    bookings: true,
    complaints: true,
    providers: false,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  function toggleNotification(key) {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage admin profile, notification preferences, and interface theme." />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Admin Profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Full name
              <input className="input" defaultValue="Admin User" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Email
              <input className="input" defaultValue="admin@smarthub.com" />
            </label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Role
              <input className="input" defaultValue="Platform Operations Manager" />
            </label>
          </div>
          <button className="btn-primary mt-5"><Save className="h-4 w-4" />Save profile</button>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="font-medium">Theme</p>
                <p className="muted">Switch between light and dark mode.</p>
              </div>
              <button className="btn-muted" onClick={() => setDarkMode((value) => !value)}>
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {darkMode ? 'Dark' : 'Light'}
              </button>
            </div>
            {Object.entries(notifications).map(([key, enabled]) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <span className="capitalize">{key} notifications</span>
                <input type="checkbox" checked={enabled} onChange={() => toggleNotification(key)} className="h-5 w-5 accent-brand-600" />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
