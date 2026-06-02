import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-emerald-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-emerald-100">About Customer Services</p>
            </div>

            <Link
              to="/customer/dashboard"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">
              About SmartHub
            </h2>

            <p className="mt-3 max-w-2xl text-emerald-100">
              SmartHub helps customers find trusted taskers, view service
              details, and send booking requests easily.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Main Card */}
          <section className="rounded-2xl bg-white p-8 shadow-md">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-700">
                  Service Request System
                </span>

                <h3 className="mt-5 text-3xl font-bold text-slate-900">
                  Book local services with confidence
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  SmartHub is a service request system where customers can
                  browse available taskers, view service details, and book the
                  service they need.
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                  Customers can choose services such as cleaning, plumbing,
                  tutoring, and tech support. After choosing a service, they can
                  submit a booking request with their name, email, date, time,
                  and task details.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/customer/services"
                    className="rounded-lg bg-emerald-700 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-800"
                  >
                    Browse Services
                  </Link>

                  <Link
                    to="/customer/bookings"
                    className="rounded-lg border border-emerald-700 px-6 py-3 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    View My Bookings
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-6">
                <h4 className="text-xl font-bold text-slate-900">
                  Customer Features
                </h4>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <h5 className="font-bold text-slate-900">
                      Browse available services
                    </h5>
                    <p className="mt-1 text-sm text-slate-600">
                      Find taskers by service type, location, price, and rating.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <h5 className="font-bold text-slate-900">
                      View tasker details
                    </h5>
                    <p className="mt-1 text-sm text-slate-600">
                      Check provider information before sending a request.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <h5 className="font-bold text-slate-900">
                      Manage bookings
                    </h5>
                    <p className="mt-1 text-sm text-slate-600">
                      View your tasks and cancel bookings if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Cards */}
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                🔎
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                What is SmartHub?
              </h3>

              <p className="mt-3 text-slate-600">
                A customer service request system for browsing and booking
                trusted local taskers.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                ⚙️
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                How does it work?
              </h3>

              <p className="mt-3 text-slate-600">
                Choose a service, view details, submit a booking request, and
                track it from My Tasks.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                📅
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                After booking
              </h3>

              <p className="mt-3 text-slate-600">
                The request is saved in the system and can be managed from your
                bookings page.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}