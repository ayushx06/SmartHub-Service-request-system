import { Link, useParams } from "react-router-dom";

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
    description:
      "Experienced tasker available for regular house cleaning, deep cleaning, and end-of-tenancy cleaning.",
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
    description:
      "Reliable plumbing service for leaks, blocked drains, tap repairs, and general plumbing jobs.",
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
    description:
      "Friendly math tutoring for school and beginner-level students, available online or in Dunedin.",
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
    description:
      "Tech support for laptop repair, slow computers, software setup, virus removal, and troubleshooting.",
  },
];

export default function ServiceDetails() {
  const { id } = useParams();

  const service = services.find((item) => item.id === Number(id));

  if (!service) {
    return (
      <div className="min-h-screen bg-emerald-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-slate-900">
            Service not found
          </h1>

          <Link
            to="/customer/services"
            className="mt-6 inline-block rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-emerald-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-emerald-100">Service Details</p>
            </div>

            <Link
              to="/customer/services"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Back to Services
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">{service.title}</h2>
            <p className="mt-3 max-w-2xl text-emerald-100">
              View tasker details and book this service.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Left Main Card */}
          <section className="rounded-2xl bg-white p-8 shadow-md lg:col-span-2">
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                {service.icon}
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-1 font-semibold text-emerald-700">
                  {service.category}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-6">
              <div className="space-y-4">
                <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                  <span className="font-semibold text-slate-500">Category</span>
                  <span className="font-bold text-slate-900">
                    {service.category}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                  <span className="font-semibold text-slate-500">Provider</span>
                  <span className="font-bold text-slate-900">
                    {service.provider}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                  <span className="font-semibold text-slate-500">Location</span>
                  <span className="font-bold text-slate-900">
                    {service.location}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                  <span className="font-semibold text-slate-500">Price</span>
                  <span className="font-bold text-slate-900">
                    {service.price}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Rating</span>
                  <span className="font-bold text-slate-900">
                    ⭐ {service.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-2xl font-bold text-slate-900">
                Description
              </h4>
              <p className="mt-3 leading-7 text-slate-600">
                {service.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={`/customer/book/${service.id}`}
                className="rounded-lg bg-emerald-700 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-800"
              >
                Book This Service
              </Link>

              <Link
                to="/customer/services"
                className="rounded-lg border border-emerald-700 px-6 py-3 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Back to Services
              </Link>
            </div>
          </section>

          {/* Right Summary Card */}
          <aside className="rounded-2xl bg-emerald-800 p-8 text-white shadow-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
              Quick Summary
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-emerald-100">Starting Price</p>
                <h4 className="mt-1 text-3xl font-bold">{service.price}</h4>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-emerald-100">Rating</p>
                <h4 className="mt-1 text-3xl font-bold">
                  ⭐ {service.rating}
                </h4>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-emerald-100">Location</p>
                <h4 className="mt-1 text-2xl font-bold">
                  {service.location}
                </h4>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}