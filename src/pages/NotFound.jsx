import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <section className="panel max-w-md p-8">
        <p className="text-sm font-semibold uppercase text-brand-700">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-2 text-slate-600">The SmartHub page you are looking for does not exist.</p>
        <Link className="btn-primary mx-auto mt-6" to="/"><Home className="h-4 w-4" />Back home</Link>
      </section>
    </main>
  );
}
