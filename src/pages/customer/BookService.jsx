import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import sampleServices from "../../data/sampleServices";

function BookService() {
  const { id } = useParams();

  const service = sampleServices.find(
    (service) => service.id === Number(id)
  );

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setBooking({
      ...booking,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newBooking = {
      id: Date.now(),
      serviceId: service.id,
      serviceTitle: service.title,
      providerName: service.providerName,
      customerName: booking.name,
      customerEmail: booking.email,
      date: booking.date,
      time: booking.time,
      notes: booking.notes,
      status: "Pending",
    };

    const existingBookings =
      JSON.parse(localStorage.getItem("customerBookings")) || [];

    const updatedBookings = [...existingBookings, newBooking];

    localStorage.setItem(
      "customerBookings",
      JSON.stringify(updatedBookings)
    );

    setMessage("Booking request submitted successfully!");

    setBooking({
      name: "",
      email: "",
      date: "",
      time: "",
      notes: "",
    });
  }

  if (!service) {
    return (
      <div>
        <h1>Service Not Found</h1>
        <Link to="/customer/services">
          <button>Back to Services</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Book Service</h1>

      <h2>{service.title}</h2>
      <p><strong>Provider:</strong> {service.providerName}</p>
      <p><strong>Price:</strong> ${service.price}</p>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Name:</label>
          <br />
          <input
            type="text"
            name="name"
            value={booking.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Your Email:</label>
          <br />
          <input
            type="email"
            name="email"
            value={booking.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Booking Date:</label>
          <br />
          <input
            type="date"
            name="date"
            value={booking.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Booking Time:</label>
          <br />
          <input
            type="time"
            name="time"
            value={booking.time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Notes:</label>
          <br />
          <textarea
            name="notes"
            value={booking.notes}
            onChange={handleChange}
            placeholder="Write any special request..."
          />
        </div>

        <button type="submit">Confirm Booking</button>
      </form>

      <br />

      <Link to="/customer/services">
        <button>Back to Services</button>
      </Link>

      <Link to="/customer/bookings">
        <button>View My Bookings</button>
      </Link>
    </div>
  );
}

export default BookService;