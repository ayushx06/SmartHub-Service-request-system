import { BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  description: '',
  password: '',
};

export default function ProviderSignup() {
  const { registerProvider } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await registerProvider(form);
      navigate('/provider/pending', { replace: true });
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="panel mx-auto w-full max-w-3xl space-y-5 p-6">
        <div>
          <Link to="/" className="text-xl font-bold text-brand-700">SmartHub</Link>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Provider registration</h1>
          <p className="muted mt-1">Provider accounts start as pending until an admin verifies the request.</p>
        </div>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium">
            <span>Business name</span>
            <input className="input" required value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Owner name</span>
            <input className="input" required value={form.ownerName} onChange={(event) => updateField('ownerName', event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Email</span>
            <input className="input" type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Phone</span>
            <input className="input" required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Auckland location</span>
            <input className="input" required placeholder="Mount Eden, Albany, Manukau..." value={form.location} onChange={(event) => updateField('location', event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Experience</span>
            <input className="input" required placeholder="3 years" value={form.experience} onChange={(event) => updateField('experience', event.target.value)} />
          </label>
        </div>

        <label className="block space-y-1 text-sm font-medium">
          <span>Business description</span>
          <textarea className="input min-h-28" required value={form.description} onChange={(event) => updateField('description', event.target.value)} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Password</span>
          <input className="input" type="password" minLength={6} required value={form.password} onChange={(event) => updateField('password', event.target.value)} />
        </label>

        <button className="btn-primary w-full" disabled={submitting}>
          <BriefcaseBusiness className="h-4 w-4" />
          {submitting ? 'Submitting request...' : 'Submit provider request'}
        </button>
      </form>
    </main>
  );
}
