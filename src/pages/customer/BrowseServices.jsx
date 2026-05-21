import { Link } from "react-router-dom";
import sampleServices from "../../data/sampleServices";

function BrowseServices() {
  return (
    <div className="browse-page">
      <div className="browse-header">
        <div>
          <h1>Find Taskers</h1>
          <p>Choose a trusted tasker to help with your job.</p>
        </div>

        <Link to="/customer/dashboard">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </div>

      <div className="service-grid">
        {sampleServices.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-card-top">
              <div className="service-icon">
                {service.category.charAt(0)}
              </div>

              <div>
                <h2>{service.title}</h2>
                <span>{service.category}</span>
              </div>
            </div>

            <div className="service-details">
              <p>
                <strong>Provider</strong>
                <span>{service.providerName}</span>
              </p>

              <p>
                <strong>Location</strong>
                <span>{service.location}</span>
              </p>

              <p>
                <strong>Price</strong>
                <span>${service.price}</span>
              </p>

              <p>
                <strong>Rating</strong>
                <span>⭐ {service.rating}</span>
              </p>
            </div>

            <Link to={`/customer/service/${service.id}`}>
              <button className="view-tasker-btn">View Taskers</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseServices;