import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarCheck, Clock3, DollarSign, MessageSquareWarning, Users, Wrench } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';                                                                                                                                                                                                                                                                                                                                  
import LoadingCard from '../components/LoadingCard.jsx';
import { bookingAnalytics, complaints, providerRequests, recentActivities, stats } from '../data/mockData.js';
import { useEffect, useState } from 'react';
import { db } from '../firebase.js';

const dashboardCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, fallback: stats[0] },
  { key: 'totalProviders', label: 'Service Providers', icon: Wrench, fallback: stats[1] },
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheck, fallback: stats[2] },
  { key: 'totalComplaints', label: 'Total Complaints', icon: MessageSquareWarning, fallback: { value: complaints.length, change: '' } },
  { key: 'revenue', label: 'Total Revenue', icon: DollarSign, fallback: stats[3] },
  { key: 'pendingRequests', label: 'Pending Requests', icon: Clock3, fallback: { value: providerRequests.filter((request) => request.status === 'Pending').length, change: '' } },
];

function formatStatValue(key, value) {
  if (value === undefined || value === null || value === '') {
    return value;
  }

  if (key === 'revenue' && typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  }

  return typeof value === 'number' ? value.toLocaleString() : value;
}

function getDashboardStats(firestoreStats = {}) {
  return dashboardCards.map(({ key, label, icon, fallback }) => ({
    label,
    icon,
    change: fallback.change,
    value: formatStatValue(key, firestoreStats[key] ?? fallback.value),
  }));
}

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(() => getDashboardStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'dashboardStats'),
      (snapshot) => {
        const firestoreStats = snapshot.docs[0]?.data();

        setDashboardStats(firestoreStats ? getDashboardStats(firestoreStats) : getDashboardStats());
        setLoading(false);
      },
      (loadError) => {
        console.error('Failed to load dashboard stats:', loadError);
        setError('Could not load dashboard statistics from Firestore. Showing fallback data.');
        setDashboardStats(getDashboardStats());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" description="Monitor SmartHub performance, bookings, and platform activity." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: dashboardCards.length }).map((_, index) => <LoadingCard key={index} />)
          : dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Booking Analytics</h2>
              <p className="muted">Monthly booking volume and revenue health.</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingAnalytics}>
                <defs>
                  <linearGradient id="bookings" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f9fce" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0f9fce" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#0b7da7" fill="url(#bookings)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <div className="mt-4 space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity} className="rounded-lg border border-slate-100 p-3 text-sm transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70">
                {activity}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
