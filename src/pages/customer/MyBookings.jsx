import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function getBookings() {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      const savedBookings = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setBookings(savedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setMessage("Could not load bookings.");
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  async function cancelBooking(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await deleteDoc(doc(db, "bookings", id));

      const updatedBookings = bookings.filter((booking) => booking.id !== id);

      setBookings(updatedBookings);
      setMessage("Booking cancelled and removed from database.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setMessage("Could not cancel booking.");
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-emerald-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-emerald-100">Customer Bookings</p>
            </div>

            <Link
              to="/customer/dashboard"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">My Tasks</h2>

            <p className="mt-3 max-w-2xl text-emerald-100">
              View and manage your tasker bookings.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {message && (
            <div className="mb-6 rounded-xl bg-emerald-100 px-4 py-3 font-semibold text-emerald-800">
              {message}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                📅
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                No bookings yet
              </h2>

              <p className="mt-3 text-slate-600">
                You have not made any bookings yet.
              </p>

              <Link
                to="/customer/services"
                className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-md"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                      {booking.serviceTitle?.charAt(0) || "T"}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {booking.serviceTitle}
                      </h2>
                      <p className="font-semibold text-emerald-700">
                        {booking.providerName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl bg-emerald-50 p-5">
                    <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                      <span className="font-semibold text-slate-500">
                        Customer
                      </span>
                      <span className="text-right font-bold text-slate-900">
                        {booking.customerName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                      <span className="font-semibold text-slate-500">
                        Email
                      </span>
                      <span className="max-w-[60%] break-words text-right font-bold text-slate-900">
                        {booking.customerEmail}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                      <span className="font-semibold text-slate-500">
                        Task Date
                      </span>
                      <span className="text-right font-bold text-slate-900">
                        {booking.date}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                      <span className="font-semibold text-slate-500">
                        Task Time
                      </span>
                      <span className="text-right font-bold text-slate-900">
                        {booking.time}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                      <span className="font-semibold text-slate-500">
                        Details
                      </span>
                      <span className="max-w-[60%] text-right font-bold text-slate-900">
                        {booking.notes || "No notes"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-500">
                        Status
                      </span>

                      <span
                        className={
                          booking.status === "Cancelled"
                            ? "rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700"
                            : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700"
                        }
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/customer/services"
              className="rounded-lg bg-emerald-700 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-800"
            >
              Browse More Services
            </Link>

            <Link
              to="/customer/dashboard"
              className="rounded-lg bg-emerald-900 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-950"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyBookings;