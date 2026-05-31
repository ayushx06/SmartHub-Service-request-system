import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/customer/AboutPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BrowseServices from "./pages/customer/BrowseServices";
import ServiceDetails from "./pages/customer/ServiceDetails";
import BookService from "./pages/customer/BookService";
import MyBookings from "./pages/customer/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/services" element={<BrowseServices />} />
        <Route path="/customer/service/:id" element={<ServiceDetails />} />
        <Route path="/customer/book/:id" element={<BookService />} />
        <Route path="/customer/bookings" element={<MyBookings />} />
        <Route path="/customer/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
