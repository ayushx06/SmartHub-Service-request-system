import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import ProviderLayout from '../layouts/ProviderLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Users from '../pages/Users.jsx';
import Providers from '../pages/Providers.jsx';
import Bookings from '../pages/Bookings.jsx';
import Complaints from '../pages/Complaints.jsx';
import Reports from '../pages/Reports.jsx';
import Settings from '../pages/Settings.jsx';
import RoleHome from '../pages/RoleHome.jsx';
import CustomerDashboard from '../pages/customer/CustomerDashboard.jsx';
import AboutPage from '../pages/customer/AboutPage.jsx';
import BrowseServices from '../pages/customer/BrowseServices.jsx';
import BookService from '../pages/customer/BookService.jsx';
import MyBookings from '../pages/customer/MyBookings.jsx';
import ServiceDetails from '../pages/customer/ServiceDetails.jsx';
import ProviderDashboard from '../pages/provider/ProviderDashboard.jsx';
import ProviderServices from '../pages/provider/ProviderServices.jsx';
import ProviderBookings from '../pages/provider/ProviderBookings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        {/* All admin pages share the same sidebar and top navbar through AdminLayout. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<ProviderDashboard />} />
          <Route path="services" element={<ProviderServices />} />
          <Route path="bookings" element={<ProviderBookings />} />
          <Route path="profile" element={<RoleHome title="Provider Profile" description="Manage your SmartHub provider profile." />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<RoleHome title="User Workspace" description="Track your SmartHub service requests." />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['customer', 'user']} />}>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<BrowseServices />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="book/:id" element={<BookService />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
