import { Link, useParams } from "react-router-dom";
import sampleServices from "../../data/sampleServices";

function ServiceDetails() {
  const { id } = useParams();

  const service = sampleServices.find(
    (service) => service.id === Number(id)
  );

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
      <h1>{service.title}</h1>

      <p><strong>Category:</strong> {service.category}</p>
      <p><strong>Provider:</strong> {service.providerName}</p>
      <p><strong>Description:</strong> {service.description}</p>
      <p><strong>Location:</strong> {service.location}</p>
      <p><strong>Price:</strong> ${service.price}</p>
      <p><strong>Rating:</strong> {service.rating}</p>

      <Link to={`/customer/book/${service.id}`}>
        <button>Book This Service</button>
      </Link>

      <Link to="/customer/services">
        <button>Back to Services</button>
      </Link>
    </div>
  );
}

export default ServiceDetails;