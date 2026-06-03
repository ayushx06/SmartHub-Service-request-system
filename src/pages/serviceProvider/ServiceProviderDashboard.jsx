import { Link } from "react-router-dom";

export default function ServiceProviderDashboard() {
  return (
    <div className="min-h-screen bg-[#EAFBF4]">
      <header className="bg-[#006B4F] px-20 py-10 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SmartHub</h1>
            <p className="text-sm text-green-100">Service Provider Portal</p>
          </div>

          <Link
            to="/provider/add-service"
            className="rounded-lg bg-white px-5 py-2 font-semibold text-[#006B4F]"
          >
            Add Service
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-bold">Provider Dashboard</h2>
          <p className="mt-2 text-green-100">
            Manage your services, bookings, and customer requests.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Total Services" value="4" />
          <Card title="Pending Bookings" value="3" />
          <Card title="Completed Jobs" value="12" />
        </div>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-md">
          <span className="rounded-full bg-[#D7F8EA] px-4 py-1 text-sm font-semibold text-[#006B4F]">
            Service Provider Features
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-800">
            Manage local services with confidence
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            SmartHub helps service providers create services, receive customer bookings,
            and manage accepted or cancelled requests easily.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/provider/add-service"
              className="rounded-lg bg-[#008C6A] px-5 py-3 font-semibold text-white hover:bg-[#006B4F]"
            >
              Create Service
            </Link>

            <Link
              to="/provider/bookings"
              className="rounded-lg border border-[#008C6A] px-5 py-3 font-semibold text-[#006B4F]"
            >
              View Bookings
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature icon="🛠️" title="Create Services" text="Add services that customers can browse and book." />
          <Feature icon="📅" title="Manage Bookings" text="Accept or cancel customer booking requests." />
          <Feature icon="⭐" title="Track Feedback" text="View completed jobs and customer feedback." />
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h3 className="mt-3 text-4xl font-bold text-[#008C6A]">{value}</h3>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#D7F8EA] text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}