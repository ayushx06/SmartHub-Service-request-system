import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { ArrowRight, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState('');
  const servicesQuery = useMemo(
    () => query(collection(db, 'services'), where('status', '==', 'active'), orderBy('createdAt', 'desc'), limit(6)),
    [],
  );
  const { items: services, loading } = useFirestoreQuery(servicesQuery, []);
  const filteredServices = services.filter((service) => {
    const term = searchTerm.toLowerCase();
    return [service.title, service.categoryName, service.location, service.providerName].some((value) => String(value || '').toLowerCase().includes(term));
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold text-brand-700">SmartHub</Link>
          <nav className="flex items-center gap-2">
            <Link className="btn-muted" to="/services">Browse</Link>
            <Link className="btn-muted" to="/login">Login</Link>
            <Link className="btn-primary" to="/signup">Sign up</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[url('/src/assets/service-marketplace-hero.png')] bg-cover bg-center opacity-25" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-brand-100">
              <Sparkles className="h-4 w-4" /> Auckland services, student-friendly flow
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-normal sm:text-6xl">SmartHub Service Marketplace</h1>
            <p className="mt-5 text-lg leading-8 text-slate-100">
              Find verified Auckland providers for cleaning, tutoring, repairs, events, moving help, and everyday tasks.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary bg-white text-ink hover:bg-brand-50" to="/services">Explore services <ArrowRight className="h-4 w-4" /></Link>
              <Link className="btn-muted border-white/20 bg-white/10 text-white hover:bg-white/15" to="/provider-signup">Become a provider</Link>
            </div>
          </div>

          <div className="self-end rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['10%', 'admin commission'],
                ['Live', 'Firestore data'],
                ['NZ', 'Auckland focus'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-white p-4 text-ink">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="page-title">Approved services</h2>
            <p className="muted mt-1">Loaded from Firestore. Visitors can browse and log in to book.</p>
          </div>
          <label className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search category, suburb, provider" />
          </label>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>

        {!loading && filteredServices.length === 0 && (
          <div className="panel mt-6 p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-lg font-semibold">No active services yet</h3>
            <p className="muted mt-1">Add Firebase keys, approve providers, create categories, then providers can publish services.</p>
          </div>
        )}
      </section>
    </main>
  );
}
