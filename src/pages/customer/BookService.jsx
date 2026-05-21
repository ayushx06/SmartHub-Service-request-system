import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import sampleServices from "../../data/sampleServices";

function BookService() {
  const { id } = useParams();

  const service = sampleServices.find((service) => service.id === Number(id));

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

    localStorage.setItem("customerBookings", JSON.stringify(updatedBookings));

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
      <div className="booking-request-page">
        <div className="booking-request-card">
          <h1>Service Not Found</h1>

          <Link to="/customer/services">
            <button className="dark-btn">Back to Services</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-request-page">
      <div className="booking-request-header">
        <div>
          <h1>Request This Tasker</h1>
          <p>Fill in the details below to send your task request.</p>
        </div>

        <Link to="/customer/services">
          <button className="back-dashboard-btn">Back to Services</button>
        </Link>
      </div>

      <div className="booking-request-card">
        <div className="booking-service-summary">
          <div className="booking-service-icon">
            {service.category.charAt(0)}
          </div>

          <div>
            <h2>{service.title}</h2>
            <p>{service.providerName}</p>
          </div>
        </div>

        <div className="booking-summary-details">
          <p>
            <strong>Provider</strong>
            <span>{service.providerName}</span>
          </p>

          <p>
            <strong>Price</strong>
            <span>${service.price}</span>
          </p>
        </div>

        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              value={booking.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-row">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              value={booking.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-two-columns">
            <div className="form-row">
              <label>Task Date</label>
              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Task Time</label>
              <input
                type="time"
                name="time"
                value={booking.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <label>Task Details</label>
            <textarea
              name="notes"
              value={booking.notes}
              onChange={handleChange}
              placeholder="Write any special request..."
            />
          </div>

          <button type="submit" className="send-request-btn">
            Send Task Request
          </button>
        </form>

        <div className="booking-request-actions">
          <Link to="/customer/services">
            <button className="dark-btn">Back to Services</button>
          </Link>

          <Link to="/customer/bookings">
            <button className="book-service-btn">View My Bookings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookService;