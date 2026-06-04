import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function isProviderBooking(booking, currentUser, userProfile) {
  return (
    booking.providerId === currentUser?.uid ||
    booking.providerName === userProfile?.name
  );
}

function getStatusBadge(status) {
  if (status === "Completed") {
    return "bg-green-100 text-green-700";
  }
  if (status === "In Progress") {
    return "bg-blue-100 text-blue-700";
  }
  if (status === "Cancelled") {
    return "bg-red-100 text-red-700";
  }
  return "bg-yellow-100 text-yellow-700";
}

export default function ProviderBookings() {
  const { currentUser, userProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser?.uid && !userProfile?.name) {
      return undefined;
    }

    const bookingsQuery = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const assignedBookings = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter((booking) => isProviderBooking(booking, currentUser, userProfile));

        setBookings(assignedBookings);
        setLoading(false);
        setError("");
      },
      (loadError) => {
        console.error("Error loading provider bookings:", loadError);
        setError("Could not load bookings.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userProfile]);

  async function updateStatus(bookingId, status) {
    setUpdatingId(bookingId);
    setError("");
    setMessage("");

    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
      setMessage(`Booking marked ${status}.`);
    } catch (updateError) {
      console.error("Error updating booking status:", updateError);
      setError("Could not update booking status.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Bookings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Assigned Customer Requests
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review service details and update booking progress.
        </p>
      </section>

      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-3 font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-center font-semibold text-slate-600 shadow">
          Loading...
        </div>
      ) : (
        <section className="rounded-lg bg-white p-5 shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan="7">
                      No assigned bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {booking.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {booking.userName || booking.customerName || "Customer"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {booking.serviceName || booking.serviceTitle || "Service"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {booking.date || "Not set"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {booking.address || "Not provided"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(booking.id, "In Progress")}
                            disabled={
                              updatingId === booking.id ||
                              booking.status === "In Progress" ||
                              booking.status === "Completed"
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, "Completed")}
                            disabled={
                              updatingId === booking.id ||
                              booking.status === "Completed"
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
