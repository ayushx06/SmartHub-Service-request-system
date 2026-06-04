import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [inProgressRequests, setInProgressRequests] = useState(0);
  const [availableServices] = useState(4);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) {
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const bookings = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter((booking) => booking.userId === currentUser.uid);

        setTotalBookings(bookings.length);

        const pendingCount = bookings.filter(
          (booking) => booking.status === "Pending"
        ).length;

        const inProgressCount = bookings.filter(
          (booking) => booking.status === "In Progress"
        ).length;

        setPendingRequests(pendingCount);
        setInProgressRequests(inProgressCount);
        setError("");
      },
      (loadError) => {
        console.error("Error loading customer bookings:", loadError);
        setError("Could not load your booking stats.");
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const initials = (userProfile?.name || "Y")
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
            {/* Top Bar */}
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                  Welcome back
                </p>

                <h1 className="page-title">
                  Customer Dashboard
                </h1>

                <p className="mt-3 text-slate-600">
                  Browse services, book taskers, and manage your service
                  requests from one place.
                </p>
              </div>

              <div className="panel flex w-fit items-center gap-3 px-5 py-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                  {initials}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {userProfile?.name || "Customer"}
                  </p>
                  <p className="text-sm text-slate-500">Customer</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* Hero Card */}
            <section className="panel overflow-hidden bg-brand-600">
              <div className="grid gap-8 p-8 text-white md:grid-cols-2 md:p-12">
                <div>
                  <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white/90">
                    SmartHub Service Request System
                  </span>

                  <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
                    Book reliable taskers in minutes
                  </h2>

                  <p className="mt-5 max-w-xl text-white/90">
                    Choose a service, view tasker details, submit your booking,
                    and track your request easily.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      to="/customer/services"
                      className="btn bg-white px-6 py-3 text-center text-brand-700 hover:bg-brand-50"
                    >
                      Find a Tasker
                    </Link>

                    <Link
                      to="/customer/bookings"
                      className="btn border border-white/30 bg-white/10 px-6 py-3 text-center text-white hover:bg-white/20"
                    >
                      View My Tasks
                    </Link>
                  </div>
                </div>

                <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
                  <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-brand-100">
                    QUICK SUMMARY
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-white/15 p-5">
                      <p className="text-sm text-brand-100">
                        Available Services
                      </p>
                      <h3 className="mt-1 text-4xl font-semibold">
                        {availableServices}
                      </h3>
                    </div>

                    <div className="rounded-lg bg-white/15 p-5">
                      <p className="text-sm text-brand-100">My Bookings</p>
                      <h3 className="mt-1 text-4xl font-semibold">
                        {totalBookings}
                      </h3>
                    </div>

                    <div className="rounded-lg bg-white/15 p-5">
                      <p className="text-sm text-brand-100">
                        Pending Requests
                      </p>
                      <h3 className="mt-1 text-4xl font-semibold">
                        {pendingRequests}
                      </h3>
                    </div>

                    <div className="rounded-lg bg-white/15 p-5">
                      <p className="text-sm text-brand-100">In Progress</p>
                      <h3 className="mt-1 text-4xl font-semibold">
                        {inProgressRequests}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Cards */}
            <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                to="/customer/services"
                className="panel p-6 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                  🔍
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Find Taskers
                </h3>

                <p className="mt-2 text-slate-500">
                  Browse available services and choose the right tasker.
                </p>
              </Link>

              <Link
                to="/customer/bookings"
                className="panel p-6 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                  📅
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  My Tasks
                </h3>

                <p className="mt-2 text-slate-500">
                  View your bookings and check request progress.
                </p>
              </Link>

              <Link
                to="/customer/about"
                className="panel p-6 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                  ℹ️
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  About SmartHub
                </h3>

                <p className="mt-2 text-slate-500">
                  Learn how the service request system works.
                </p>
              </Link>
            </section>
      </div>
    </div>
  );
}
