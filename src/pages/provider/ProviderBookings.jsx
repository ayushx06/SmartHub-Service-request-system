import { collection, orderBy, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { setBookingStatus } from '../../lib/firestore.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

function label(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function ProviderBookings() {
  const { userProfile } = useAuth();
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), where('providerId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, [userProfile.uid]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Provider bookings</h1>
        <p className="muted mt-1">Accept, complete, or cancel customer booking requests.</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="panel p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-semibold text-slate-950">{booking.serviceTitle}</h2>
                <p className="muted">Customer: {booking.userName} | Payment: {booking.paymentMethod}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Total ${Number(booking.servicePrice || 0).toFixed(2)} | Commission ${Number(booking.commissionAmount || 0).toFixed(2)} | Net ${Number(booking.providerEarning || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{label(booking.bookingStatus)}</Badge>
                {booking.bookingStatus === 'pending' && <button className="btn-muted" onClick={() => setBookingStatus(booking, 'accepted')}>Accept</button>}
                {['pending', 'accepted'].includes(booking.bookingStatus) && <button className="btn-muted" onClick={() => setBookingStatus(booking, 'completed')}>Complete</button>}
                {['pending', 'accepted'].includes(booking.bookingStatus) && <button className="btn-muted text-rose-700" onClick={() => setBookingStatus(booking, 'cancelled')}>Cancel</button>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!bookings.length && <EmptyState title="No bookings yet" message="Customer bookings for your services will appear here." />}
    </section>
  );
}
