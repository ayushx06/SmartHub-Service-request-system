import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "Contact provider";
  }

  return typeof price === "number" ? `$${price}` : price;
}

export default function BookService() {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!date || !address) {
      setError("Please choose a date and enter your service address.");
      return;
    }

    if (!currentUser?.uid || !service) {
      setError("Could not create this booking. Please sign in and try again.");
      return;
    }

    setSubmitting(true);

    try {
      const serviceName = service.title || "Service";
      const providerName = service.providerName || service.provider || "Provider";

      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || "Customer",
        customerName: userProfile?.name || currentUser.displayName || "Customer",
        customerEmail: currentUser.email || "",
        serviceId: id,
        serviceName,
        serviceTitle: serviceName,
        providerId: service.providerId || "",
        providerName,
        date,
        time,
        address,
        notes,
        status: "Pending",
        createdAt: serverTimestamp(),
        amount: service.price || 0,
      });

      setMessage("Booking request sent successfully!");
      setDate("");
      setTime("");
      setAddress("");
      setNotes("");
    } catch (submitError) {
      console.error("Error sending booking request:", submitError);
      setError("Could not send booking request.");
    } finally {
      setSubmitting(false);
    }
  }

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
              <p className="text-brand-100">Book a Service</p>
            </div>

            <Link
              to="/customer/services"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-brand-700 hover:bg-brand-100"
            >
              Back to Services
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">Request This Tasker</h2>

            <p className="mt-3 max-w-2xl text-brand-100">
              Fill in your details below to send your booking request.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Booking Form */}
          <section className="rounded-2xl bg-white p-8 shadow-md lg:col-span-2">
            {message && (
              <div className="mb-6 rounded-xl bg-brand-100 px-4 py-3 font-semibold text-brand-800">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700">
                {error}
              </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900">
              Booking Details
            </h3>

            <p className="mt-2 text-slate-600">
              Enter your address and preferred task date.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Service Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter the address for this task"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Task Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Task Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Task Details
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write any special request..."
                  rows="5"
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-400"
              >
                {submitting ? "Sending..." : "Send Task Request"}
              </button>
            </form>
          </section>

          {/* Service Summary */}
          <aside className="rounded-2xl bg-white p-8 shadow-md">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
              {service.icon || "🛠️"}
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              {service.title}
            </h3>

            <p className="mt-1 font-semibold text-brand-700">
              {service.category}
            </p>

            <div className="mt-6 space-y-4 rounded-xl bg-brand-50 p-5">
              <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                <span className="font-semibold text-slate-500">Provider</span>
                <span className="text-right font-bold text-slate-900">
                  {service.providerName || service.provider || "Provider"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-brand-100 pb-3">
                <span className="font-semibold text-slate-500">Location</span>
                <span className="text-right font-bold text-slate-900">
                  {service.location || "Not specified"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">Price</span>
                <span className="text-right font-bold text-slate-900">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>

            <Link
              to="/customer/bookings"
              className="mt-6 block rounded-lg border border-brand-700 px-5 py-3 text-center font-semibold text-brand-700 hover:bg-brand-50"
            >
              View My Bookings
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
