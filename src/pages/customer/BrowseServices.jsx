import { collection, orderBy, query, where } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/EmptyState.jsx';
import ServiceCard from '../../components/ServiceCard.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { db } from '../../firebase.js';

export default function BrowseServices({ publicView = false }) {
  const [filters, setFilters] = useState({ search: '', category: '', location: '' });
  const servicesQuery = useMemo(() => query(collection(db, 'services'), where('status', '==', 'active'), orderBy('createdAt', 'desc')), []);
  const categoriesQuery = useMemo(() => query(collection(db, 'categories'), where('active', '==', true), orderBy('name')), []);
  const { items: services, loading } = useFirestoreQuery(servicesQuery, []);
  const { items: categories } = useFirestoreQuery(categoriesQuery, []);

  const filteredServices = services.filter((service) => {
    const search = filters.search.toLowerCase();
    const location = filters.location.toLowerCase();
    const matchesSearch = !search || [service.title, service.description, service.providerName, service.categoryName].some((value) => String(value || '').toLowerCase().includes(search));
    const matchesCategory = !filters.category || service.categoryId === filters.category;
    const matchesLocation = !location || String(service.location || '').toLowerCase().includes(location);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const prefix = publicView ? '/services' : '/user/services';

  return (
    <section className={publicView ? 'min-h-screen bg-slate-50 px-4 py-8 sm:px-6' : 'px-4 py-6 sm:px-6'}>
      <div className="mx-auto max-w-7xl">
        {publicView && (
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-brand-700">SmartHub</Link>
            <Link className="btn-primary" to="/login">Login to book</Link>
          </div>
        )}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="page-title">Find Auckland services</h1>
            <p className="muted mt-1">Search approved services from verified SmartHub providers.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[720px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input className="input pl-9" placeholder="Search services" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            </label>
            <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <input className="input" placeholder="Suburb or location" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => <ServiceCard key={service.id} service={service} toPrefix={prefix} />)}
        </div>

        {!loading && filteredServices.length === 0 && (
          <div className="mt-6">
            <EmptyState title="No services match" message="Try a different keyword, category, or Auckland location." />
          </div>
        )}
      </div>
    </section>
  );
}
