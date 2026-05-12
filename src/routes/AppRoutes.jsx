import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Users from '../pages/Users.jsx';
import Providers from '../pages/Providers.jsx';
import Bookings from '../pages/Bookings.jsx';
import Complaints from '../pages/Complaints.jsx';
import Reports from '../pages/Reports.jsx';
import Settings from '../pages/Settings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* All admin pages share the same sidebar and top navbar through AdminLayout. */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
