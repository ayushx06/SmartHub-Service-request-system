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

    localStorage.setItem(
      "customerBookings",
      JSON.stringify(updatedBookings)
    );
  }

  return (
    <div>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have not made any bookings yet.</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.id}>
              <h2>{booking.serviceTitle}</h2>

              <p><strong>Provider:</strong> {booking.providerName}</p>
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Email:</strong> {booking.customerEmail}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Notes:</strong> {booking.notes || "No notes"}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {booking.status !== "Cancelled" && (
                <button onClick={() => cancelBooking(booking.id)}>
                  Cancel Booking
                </button>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}

      <Link to="/customer/services">
        <button>Browse More Services</button>
      </Link>

      <Link to="/customer/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default MyBookings;