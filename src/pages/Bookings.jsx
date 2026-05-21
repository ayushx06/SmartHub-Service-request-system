import { Eye } from 'lucide-react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { bookings as bookingData } from '../data/mockData.js';
import { db } from '../firebase.js';

function getBookingCustomer(booking) {
  return booking.customerName || booking.customer || '';
}

function getBookingProvider(booking) {
  return booking.providerName || booking.provider || '';
}

function getBookingDetailValue(value) {
  if (value?.toDate) {
    return value.toDate().toLocaleString();
  }

  if (value?.seconds) {
    return new Date(value.seconds * 1000).toLocaleString();
  }

  return value;
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const snapshot = await getDocs(collection(db, 'bookings'));
        const firestoreBookings = snapshot.docs.map((bookingDoc) => ({
          ...bookingDoc.data(),
          id: bookingDoc.id,
        }));

        setBookings(firestoreBookings.length > 0 ? firestoreBookings : bookingData);
      } catch (loadError) {
        console.error('Failed to load bookings:', loadError);
        setError('Could not load bookings from Firestore. Showing fallback data.');
        setBookings(bookingData);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => status === 'All' || booking.status === status);
  }, [bookings, status]);

  function applyBookingUpdates(id, updates) {
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)));
    setSelectedBooking((current) => (current?.id === id ? { ...current, ...updates } : current));
  }

  async function updateBookingStatus(id, nextStatus) {
    const previousBookings = bookings;
    const previousSelectedBooking = selectedBooking;

    applyBookingUpdates(id, { status: nextStatus });
    setUpdatingId(id);
    setError('');

    try {
      await updateDoc(doc(db, 'bookings', String(id)), { status: nextStatus });
    } catch (updateError) {
      console.error('Failed to update booking status:', updateError);
      setError('Could not update booking status in Firestore. Please try again.');
      setBookings(previousBookings);
      setSelectedBooking(previousSelectedBooking);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Booking Management" description="Track all service requests and inspect booking details." />

      <div className="panel p-4">
        <select className="input max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {loading && (
        <div className="panel p-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading bookings...
        </div>
      )}

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-5 py-4 font-semibold">{booking.id}</td>
                  <td className="px-5 py-4">{getBookingCustomer(booking)}</td>
                  <td className="px-5 py-4">{getBookingProvider(booking)}</td>
                  <td className="px-5 py-4">{booking.service}</td>
                  <td className="px-5 py-4">${booking.amount}</td>
                  <td className="px-5 py-4"><Badge>{booking.status}</Badge></td>
                  <td className="px-5 py-4">
                    <button className="btn-muted" onClick={() => setSelectedBooking(booking)}><Eye className="h-4 w-4" />View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <Modal title={`Booking ${selectedBooking.id}`} onClose={() => setSelectedBooking(null)}>
          <div className="grid gap-3 text-sm">
            {Object.entries(selectedBooking).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <span className="font-medium capitalize text-slate-500">{key}</span>
                {key === 'status' ? (
                  <select className="input max-w-[180px]" value={selectedBooking.status} onChange={(event) => updateBookingStatus(selectedBooking.id, event.target.value)} disabled={updatingId === selectedBooking.id}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                ) : (
                  <span className="text-right">{getBookingDetailValue(value)}</span>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
