import { Link, useParams } from "react-router-dom";
import sampleServices from "../../data/sampleServices";

function ServiceDetails() {
  const { id } = useParams();

  const service = sampleServices.find((service) => service.id === Number(id));

  if (!service) {
    return (
      <div className="service-detail-page">
        <div className="service-detail-card">
          <h1>Service Not Found</h1>

          <Link to="/customer/services">
            <button className="dark-btn">Back to Services</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      <div className="service-detail-header">
        <div>
          <h1>{service.title}</h1>
          <p>View tasker details and book this service.</p>
        </div>

        <Link to="/customer/services">
          <button className="back-dashboard-btn">Back to Services</button>
        </Link>
      </div>

      <div className="service-detail-card">
        <div className="service-detail-top">
          <div className="service-detail-icon">
            {service.category.charAt(0)}
          </div>

          <div>
            <h2>{service.title}</h2>
            <span>{service.category}</span>
          </div>
        </div>

        <div className="service-detail-info">
          <p>
            <strong>Category</strong>
            <span>{service.category}</span>
          </p>

          <p>
            <strong>Provider</strong>
            <span>{service.providerName}</span>
          </p>

          <p>
            <strong>Description</strong>
            <span>{service.description}</span>
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

        <div className="service-detail-actions">
          <Link to={`/customer/book/${service.id}`}>
            <button className="book-service-btn">Book This Service</button>
          </Link>

          <Link to="/customer/services">
            <button className="dark-btn">Back to Services</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;