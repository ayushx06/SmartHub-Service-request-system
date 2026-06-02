import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    icon: "🧹",
    title: "House Cleaning",
    category: "Cleaning",
    provider: "CleanPro Services",
    location: "Dunedin",
    price: "$80",
    rating: "4.8",
  },
  {
    id: 2,
    icon: "🔧",
    title: "Plumbing Repair",
    category: "Plumbing",
    provider: "QuickFix Plumbing",
    location: "Dunedin",
    price: "$120",
    rating: "4.6",
  },
  {
    id: 3,
    icon: "📚",
    title: "Math Tutoring",
    category: "Tutoring",
    provider: "Smart Tutor NZ",
    location: "Online / Dunedin",
    price: "$50",
    rating: "4.9",
  },
  {
    id: 4,
    icon: "💻",
    title: "Laptop Repair",
    category: "Tech Support",
    provider: "TechHelp Support",
    location: "Dunedin",
    price: "$90",
    rating: "4.7",
  },
];

export default function BrowseServices() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-emerald-700 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-emerald-100">Customer Services</p>
            </div>

            <Link
              to="/customer/dashboard"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">Available Services</h2>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Choose a service below and view the tasker details before booking.
            </p>
          </div>
        </div>
      </header>

      {/* Service Cards */}
      <main className="px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-1 font-semibold text-emerald-700">
                {service.category}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Provider</span>
                  <span className="text-right text-slate-800">
                    {service.provider}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Location</span>
                  <span className="text-right text-slate-800">
                    {service.location}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Price</span>
                  <span className="text-right text-slate-800">
                    {service.price}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Rating</span>
                  <span className="text-right text-slate-800">
                    ⭐ {service.rating}
                  </span>
                </div>
              </div>

              <Link
                to={`/customer/service/${service.id}`}
                className="mt-6 block rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-700"
              >
                View Tasker
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}