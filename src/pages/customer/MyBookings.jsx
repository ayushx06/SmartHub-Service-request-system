import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function getBookings() {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);

      const savedBookings = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setBookings(savedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setMessage("Could not load bookings.");
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  async function cancelBooking(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await deleteDoc(doc(db, "bookings", id));

      const updatedBookings = bookings.filter((booking) => booking.id !== id);

      setBookings(updatedBookings);
      setMessage("Booking cancelled and removed from database.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setMessage("Could not cancel booking.");
    }
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

      {message && <p className="success-message">{message}</p>}

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