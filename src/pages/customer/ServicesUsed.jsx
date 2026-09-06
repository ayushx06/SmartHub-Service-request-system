import { collection, orderBy, query, where } from 'firebase/firestore';
import { History, Repeat, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatCard from '../../components/StatCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

// Firestore returns a Timestamp object, not a JS Date.
function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  return new Date(value);
}

function formatDate(value) {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Groups a flat list of bookings into one row per service, so the customer
 * sees "Deep clean x4" instead of four separate booking rows.
 */
function groupByService(bookings) {
  const map = new Map();

  bookings.forEach((booking) => {
    const key = booking.serviceId || booking.serviceTitle || 'unknown';
    const existing = map.get(key);
    const bookedAt = toDate(booking.createdAt);

    if (existing) {
      existing.timesUsed += 1;
      existing.completed += booking.bookingStatus === 'completed' ? 1 : 0;
      if (bookedAt && (!existing.lastUsed || bookedAt > existing.lastUsed)) {
        existing.lastUsed = bookedAt;
      }
    } else {
      map.set(key, {
        serviceId: booking.serviceId,
        title: booking.serviceTitle || 'Removed service',
        timesUsed: 1,
        completed: booking.bookingStatus === 'completed' ? 1 : 0,
        lastUsed: bookedAt,
      });
    }
  });

  // Most used first; break ties with the most recent booking.
  return [...map.values()].sort(
    (a, b) => b.timesUsed - a.timesUsed || (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0),
  );
}

export default function ServicesUsed() {
  const { userProfile } = useAuth();

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
  const services = useMemo(() => groupByService(bookings), [bookings]);
  const mostUsed = services[0];
  const repeatCount = services.filter((service) => service.timesUsed > 1).length;

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="page-title">Services I have used</h1>
        <p className="muted mt-1">Every service you have booked, with your most used ones first.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={History} label="Different services used" value={services.length} change="Live" />
        <StatCard icon={Repeat} label="Booked more than once" value={repeatCount} change="Repeat" />
        <StatCard icon={Sparkles} label="Total bookings" value={bookings.length} change="All time" />
      </div>

      {mostUsed && (
        <div className="panel border-brand-200 bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Most used service</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold text-slate-950">{mostUsed.title}</p>
              <p className="muted mt-1">
                Booked {mostUsed.timesUsed} {mostUsed.timesUsed === 1 ? 'time' : 'times'} · last on{' '}
                {formatDate(mostUsed.lastUsed)}
              </p>
            </div>
            {mostUsed.serviceId && (
              <Link className="btn-primary" to={`/user/services/${mostUsed.serviceId}`}>
                Book again
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
          <span className="col-span-5">Service</span>
          <span className="col-span-2">Times used</span>
          <span className="col-span-3">Last used</span>
          <span className="col-span-2">Completed</span>
        </div>

        {services.map((service) => (
          <div
            key={service.serviceId || service.title}
            className="grid grid-cols-12 gap-3 border-b border-slate-100 px-5 py-4 text-sm last:border-0"
          >
            <div className="col-span-12 sm:col-span-5">
              {service.serviceId ? (
                <Link
                  className="font-semibold text-slate-950 hover:text-brand-700"
                  to={`/user/services/${service.serviceId}`}
                >
                  {service.title}
                </Link>
              ) : (
                <p className="font-semibold text-slate-950">{service.title}</p>
              )}
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Badge>{`${service.timesUsed}x`}</Badge>
            </div>
            <p className="col-span-5 sm:col-span-3 text-slate-600">{formatDate(service.lastUsed)}</p>
            <p className="col-span-3 sm:col-span-2 text-slate-600">
              {service.completed}/{service.timesUsed}
            </p>
          </div>
        ))}

        {!loading && !services.length && (
          <div className="p-5">
            <EmptyState
              title="No services used yet"
              message="Once you book a service it will show up here with how often you have used it."
            />
          </div>
        )}
      </div>
    </section>
  );
}