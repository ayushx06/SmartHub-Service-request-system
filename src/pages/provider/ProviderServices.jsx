import { collection, doc, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import useFirestoreQuery from '../../hooks/useFirestoreQuery.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { db } from '../../firebase.js';

function statusLabel(status = '') {
  return status.replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function ProviderServices() {
  const { userProfile } = useAuth();
  const servicesQuery = useMemo(() => query(collection(db, 'services'), where('providerId', '==', userProfile.uid), orderBy('createdAt', 'desc')), [userProfile.uid]);
  const { items: services } = useFirestoreQuery(servicesQuery, [userProfile.uid]);

  async function setStatus(serviceId, status) {
    await updateDoc(doc(db, 'services', serviceId), { status, updatedAt: serverTimestamp() });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">My services</h1>
          <p className="muted mt-1">Manage services posted by your provider account.</p>
        </div>
        <Link className="btn-primary" to="/provider/services/new"><PlusCircle className="h-4 w-4" />Post service</Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service) => (
          <article key={service.id} className="panel flex gap-4 p-4">
            <img className="h-28 w-28 rounded-lg object-cover" src={service.imageUrls?.[0] || '/favicon.svg'} alt={service.title} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">{service.title}</h2>
                  <p className="muted">{service.categoryName} in {service.location}</p>
                </div>
                <Badge>{statusLabel(service.status)}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">${Number(service.price || 0).toFixed(2)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-muted" onClick={() => setStatus(service.id, service.status === 'active' ? 'paused' : 'active')}>
                  {service.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="btn-muted text-rose-700" onClick={() => setStatus(service.id, 'removed')}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!services.length && <EmptyState title="No services posted" message="Create your first service for Auckland customers." />}
    </section>
  );
}
