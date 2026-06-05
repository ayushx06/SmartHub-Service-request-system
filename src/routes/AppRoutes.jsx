import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import ProviderLayout from '../layouts/ProviderLayout.jsx';
import Bookings from '../pages/Bookings.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Earnings from '../pages/Earnings.jsx';
import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import ManageCategories from '../pages/ManageCategories.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProviderRequests from '../pages/ProviderRequests.jsx';
import ProviderSignup from '../pages/ProviderSignup.jsx';
import Register from '../pages/Register.jsx';
import RoleHome from '../pages/RoleHome.jsx';
import ServicesAdmin from '../pages/ServicesAdmin.jsx';
import Users from '../pages/Users.jsx';
import BrowseServices from '../pages/customer/BrowseServices.jsx';
import CustomerDashboard from '../pages/customer/CustomerDashboard.jsx';
import MyBookings from '../pages/customer/MyBookings.jsx';
import ServiceDetails from '../pages/customer/ServiceDetails.jsx';
import PostService from '../pages/provider/PostService.jsx';
import ProviderBookings from '../pages/provider/ProviderBookings.jsx';
import ProviderDashboard from '../pages/provider/ProviderDashboard.jsx';
import ProviderPending from '../pages/provider/ProviderPending.jsx';
import ProviderServices from '../pages/provider/ProviderServices.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<BrowseServices publicView />} />
      <Route path="/services/:id" element={<ServiceDetails publicView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/provider-signup" element={<ProviderSignup />} />

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="services" element={<BrowseServices />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
        <Route path="/provider/pending" element={<ProviderPending />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['provider']} requireApprovedProvider />}>
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<ProviderDashboard />} />
          <Route path="services" element={<ProviderServices />} />
          <Route path="services/new" element={<PostService />} />
          <Route path="bookings" element={<ProviderBookings />} />
          <Route path="earnings" element={<Earnings providerView />} />
          <Route path="profile" element={<RoleHome title="Provider profile" description="Manage provider profile details in Firestore." />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="provider-requests" element={<ProviderRequests />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="earnings" element={<Earnings />} />
        </Route>
      </Route>

      <Route path="/customer/*" element={<Navigate to="/user/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
