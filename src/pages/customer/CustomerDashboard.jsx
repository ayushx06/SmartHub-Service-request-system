import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function CustomerDashboard() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [inProgressRequests, setInProgressRequests] = useState(0);
  const [availableServices] = useState(4);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bookings = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setTotalBookings(bookings.length);

      const pendingCount = bookings.filter(
        (booking) => booking.status === "Pending"
      ).length;

      const inProgressCount = bookings.filter(
        (booking) => booking.status === "In Progress"
      ).length;

      setPendingRequests(pendingCount);
      setInProgressRequests(inProgressCount);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-white/10 bg-emerald-950 px-6 py-8 text-white md:block">
          <div className="mb-10">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/80 bg-emerald-700 shadow-lg">
              <span className="text-2xl font-black">S</span>
            </div>

            <h1 className="text-3xl font-black tracking-wide">SmartHub</h1>
            <p className="mt-1 text-sm tracking-[0.25em] text-emerald-200">
              CUSTOMER
            </p>
          </div>

          <nav className="space-y-3">
            <Link
              to="/customer/dashboard"
              className="block rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg"
            >
              Dashboard
            </Link>

            <Link
              to="/customer/services"
              className="block rounded-2xl px-5 py-3 font-bold text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              Find Taskers
            </Link>

            <Link
              to="/customer/bookings"
              className="block rounded-2xl px-5 py-3 font-bold text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              My Tasks
            </Link>

            <Link
              to="/customer/about"
              className="block rounded-2xl px-5 py-3 font-bold text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              About SmartHub
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-6xl">
            {/* Top Bar */}
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-700">
                  Welcome back
                </p>

                <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                  Customer Dashboard
                </h1>

                <p className="mt-3 text-slate-600">
                  Browse services, book taskers, and manage your service
                  requests from one place.
                </p>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-3xl bg-white px-5 py-4 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-black text-emerald-700">
                  Y
                </div>

                <div>
                  <p className="font-black text-slate-900">Yogesh</p>
                  <p className="text-sm text-slate-500">Customer</p>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <section className="overflow-hidden rounded-[32px] bg-emerald-700 shadow-2xl">
              <div className="grid gap-8 p-8 text-white md:grid-cols-2 md:p-12">
                <div>
                  <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-emerald-50">
                    SmartHub Service Request System
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                    Book reliable taskers in minutes
                  </h2>

                  <p className="mt-5 max-w-xl text-emerald-50">
                    Choose a service, view tasker details, submit your booking,
                    and track your request easily.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      to="/customer/services"
                      className="rounded-2xl bg-white px-6 py-3 text-center font-black text-emerald-700 shadow-lg hover:bg-emerald-50"
                    >
                      Find a Tasker
                    </Link>

                    <Link
                      to="/customer/bookings"
                      className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-center font-black text-white shadow-lg hover:bg-white/20"
                    >
                      View My Tasks
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                  <p className="mb-5 text-sm font-bold tracking-[0.25em] text-emerald-100">
                    QUICK SUMMARY
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/15 p-5">
                      <p className="text-sm text-emerald-100">
                        Available Services
                      </p>
                      <h3 className="mt-1 text-4xl font-black">
                        {availableServices}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-white/15 p-5">
                      <p className="text-sm text-emerald-100">My Bookings</p>
                      <h3 className="mt-1 text-4xl font-black">
                        {totalBookings}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-white/15 p-5">
                      <p className="text-sm text-emerald-100">
                        Pending Requests
                      </p>
                      <h3 className="mt-1 text-4xl font-black">
                        {pendingRequests}
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-white/15 p-5">
                      <p className="text-sm text-emerald-100">In Progress</p>
                      <h3 className="mt-1 text-4xl font-black">
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
                className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  🔍
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  Find Taskers
                </h3>

                <p className="mt-2 text-slate-500">
                  Browse available services and choose the right tasker.
                </p>
              </Link>

              <Link
                to="/customer/bookings"
                className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-3xl">
                  📅
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  My Tasks
                </h3>

                <p className="mt-2 text-slate-500">
                  View your bookings and check request progress.
                </p>
              </Link>

              <Link
                to="/customer/about"
                className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                  ℹ️
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  About SmartHub
                </h3>

                <p className="mt-2 text-slate-500">
                  Learn how the service request system works.
                </p>
              </Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}