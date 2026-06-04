import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "Contact provider";
  }

  return typeof price === "number" ? `$${price}` : price;
}

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadService() {
      try {
        const serviceSnapshot = await getDoc(doc(db, "services", id));

        if (serviceSnapshot.exists()) {
          setService({ id: serviceSnapshot.id, ...serviceSnapshot.data() });
        } else {
          setService(null);
        }
      } catch (loadError) {
        console.error("Error loading service:", loadError);
        setError("Could not load this service.");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center font-semibold text-slate-600 shadow-md">
          Loading...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-brand-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          {error && (
            <div className="mb-5 rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}
          <h1 className="text-2xl font-bold text-slate-900">
            Service not found
          </h1>

          <Link
            to="/customer/services"
            className="mt-6 inline-block rounded-lg bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-brand-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-brand-100">Service Details</p>
            </div>

            <Link
              to="/customer/services"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-brand-700 hover:bg-brand-100"
            >
              Back to Services
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">{service.title}</h2>
            <p className="mt-3 max-w-2xl text-brand-100">
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-4xl">
                {service.icon || "🛠️"}
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-1 font-semibold text-brand-700">
                  {service.category}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-brand-50 p-6">
              <div className="space-y-4">
                <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                  <span className="font-semibold text-slate-500">Category</span>
                  <span className="font-bold text-slate-900">
                    {service.category || "General"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                  <span className="font-semibold text-slate-500">Provider</span>
                  <span className="font-bold text-slate-900">
                    {service.providerName || service.provider || "Provider"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                  <span className="font-semibold text-slate-500">Location</span>
                  <span className="font-bold text-slate-900">
                    {service.location || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                  <span className="font-semibold text-slate-500">Price</span>
                  <span className="font-bold text-slate-900">
                    {formatPrice(service.price)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Rating</span>
                  <span className="font-bold text-slate-900">
                    ⭐ {service.rating || "New"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-2xl font-bold text-slate-900">
                Description
              </h4>
              <p className="mt-3 leading-7 text-slate-600">
                {service.description || "No description has been added yet."}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={`/customer/book/${service.id}`}
                className="rounded-lg bg-brand-700 px-6 py-3 text-center font-semibold text-white hover:bg-brand-800"
              >
                Book This Service
              </Link>

              <Link
                to="/customer/services"
                className="rounded-lg border border-brand-700 px-6 py-3 text-center font-semibold text-brand-700 hover:bg-brand-50"
              >
                Back to Services
              </Link>
            </div>
          </section>

          {/* Right Summary Card */}
          <aside className="rounded-2xl bg-brand-800 p-8 text-white shadow-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
              Quick Summary
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-brand-100">Starting Price</p>
                <h4 className="mt-1 text-3xl font-bold">
                  {formatPrice(service.price)}
                </h4>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-brand-100">Rating</p>
                <h4 className="mt-1 text-3xl font-bold">
                  ⭐ {service.rating || "New"}
                </h4>
              </div>

              <div className="rounded-xl bg-white/10 p-5">
                <p className="text-sm text-brand-100">Location</p>
                <h4 className="mt-1 text-2xl font-bold">
                  {service.location || "Not specified"}
                </h4>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
