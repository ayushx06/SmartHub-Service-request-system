import { Link } from "react-router-dom";
import sampleServices from "../../data/sampleServices";

function BrowseServices() {
  return (
    <div>
      <h1>Browse Services</h1>
      <p>Choose a service that meets your needs.</p>

      <div>
        {sampleServices.map((service) => (
          <div key={service.id}>
            <h2>{service.title}</h2>
            <p><strong>Category:</strong> {service.category}</p>
            <p><strong>Provider:</strong> {service.providerName}</p>
            <p><strong>Location:</strong> {service.location}</p>
            <p><strong>Price:</strong> ${service.price}</p>
            <p><strong>Rating:</strong> {service.rating}</p>

            <Link to={`/customer/service/${service.id}`}>
              <button>View Details</button>
            </Link>

            <hr />
          </div>
        ))}
      </div>

      <Link to="/customer/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default BrowseServices;