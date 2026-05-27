import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
      <p className="text-slate-500">Login successful.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ServiceProviderDashboard />} />
    </Routes>
  );
}