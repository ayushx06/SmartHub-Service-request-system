import { collection, orderBy, query, where } from 'firebase/firestore';
import { Crown, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../../components/EmptyState.jsx';
import StatCard from '../../components/StatCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

const filters = [
  { key: 'completed', label: 'Completed only' },
  { key: 'all', label: 'All bookings' },
];

function money(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  return new Date(value);
}

/** Totals money spent per service title so we can rank the biggest costs. */
function spendByService(bookings) {
  const map = new Map();

  bookings.forEach((booking) => {
    const key = booking.serviceId || booking.serviceTitle || 'unknown';
    const amount = Number(booking.servicePrice || 0);
    const existing = map.get(key);

    if (existing) {
      existing.total += amount;
      existing.count += 1;
    } else {
      map.set(key, {
        serviceId: booking.serviceId,
        title: booking.serviceTitle || 'Removed service',
        total: amount,
        count: 1,
      });
    }
  });

  return [...map.values()].sort((a, b) => b.total - a.total);
}

export default function MySpending() {
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState('completed');

  const bookingsQuery = useMemo(
    () =>
      query(
        collection(db, 'bookings'),
        where('userId', '==', userProfile.uid),
        orderBy('createdAt', 'desc'),
      ),
    [userProfile.uid],
  );

  const { items: bookings, loading } = useFirestoreQuery(bookingsQuery, [userProfile.uid]);

  // "Completed only" is the honest number: pending bookings are not paid for yet.
  const scoped = useMemo(
    () => (filter === 'completed' ? bookings.filter((b) => b.bookingStatus === 'completed') : bookings),
    [bookings, filter],
  );

  const totalSpent = useMemo(
    () => scoped.reduce((sum, booking) => sum + Number(booking.servicePrice || 0), 0),
    [scoped],
  );

  const ranked = useMemo(() => spendByService(scoped), [scoped]);
  const topService = ranked[0];
  const averageSpend = scoped.length ? totalSpent / scoped.length : 0;

  const pendingTotal = useMemo(
    () =>
      bookings
        .filter((booking) => booking.bookingStatus === 'pending')
        .reduce((sum, booking) => sum + Number(booking.servicePrice || 0), 0),
    [bookings],
  );

  const chartData = ranked.slice(0, 6).map((row) => ({
    name: row.title.length > 16 ? `${row.title.slice(0, 16)}...` : row.title,
    total: Number(row.total.toFixed(2)),
  }));

  const thisMonth = useMemo(() => {
    const now = new Date();
    return scoped
      .filter((booking) => {
        const date = toDate(booking.createdAt);
        return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, booking) => sum + Number(booking.servicePrice || 0), 0);
  }, [scoped]);

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">My spending</h1>
          <p className="muted mt-1">See what you have spent overall and which service costs you the most.</p>
        </div>

        <div className="flex gap-2">
          {filters.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={filter === option.key ? 'btn-primary' : 'btn-muted'}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={DollarSign} label="Total spent" value={money(totalSpent)} change="Live" />
        <StatCard icon={TrendingUp} label="This month" value={money(thisMonth)} change="Month" />
        <StatCard icon={Receipt} label="Average per booking" value={money(averageSpend)} change="Avg" />
        <StatCard icon={Crown} label="Awaiting completion" value={money(pendingTotal)} change="Pending" />
      </div>

      {topService && (
        <div className="panel border-brand-200 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">You spend the most on</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{topService.title}</p>
          <p className="muted mt-1">
            {money(topService.total)} across {topService.count}{' '}
            {topService.count === 1 ? 'booking' : 'bookings'} · that is{' '}
            {totalSpent ? Math.round((topService.total / totalSpent) * 100) : 0}% of your total spend.
          </p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">Spending by service</h2>
          <p className="muted mt-1">Your top {chartData.length} services by amount spent.</p>
          <div className="mt-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => money(value)} cursor={{ fill: '#f0fdf4' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? '#15803d' : '#4ade80'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
          <span className="col-span-6">Service</span>
          <span className="col-span-2">Bookings</span>
          <span className="col-span-2">Spent</span>
          <span className="col-span-2">Share</span>
        </div>

        {ranked.map((row) => (
          <div
            key={row.serviceId || row.title}
            className="grid grid-cols-12 items-center gap-3 border-b border-slate-100 px-5 py-4 text-sm last:border-0"
          >
            <p className="col-span-12 font-semibold text-slate-950 sm:col-span-6">{row.title}</p>
            <p className="col-span-3 sm:col-span-2 text-slate-600">{row.count}</p>
            <p className="col-span-4 sm:col-span-2 font-semibold text-slate-950">{money(row.total)}</p>
            <div className="col-span-5 sm:col-span-2">
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-brand-600"
                  style={{ width: `${totalSpent ? (row.total / totalSpent) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {!loading && !ranked.length && (
          <div className="p-5">
            <EmptyState
              title="No spending recorded"
              message="Completed bookings will show up here so you can track what you spend."
            />
          </div>
        )}
      </div>
    </section>
  );
}