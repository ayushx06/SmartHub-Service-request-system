import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "Contact provider";
  }

  return typeof price === "number" ? `$${price}` : price;
}

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const liveServices = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setServices(liveServices);
        setLoading(false);
        setError("");
      },
      (loadError) => {
        console.error("Error loading services:", loadError);
        setError("Could not load services.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-brand-700 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SmartHub</h1>
              <p className="text-brand-100">Customer Services</p>
            </div>

            <Link
              to="/customer/dashboard"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-brand-700 hover:bg-brand-100"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">Available Services</h2>

            <p className="mt-3 max-w-2xl text-brand-100">
              Choose a service below and view the tasker details before booking.
            </p>
          </div>
        </div>
      </header>

      {/* Service Cards */}
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {loading && (
            <div className="rounded-xl bg-white p-6 text-center font-semibold text-slate-600 shadow-md">
              Loading services...
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow-md">
              <h3 className="text-2xl font-bold text-slate-900">
                No services available
              </h3>
              <p className="mt-2 text-slate-600">
                Please check again later for new taskers.
              </p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div key={service.id} className="rounded-xl bg-white p-6 shadow-md">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-3xl">
                    {service.icon || "🛠️"}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title || "Untitled Service"}
                  </h3>

                  <p className="mt-1 font-semibold text-brand-700">
                    {service.category || "General"}
                  </p>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">Provider</span>
                      <span className="text-right text-slate-800">
                        {service.providerName || service.provider || "Provider"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">Location</span>
                      <span className="text-right text-slate-800">
                        {service.location || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">Price</span>
                      <span className="text-right text-slate-800">
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">Rating</span>
                      <span className="text-right text-slate-800">
                        ⭐ {service.rating || "New"}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/customer/services/${service.id}`}
                    className="mt-6 block rounded-lg bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700"
                  >
                    View Tasker
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
