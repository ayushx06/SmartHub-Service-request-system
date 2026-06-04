import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.js';

function getDashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'customer' || role === 'user') return '/customer/dashboard';
  if (role === 'provider') return '/provider';
  return '/login';
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid));
      const role = userSnapshot.data()?.role;

      if (!role) {
        setError('No SmartHub role was found for this account.');
        return;
      }

      navigate(getDashboardPath(role), { replace: true });
    } catch (loginError) {
      console.error('Login failed:', loginError);
      setError('Could not sign in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link className="text-2xl font-bold text-brand-700 dark:text-brand-300" to="/">SmartHub</Link>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue to your workspace.</p>
        </div>

        <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" value={form.email} onChange={updateField} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="password">Password</label>
            <input className="input" id="password" name="password" type="password" value={form.password} onChange={updateField} required />
          </div>

          {error && <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            New to SmartHub? <Link className="font-semibold text-brand-700 dark:text-brand-300" to="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
