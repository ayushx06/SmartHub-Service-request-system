import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  LoaderCircle,
} from "lucide-react";
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

export default function ProviderDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Could not load assigned bookings.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userProfile]);

  const stats = [
    {
      label: "Total Assigned Jobs",
      value: bookings.length,
      icon: BriefcaseBusiness,
      color: "bg-brand-50 text-brand-700",
    },
    {
      label: "Pending Jobs",
      value: bookings.filter((booking) => booking.status === "Pending").length,
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Completed Jobs",
      value: bookings.filter((booking) => booking.status === "Completed").length,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Active Jobs",
      value: bookings.filter((booking) => booking.status === "In Progress").length,
      icon: LoaderCircle,
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const recentBookings = bookings.slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="panel bg-brand-600 p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-50">
          Provider Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Assigned Service Work</h1>
        <p className="mt-2 max-w-2xl text-brand-50">
          Monitor new requests, active jobs, and completed service bookings.
        </p>
      </section>

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel p-6 text-center font-semibold text-slate-600">
          Loading...
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="panel p-5">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="panel p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-950">
                Recent Bookings
              </h2>
              <p className="text-sm text-slate-500">
                Latest bookings assigned to your provider profile.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-slate-500" colSpan="5">
                        No assigned bookings yet.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
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
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(
                              booking.status
                            )}`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
