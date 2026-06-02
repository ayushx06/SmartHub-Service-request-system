import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const services = [
  {
    id: 1,
    icon: "🧹",
    title: "House Cleaning",
    category: "Cleaning",
    provider: "CleanPro Services",
    location: "Dunedin",
    price: "$80",
  },
  {
    id: 2,
    icon: "🔧",
    title: "Plumbing Repair",
    category: "Plumbing",
    provider: "QuickFix Plumbing",
    location: "Dunedin",
    price: "$120",
  },
  {
    id: 3,
    icon: "📚",
    title: "Math Tutoring",
    category: "Tutoring",
    provider: "Smart Tutor NZ",
    location: "Online / Dunedin",
    price: "$50",
  },
  {
    id: 4,
    icon: "💻",
    title: "Laptop Repair",
    category: "Tech Support",
    provider: "TechHelp Support",
    location: "Dunedin",
    price: "$90",
  },
];

export default function BookService() {
  const { id } = useParams();

  const service = services.find((item) => item.id === Number(id));

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!customerName || !customerEmail || !date || !time) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        serviceId: service.id,
        serviceTitle: service.title,
        providerName: service.provider,
        customerName,
        customerEmail,
        date,
        time,
        notes,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setMessage("Booking request sent successfully!");

      setCustomerName("");
      setCustomerEmail("");
      setDate("");
      setTime("");
      setNotes("");
    } catch (error) {
      console.error("Error sending booking request:", error);
      setMessage("Could not send booking request.");
    }
  }

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
              <p className="text-emerald-100">Book a Service</p>
            </div>

            <Link
              to="/customer/services"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Back to Services
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-4xl font-bold">Request This Tasker</h2>

            <p className="mt-3 max-w-2xl text-emerald-100">
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
              <div className="mb-6 rounded-xl bg-emerald-100 px-4 py-3 font-semibold text-emerald-800">
                {message}
              </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900">
              Booking Details
            </h3>

            <p className="mt-2 text-slate-600">
              Enter your contact details and preferred task date.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Your Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
              >
                Send Task Request
              </button>
            </form>
          </section>

          {/* Service Summary */}
          <aside className="rounded-2xl bg-white p-8 shadow-md">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              {service.icon}
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              {service.title}
            </h3>

            <p className="mt-1 font-semibold text-emerald-700">
              {service.category}
            </p>

            <div className="mt-6 space-y-4 rounded-xl bg-emerald-50 p-5">
              <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                <span className="font-semibold text-slate-500">Provider</span>
                <span className="text-right font-bold text-slate-900">
                  {service.provider}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-emerald-100 pb-3">
                <span className="font-semibold text-slate-500">Location</span>
                <span className="text-right font-bold text-slate-900">
                  {service.location}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="font-semibold text-slate-500">Price</span>
                <span className="text-right font-bold text-slate-900">
                  {service.price}
                </span>
              </div>
            </div>

            <Link
              to="/customer/bookings"
              className="mt-6 block rounded-lg border border-emerald-700 px-5 py-3 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              View My Bookings
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}