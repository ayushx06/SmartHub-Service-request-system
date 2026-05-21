import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings =
      JSON.parse(localStorage.getItem("customerBookings")) || [];

    setBookings(savedBookings);
  }, []);

  function cancelBooking(id) {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === id) {
        return {
          ...booking,
          status: "Cancelled",
        };
      }

      return booking;
    });

    setBookings(updatedBookings);
    localStorage.setItem("customerBookings", JSON.stringify(updatedBookings));
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h1>My Tasks</h1>
          <p>View and manage your tasker bookings.</p>
        </div>

        <Link to="/customer/dashboard">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-booking-card">
          <h2>No bookings yet</h2>
          <p>You have not made any bookings yet.</p>

          <Link to="/customer/services">
            <button>Browse Services</button>
          </Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <div className="booking-icon">
                  {booking.serviceTitle.charAt(0)}
                </div>

                <div>
                  <h2>{booking.serviceTitle}</h2>
                  <span>{booking.providerName}</span>
                </div>
              </div>

              <div className="booking-details">
                <p>
                  <strong>Customer</strong>
                  <span>{booking.customerName}</span>
                </p>

                <p>
                  <strong>Email</strong>
                  <span>{booking.customerEmail}</span>
                </p>

                <p>
                  <strong>Task Date</strong>
                  <span>{booking.date}</span>
                </p>

                <p>
                  <strong>Task Time</strong>
                  <span>{booking.time}</span>
                </p>

                <p>
                  <strong>Task Details</strong>
                  <span>{booking.notes || "No notes"}</span>
                </p>

                <p>
                  <strong>Status</strong>
                  <span
                    className={
                      booking.status === "Cancelled"
                        ? "status cancelled"
                        : "status pending"
                    }
                  >
                    {booking.status}
                  </span>
                </p>
              </div>

              {booking.status !== "Cancelled" && (
                <button
                  className="cancel-booking-btn"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bottom-actions">
        <Link to="/customer/services">
          <button>Browse More Services</button>
        </Link>

        <Link to="/customer/dashboard">
          <button className="dark-btn">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default MyBookings;