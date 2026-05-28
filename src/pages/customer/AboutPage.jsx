import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div>
          <h1>About SmartHub</h1>
          <p>
            Learn how SmartHub helps customers find and book trusted services.
          </p>
        </div>

        <Link to="/customer/dashboard">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </div>

      <div className="about-card">
        <h2>What is SmartHub?</h2>
        <p>
          SmartHub is a service request system where customers can browse
          available taskers, view service details, and send booking requests for
          the service they need.
        </p>

        <h2>How does it work?</h2>
        <p>
          Customers can browse services such as cleaning, gardening, repairs,
          moving help, and other local tasks. After choosing a service, the
          customer can submit a booking request with their name, email, date,
          time, and task details.
        </p>

        <h2>What happens after booking?</h2>
        <p>
          Once a customer sends a booking request, the booking is saved in the
          system. The service provider and admin can then view the request and
          manage the booking status.
        </p>

        <h2>Customer Features</h2>
        <ul>
          <li>Browse available services</li>
          <li>View tasker/service details</li>
          <li>Send booking requests</li>
          <li>View your bookings</li>
          <li>Cancel bookings if needed</li>
        </ul>

        <div className="about-actions">
          <Link to="/customer/services">
            <button className="book-service-btn">Browse Services</button>
          </Link>

          <Link to="/customer/bookings">
            <button className="dark-btn">View My Bookings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;