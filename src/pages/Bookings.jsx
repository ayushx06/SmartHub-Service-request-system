import { Eye } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { bookings } from '../data/mockData.js';

export default function Bookings() {
  const [status, setStatus] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => status === 'All' || booking.status === status);
  }, [status]);

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
                  <td className="px-5 py-4">{booking.customer}</td>
                  <td className="px-5 py-4">{booking.provider}</td>
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
                <span className="text-right">{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
