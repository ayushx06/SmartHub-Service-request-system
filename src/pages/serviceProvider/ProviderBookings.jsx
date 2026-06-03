import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getBookings() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const bookingQuery = query(
        collection(db, "bookings"),
        where("providerId", "==", user.uid),
        where("status", "==", "Pending")
      );

      const data = await getDocs(bookingQuery);

      setBookings(
        data.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );

      setLoading(false);
    } catch (error) {
      alert("Error loading bookings: " + error.message);
      setLoading(false);
    }
  }

  async function updateBookingStatus(id, status) {
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: status,
        updatedAt: new Date().toISOString(),
      });

      alert(`Booking ${status}`);
      getBookings();
    } catch (error) {
      alert("Error updating booking: " + error.message);
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#EAFBF4]">
      <header className="bg-[#006B4F] px-20 py-10 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SmartHub</h1>
            <p className="text-sm text-green-100">Service Provider Portal</p>
          </div>

          <Link
            to="/provider/dashboard"
            className="rounded-lg bg-white px-5 py-2 font-semibold text-[#006B4F]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-bold">Booking Requests</h2>
          <p className="mt-2 text-green-100">
            View customer booking requests and accept or cancel jobs.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-slate-600">Loading booking requests...</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <h2 className="text-2xl font-bold text-slate-800">
              No pending bookings
            </h2>
            <p className="mt-2 text-slate-500">
              Customer booking requests will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#D7F8EA] text-[#006B4F]">
                  <tr>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">{booking.serviceTitle}</td>
                      <td className="px-5 py-4">{booking.date}</td>
                      <td className="px-5 py-4">{booking.time}</td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "Accepted")
                            }
                            className="rounded-lg bg-[#008C6A] px-4 py-2 font-semibold text-white hover:bg-[#006B4F]"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "Cancelled")
                            }
                            className="rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-600 hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}