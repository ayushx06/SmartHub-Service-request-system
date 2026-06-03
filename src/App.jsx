import { BrowserRouter, Routes, Route } from "react-router-dom";

import ServiceProviderDashboard from "./pages/serviceProvider/ServiceProviderDashboard";
import AddService from "./pages/serviceProvider/AddService";
import MyServices from "./pages/serviceProvider/MyServices";
import ProviderBookings from "./pages/serviceProvider/ProviderBookings";
import PastBookings from "./pages/serviceProvider/PastBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ServiceProviderDashboard />} />
        <Route path="/provider/dashboard" element={<ServiceProviderDashboard />} />
        <Route path="/provider/add-service" element={<AddService />} />
        <Route path="/provider/my-services" element={<MyServices />} />
        <Route path="/provider/bookings" element={<ProviderBookings />} />
        <Route path="/provider/past-bookings" element={<PastBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;