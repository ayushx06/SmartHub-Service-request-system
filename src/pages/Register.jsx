import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { auth, db } from '../firebase.js';

export default function Register() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user',
  });
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
      const role = form.role === 'provider' ? 'provider' : 'user';
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await updateProfile(credential.user, { displayName: form.name });
      await setDoc(doc(db, 'users', credential.user.uid), {
        createdAt: serverTimestamp(),
        email: form.email,
        name: form.name,
        role,
        status: 'active',
      });
      await refreshProfile();

      navigate(role === 'provider' ? '/provider' : '/user', { replace: true });
    } catch (registerError) {
      console.error('Registration failed:', registerError);
      setError('Could not create your account. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link className="text-2xl font-bold text-brand-700 dark:text-brand-300" to="/">SmartHub</Link>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a user or provider account.</p>
        </div>

        <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="name">Name</label>
            <input className="input" id="name" name="name" value={form.name} onChange={updateField} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" value={form.email} onChange={updateField} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="password">Password</label>
            <input className="input" id="password" name="password" type="password" value={form.password} onChange={updateField} minLength={6} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="role">Role</label>
            <select className="input" id="role" name="role" value={form.role} onChange={updateField}>
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          {error && <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link className="font-semibold text-brand-700 dark:text-brand-300" to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
