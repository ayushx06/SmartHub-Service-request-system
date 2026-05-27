import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarCheck, DollarSign, Users, Wrench } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';                                                                                                                                                                                                                                                                                                                                  
import LoadingCard from '../components/LoadingCard.jsx';
import { bookingAnalytics, recentActivities, stats } from '../data/mockData.js';
import { useEffect, useState } from 'react';

const icons = [Users, Wrench, CalendarCheck, DollarSign];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" description="Monitor SmartHub performance, bookings, and platform activity." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <LoadingCard key={index} />)
          : stats.map((stat, index) => <StatCard key={stat.label} {...stat} icon={icons[index]} />)}
      </div>

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
