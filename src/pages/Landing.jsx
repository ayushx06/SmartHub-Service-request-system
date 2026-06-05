import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';
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

      <section className="relative flex min-h-[560px] items-center overflow-hidden bg-ink text-white sm:min-h-[640px]">
        <div className="absolute inset-0 bg-[url('/src/assets/service-marketplace-hero.png')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative mx-auto flex max-w-7xl justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-normal sm:text-6xl">SmartHub Service Marketplace</h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
              Find verified Auckland providers for cleaning, tutoring, repairs, events, moving help, and everyday tasks.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link className="btn-primary bg-white px-5 py-3 text-ink hover:bg-brand-50" to="/services">Explore services <ArrowRight className="h-4 w-4" /></Link>
              <Link className="btn-muted border-white/20 bg-white/10 px-5 py-3 text-white hover:bg-white/15" to="/provider-signup">Become a provider</Link>
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
