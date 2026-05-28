import { CalendarCheck, Star, ClipboardList, CheckCircle2, Clock, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function ServiceProviderDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "New Requests",
      value: "5",
      icon: ClipboardList,
      text: "Customer booking requests waiting"
    },
    {
      title: "Completed Jobs",
      value: "12",
      icon: CheckCircle2,
      text: "Successfully completed bookings"
    },
    {
      title: "Pending Jobs",
      value: "3",
      icon: Clock,
      text: "Jobs currently pending"
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      text: "Based on customer feedback"
    }
  ];

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-full w-72 border-r bg-white p-5">
        <h1 className="text-xl font-bold text-cyan-700">SmartHub</h1>
        <p className="text-sm text-slate-500">Service Provider Panel</p>

        <nav className="mt-8 space-y-2">
          <Link className="block rounded-lg bg-cyan-50 px-4 py-3 font-medium text-cyan-700" to="/dashboard">
            Dashboard
          </Link>
          <Link className="block rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" to="/booking-requests">
            Booking Requests
          </Link>
          <Link className="block rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" to="/past-bookings">
            Past Bookings
          </Link>
          <Link className="block rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" to="/feedback">
            Customer Feedback
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-600 hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="ml-72 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">
            Manage customer bookings, past jobs, and feedback.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold">{item.value}</span>
              </div>
              <h3 className="font-semibold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Booking Requests</h3>

            <div className="space-y-3">
              <BookingCard customer="John Smith" service="Plumbing Repair" date="2026-05-28" status="Pending" />
              <BookingCard customer="Emma Wilson" service="AC Service" date="2026-05-29" status="Pending" />
              <BookingCard customer="David Lee" service="Electrical Repair" date="2026-05-30" status="In Progress" />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>

            <div className="grid gap-3">
              <Link className="rounded-lg bg-cyan-600 px-4 py-3 text-center font-semibold text-white hover:bg-cyan-700" to="/booking-requests">
                View Booking Requests
              </Link>

              <Link className="rounded-lg border px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50" to="/past-bookings">
                View Past Bookings
              </Link>

              <Link className="rounded-lg border px-4 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50" to="/feedback">
                View Customer Feedback
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function BookingCard({ customer, service, date, status }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div>
        <p className="font-semibold">{customer}</p>
        <p className="text-sm text-slate-500">{service}</p>
      </div>

      <div className="text-right">
        <p className="flex items-center gap-1 text-sm text-slate-500">
          <CalendarCheck className="h-4 w-4" />
          {date}
        </p>
        <span className="mt-1 inline-block rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
          {status}
        </span>
      </div>
    </div>
  );
}