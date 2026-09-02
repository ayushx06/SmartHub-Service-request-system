import { collection, doc, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { logAdminAction } from '../lib/firestore.js';

function label(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function ServicesAdmin() {
  const { searchQuery = '' } = useOutletContext();
  const { currentUser, userProfile } = useAuth();
  const servicesQuery = useMemo(() => query(collection(db, 'services'), orderBy('createdAt', 'desc')), []);
  const { items: services } = useFirestoreQuery(servicesQuery, []);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return services;
    return services.filter((service) => [service.title, service.providerName, service.categoryName, service.location, service.status]
      .some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)));
  }, [normalizedQuery, services]);

  async function updateStatus(service, status) {
    if (service.status === status) return;
    const reason = window.prompt(`Reason for changing this service to ${status}:`)?.trim();
    if (!reason) return;

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'services', service.id), { status, updatedAt: serverTimestamp() });
      logAdminAction({ batch, admin: { currentUser, userProfile }, action: 'SERVICE_STATUS_CHANGED', targetType: 'service', targetId: service.id, targetName: service.title, reason, previousValue: service.status, newValue: status });
      await batch.commit();
    } catch (error) {
      console.error('Failed to update service status:', error);
      window.alert('The service status could not be updated. Please try again.');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">All services</h1>
        <p className="muted mt-1">Admin view of marketplace listings from Firestore.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredServices.map((service) => (
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
                <button className="btn-muted" onClick={() => updateStatus(service, 'active')}>Active</button>
                <button className="btn-muted" onClick={() => updateStatus(service, 'paused')}>Pause</button>
                <button className="btn-muted text-rose-700" onClick={() => updateStatus(service, 'removed')}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!services.length && <EmptyState title="No services" message="Provider listings will appear here." />}
      {!!services.length && !filteredServices.length && <EmptyState title="No services match your search" message="Try a different title, provider, category, location, or status." />}
    </section>
  );
}
