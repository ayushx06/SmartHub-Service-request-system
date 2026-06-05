import { collection, orderBy, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

function label(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function MyBookings() {
  const { userProfile } = useAuth();
  const bookingsQuery = useMemo(() => query(collection(db, 'bookings'), where('userId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const { items: bookings } = useFirestoreQuery(bookingsQuery, [userProfile.uid]);

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="page-title">My bookings</h1>
        <p className="muted mt-1">See provider responses, completion status, and payment method.</p>
      </div>

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
          <span className="col-span-5">Service</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-3">Payment</span>
          <span className="col-span-2">Status</span>
        </div>
        {bookings.map((booking) => (
          <div key={booking.id} className="grid grid-cols-12 gap-3 border-b border-slate-100 px-5 py-4 text-sm last:border-0">
            <div className="col-span-12 sm:col-span-5">
              <p className="font-semibold text-slate-950">{booking.serviceTitle}</p>
              <p className="text-slate-500">Provider net ${Number(booking.providerEarning || 0).toFixed(2)}</p>
            </div>
            <p className="col-span-4 sm:col-span-2">${Number(booking.servicePrice || 0).toFixed(2)}</p>
            <p className="col-span-5 sm:col-span-3">{booking.paymentMethod}</p>
            <div className="col-span-3 sm:col-span-2"><Badge>{label(booking.bookingStatus)}</Badge></div>
          </div>
        ))}
        {!bookings.length && <div className="p-5"><EmptyState title="No bookings found" message="Your service bookings will appear here." /></div>}
      </div>
    </section>
  );
}
