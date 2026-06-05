import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await registerUser(form);
      navigate('/user/dashboard', { replace: true });
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="panel w-full max-w-lg space-y-5 p-6">
        <div>
          <Link to="/" className="text-xl font-bold text-brand-700">SmartHub</Link>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Create customer account</h1>
          <p className="muted mt-1">Customers can search Auckland services, book providers, and review completed work.</p>
        </div>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <label className="block space-y-1 text-sm font-medium">
          <span>Full name</span>
          <input className="input" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium">
            <span>Email</span>
            <input className="input" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Phone</span>
            <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          <span>Password</span>
          <input className="input" type="password" minLength={6} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>

        <button className="btn-primary w-full" disabled={submitting}>
          <UserPlus className="h-4 w-4" />
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-sm text-slate-600">Want to offer services? <Link className="font-semibold text-brand-700" to="/provider-signup">Register as a provider</Link></p>
      </form>
    </main>
  );
}
