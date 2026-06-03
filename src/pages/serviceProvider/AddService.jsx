import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AddService() {
  const navigate = useNavigate();

  const [service, setService] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    location: "",
    availability: ""
  });

  function handleChange(e) {
    setService({
      ...service,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "services"), {
        providerId: "provider001",
        providerName: "SmartHub Service Provider",

        title: service.title,
        category: service.category,
        description: service.description,
        price: service.price,
        location: service.location,
        availability: service.availability,

        status: "Active",
        createdAt: new Date().toISOString()
      });

      alert("Service added successfully!");

      setService({
        title: "",
        category: "",
        description: "",
        price: "",
        location: "",
        availability: ""
      });

      navigate("/provider/my-services");
    } catch (error) {
      alert("Error adding service: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#EAFBF4]">
      <header className="bg-[#006B4F] px-20 py-10 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SmartHub</h1>
            <p className="text-sm text-green-100">
              Service Provider Portal
            </p>
          </div>

          <Link
            to="/provider/dashboard"
            className="rounded-lg bg-white px-5 py-2 font-semibold text-[#006B4F]"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-bold">Add New Service</h2>
          <p className="mt-2 text-green-100">
            Create a service for customers to book.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-md"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Service Title"
              name="title"
              value={service.title}
              onChange={handleChange}
              placeholder="Plumbing Repair"
            />

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={service.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">Select Category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
                <option value="Moving Services">Moving Services</option>
                <option value="IT Support">IT Support</option>
                <option value="Home Maintenance">
                  Home Maintenance
                </option>
              </select>
            </div>

            <Input
              label="Price ($)"
              name="price"
              value={service.price}
              onChange={handleChange}
              placeholder="100"
            />

            <Input
              label="Location"
              name="location"
              value={service.location}
              onChange={handleChange}
              placeholder="Auckland"
            />

            <Input
              label="Availability"
              name="availability"
              value={service.availability}
              onChange={handleChange}
              placeholder="Mon - Fri"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Describe your service..."
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="mt-8 rounded-lg bg-[#008C6A] px-6 py-3 font-semibold text-white hover:bg-[#006B4F]"
          >
            Save Service
          </button>
        </form>
      </main>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder
}) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-lg border px-4 py-3"
      />
    </div>
  );
}