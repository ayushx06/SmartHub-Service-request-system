import { Link } from "react-router-dom";

function CustomerNavbar() {
  return (
    <nav className="customer-navbar">
      <Link to="/customer/dashboard">Home</Link>
      <Link to="/customer/services">Find Taskers</Link>
      <Link to="/customer/bookings">My Tasks</Link>
    </nav>
  );
}

export default CustomerNavbar;