import { collection, orderBy, query, where } from 'firebase/firestore';
import { CalendarCheck, Clock, Search, Star } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatCard from '../../components/StatCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

export default function CustomerDashboard() {
  const { userProfile } = useAuth();
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), where('userId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, [userProfile.uid]);
  const completed = bookings.filter((booking) => booking.bookingStatus === 'completed').length;
  const pending = bookings.filter((booking) => booking.bookingStatus === 'pending').length;

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">Welcome, {userProfile.fullName || 'Customer'}</h1>
          <p className="muted mt-1">Track bookings and find trusted Auckland services.</p>
        </div>
        <Link className="btn-primary" to="/user/services"><Search className="h-4 w-4" />Find a service</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Total bookings" value={bookings.length} change="Live" />
        <StatCard icon={Clock} label="Pending" value={pending} change="Now" />
        <StatCard icon={Star} label="Completed" value={completed} change="Ready" />
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Recent bookings</h2>
        </div>
        {bookings.slice(0, 5).map((booking) => (
          <div key={booking.id} className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 last:border-0 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
              <p className="muted">${Number(booking.servicePrice || 0).toFixed(2)} via {booking.paymentMethod}</p>
            </div>
            <Badge>{booking.bookingStatus?.replace(/^\w/, (letter) => letter.toUpperCase())}</Badge>
          </div>
        ))}
        {!bookings.length && <div className="p-5"><EmptyState title="No bookings yet" message="Browse services and request your first booking." /></div>}
      </div>
    </section>
  );
}
