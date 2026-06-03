import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getMyServices() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const serviceQuery = query(
        collection(db, "services"),
        where("providerId", "==", user.uid)
      );

      const data = await getDocs(serviceQuery);

      setServices(
        data.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );

      setLoading(false);
    } catch (error) {
      alert("Error loading services: " + error.message);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "services", id));
      alert("Service deleted successfully");
      getMyServices();
    } catch (error) {
      alert("Error deleting service: " + error.message);
    }
  }

  useEffect(() => {
    getMyServices();
  }, []);

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
            Add New Service
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-bold">My Services</h2>
          <p className="mt-2 text-green-100">
            View and manage all services you created.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-slate-600">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <h2 className="text-2xl font-bold text-slate-800">No services found</h2>
            <p className="mt-2 text-slate-500">
              You have not created any services yet.
            </p>

            <Link
              to="/provider/add-service"
              className="mt-5 inline-block rounded-lg bg-[#008C6A] px-5 py-3 font-semibold text-white hover:bg-[#006B4F]"
            >
              Create Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <span className="rounded-full bg-[#D7F8EA] px-3 py-1 text-xs font-semibold text-[#006B4F]">
                  {service.category}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-800">
                  {service.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {service.description}
                </p>

                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-slate-700">Price:</span>{" "}
                    ${service.price}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Location:</span>{" "}
                    {service.location}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Availability:</span>{" "}
                    {service.availability}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Status:</span>{" "}
                    <span className="font-semibold text-[#008C6A]">
                      {service.status}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>

                  <Link
                    to="/provider/add-service"
                    className="rounded-lg border border-[#008C6A] px-4 py-2 font-semibold text-[#006B4F]"
                  >
                    Add More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}