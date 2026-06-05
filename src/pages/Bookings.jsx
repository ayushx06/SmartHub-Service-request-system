import { collection, orderBy, query } from 'firebase/firestore';
import { useMemo } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

function label(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function Bookings() {
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), []);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">All bookings</h1>
        <p className="muted mt-1">Track customer requests, provider earnings, and booking status.</p>
      </div>

      <div className="panel overflow-hidden">
        {bookings.map((booking) => (
          <div key={booking.id} className="grid gap-3 border-b border-slate-100 p-5 last:border-0 xl:grid-cols-[1.2fr_1fr_150px_120px] xl:items-center">
            <div>
              <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
              <p className="muted">Customer: {booking.userName}</p>
            </div>
            <p className="text-sm text-slate-600">
              Total ${Number(booking.servicePrice || 0).toFixed(2)} | Commission ${Number(booking.commissionAmount || 0).toFixed(2)} | Provider ${Number(booking.providerEarning || 0).toFixed(2)}
            </p>
            <p className="text-sm">{booking.paymentMethod}</p>
            <Badge>{label(booking.bookingStatus)}</Badge>
          </div>
        ))}
        {!bookings.length && <div className="p-5"><EmptyState title="No bookings" message="Bookings created by customers will appear here." /></div>}
      </div>
    </section>
  );
}
