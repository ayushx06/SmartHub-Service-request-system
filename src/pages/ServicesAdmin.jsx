import { collection, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

function label(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function ServicesAdmin() {
  const servicesQuery = useMemo(() => query(collection(db, 'services'), orderBy('createdAt', 'desc')), []);
  const { items: services } = useFirestoreQuery(servicesQuery, []);

  async function updateStatus(serviceId, status) {
    await updateDoc(doc(db, 'services', serviceId), { status, updatedAt: serverTimestamp() });
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">All services</h1>
        <p className="muted mt-1">Admin view of marketplace listings from Firestore.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service) => (
          <article key={service.id} className="panel flex gap-4 p-4">
            <img className="h-24 w-24 rounded-lg object-cover" src={service.imageUrls?.[0] || '/favicon.svg'} alt={service.title} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">{service.title}</h2>
                  <p className="muted">{service.providerName} | {service.categoryName} | {service.location}</p>
                </div>
                <Badge>{label(service.status)}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold">${Number(service.price || 0).toFixed(2)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-muted" onClick={() => updateStatus(service.id, 'active')}>Active</button>
                <button className="btn-muted" onClick={() => updateStatus(service.id, 'paused')}>Pause</button>
                <button className="btn-muted text-rose-700" onClick={() => updateStatus(service.id, 'removed')}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!services.length && <EmptyState title="No services" message="Provider listings will appear here." />}
    </section>
  );
}
