import { Moon, Save, Sun } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { db } from '../firebase.js';

const defaultSettings = {
  fullName: 'Admin User',
  email: 'admin@smarthub.com',
  role: 'Platform Operations Manager',
  theme: 'light',
  notifications: {
    bookings: true,
    complaints: true,
    providers: false,
  },
};

const notificationLabels = {
  bookings: 'Bookings notifications',
  complaints: 'Complaints notifications',
  providers: 'Providers notifications',
};

export default function Settings() {
  const { searchQuery = '' } = useOutletContext() || {};
  const [profile, setProfile] = useState({
    fullName: defaultSettings.fullName,
    email: defaultSettings.email,
    role: defaultSettings.role,
  });
  const [theme, setTheme] = useState(defaultSettings.theme);
  const [notifications, setNotifications] = useState(defaultSettings.notifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const matchesSearch = (labels) => normalizedSearch === '' || labels.some((label) => label.toLowerCase().includes(normalizedSearch));
  const profileMatches = {
    fullName: matchesSearch(['profile', 'admin profile', 'full name']),
    email: matchesSearch(['profile', 'admin profile', 'email']),
    role: matchesSearch(['profile', 'admin profile', 'role']),
  };
  const themeMatches = matchesSearch(['preferences', 'theme']);
  const notificationMatches = Object.fromEntries(
    Object.entries(notificationLabels).map(([key, label]) => [key, matchesSearch(['preferences', label])])
  );
  const showProfile = Object.values(profileMatches).some(Boolean);
  const showPreferences = themeMatches || Object.values(notificationMatches).some(Boolean);
  const hasSearchResults = showProfile || showPreferences;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'adminSettings', 'profile'),
      (snapshot) => {
        const settings = snapshot.data() || {};

        setProfile({
          fullName: settings.fullName || defaultSettings.fullName,
          email: settings.email || defaultSettings.email,
          role: settings.role || defaultSettings.role,
        });
        setTheme(settings.theme || defaultSettings.theme);
        setNotifications({ ...defaultSettings.notifications, ...settings.notifications });
        setLoading(false);
      },
      (loadError) => {
        console.error('Failed to load admin settings:', loadError);
        setError('Could not load admin settings from Firestore. Showing fallback settings.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  function updateProfileField(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    setSaving(true);
    setError('');

    try {
      await setDoc(doc(db, 'adminSettings', 'profile'), profile, { merge: true });
    } catch (saveError) {
      console.error('Failed to save admin profile:', saveError);
      setError('Could not save admin profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleNotification(key) {
    const previousNotifications = notifications;
    const nextNotifications = { ...notifications, [key]: !notifications[key] };

    setNotifications(nextNotifications);
    setError('');

    try {
      await setDoc(doc(db, 'adminSettings', 'profile'), { notifications: nextNotifications }, { merge: true });
    } catch (saveError) {
      console.error('Failed to save notification settings:', saveError);
      setError('Could not save notification settings. Please try again.');
      setNotifications(previousNotifications);
    }
  }

  async function toggleTheme() {
    const previousTheme = theme;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    setError('');

    try {
      await setDoc(doc(db, 'adminSettings', 'profile'), { theme: nextTheme }, { merge: true });
    } catch (saveError) {
      console.error('Failed to save theme setting:', saveError);
      setError('Could not save theme setting. Please try again.');
      setTheme(previousTheme);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage admin profile, notification preferences, and interface theme." />

      {loading && (
        <div className="panel p-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading settings...
        </div>
      )}

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      {!hasSearchResults && (
        <p className="text-sm text-slate-500 dark:text-slate-400">No settings found.</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        {showProfile && <section className="panel p-5">
          <h2 className="text-lg font-semibold">Admin Profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {profileMatches.fullName && <label className="space-y-2 text-sm font-medium">
              Full name
              <input className="input" value={profile.fullName} onChange={(event) => updateProfileField('fullName', event.target.value)} />
            </label>}
            {profileMatches.email && <label className="space-y-2 text-sm font-medium">
              Email
              <input className="input" value={profile.email} onChange={(event) => updateProfileField('email', event.target.value)} />
            </label>}
            {profileMatches.role && <label className="space-y-2 text-sm font-medium md:col-span-2">
              Role
              <input className="input" value={profile.role} onChange={(event) => updateProfileField('role', event.target.value)} />
            </label>}
          </div>
          <button className="btn-primary mt-5" onClick={saveProfile} disabled={saving}><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save profile'}</button>
        </section>}

        {showPreferences && <section className="panel p-5">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="mt-5 space-y-4">
            {themeMatches && <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="font-medium">Theme</p>
                <p className="muted">Switch between light and dark mode.</p>
              </div>
              <button className="btn-muted" onClick={toggleTheme}>
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>}
            {Object.entries(notifications).filter(([key]) => notificationMatches[key]).map(([key, enabled]) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <span>{notificationLabels[key]}</span>
                <input type="checkbox" checked={enabled} onChange={() => toggleNotification(key)} className="h-5 w-5 accent-brand-600" />
              </label>
            ))}
          </div>
        </section>}
      </div>
    </div>
  );
}
