import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRolePath } from '../routes/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { profile } = await login(form.email, form.password);
      navigate(location.state?.from || getRolePath(profile), { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="panel w-full max-w-md space-y-5 p-6">
        <div>
          <Link to="/" className="text-xl font-bold text-brand-700">SmartHub</Link>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Login</h1>
          <p className="muted mt-1">Use your Firebase Authentication email and password.</p>
        </div>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <label className="block space-y-1 text-sm font-medium">
          <span>Email</span>
          <input className="input" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Password</span>
          <input className="input" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>

        <button className="btn-primary w-full" disabled={submitting}>
          <LogIn className="h-4 w-4" />
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="grid gap-2 text-sm text-slate-600">
          <Link className="font-semibold text-brand-700" to="/signup">Create a customer account</Link>
          <Link className="font-semibold text-brand-700" to="/provider-signup">Register as a service provider</Link>
        </div>
      </form>
    </main>
  );
}
