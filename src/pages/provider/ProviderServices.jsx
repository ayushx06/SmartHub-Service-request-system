import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, X } from "lucide-react";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  price: "",
  location: "",
};

function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "Contact provider";
  }

  return typeof price === "number" ? `$${price}` : price;
}

export default function ProviderServices() {
  const { currentUser, userProfile } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const liveServices = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter((service) => service.status !== "inactive");

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

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.category || !form.description || !form.location) {
      setError("Please fill in every service field.");
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "services"), {
        title: form.title,
        category: form.category,
        description: form.description,
        price: Number(form.price) || 0,
        location: form.location,
        rating: "New",
        status: "active",
        providerId: currentUser.uid,
        providerName: userProfile?.name || "Provider",
        provider: userProfile?.name || "Provider",
        createdAt: serverTimestamp(),
      });

      setForm(emptyForm);
      setModalOpen(false);
      setMessage("Service posted successfully.");
    } catch (submitError) {
      console.error("Error posting service:", submitError);
      setError("Could not post this service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            My Services
          </p>
          <h1 className="page-title mt-2">
            Active Service Listings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View active services and publish new provider listings.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary px-4 py-3"
        >
          <Plus className="h-4 w-4" />
          Post New Service
        </button>
      </section>

      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-3 font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel p-6 text-center font-semibold text-slate-600">
          Loading...
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.length === 0 ? (
            <div className="panel p-8 text-center md:col-span-2 xl:col-span-3">
              <h2 className="text-2xl font-semibold text-slate-950">
                No services posted yet
              </h2>
              <p className="mt-2 text-slate-500">
                Add your first service to start accepting bookings.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <article key={service.id} className="panel p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
                  {service.icon || "🛠️"}
                </div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {service.title || "Untitled Service"}
                </h2>
                <p className="mt-1 font-semibold text-brand-700">
                  {service.category || "General"}
                </p>
                <div className="mt-5 space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">Price</span>
                    <span className="text-right font-bold text-slate-900">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-500">Rating</span>
                    <span className="text-right font-bold text-slate-900">
                      ⭐ {service.rating || "New"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 py-8">
          <section className="panel w-full max-w-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Post New Service
                </h2>
                <p className="text-sm text-slate-500">
                  Add a service customers can book.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={updateField}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={updateField}
                  className="input resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-muted px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-4 py-2"
                >
                  {submitting ? "Posting..." : "Post Service"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
