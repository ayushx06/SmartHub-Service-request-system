import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div>
      <h1>Smart Service Hub</h1>
      <h2>Customer Dashboard</h2>
      <p>Welcome! Find and book trusted services easily.</p>

      <Link to="/customer/services">
        <button>Browse Services</button>
      </Link>

      <Link to="/customer/bookings">
        <button>My Bookings</button>
      </Link>
    </div>
  );
}

export default CustomerDashboard;