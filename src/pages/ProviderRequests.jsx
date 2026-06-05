import { collection, orderBy, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { approveProvider, rejectProvider } from '../lib/firestore.js';
import { db } from '../firebase.js';

export default function ProviderRequests() {
  const [notes, setNotes] = useState({});
  const requestsQuery = useMemo(() => query(collection(db, 'providers'), where('verificationStatus', '==', 'pending'), orderBy('createdAt', 'desc')), []);
  const { items: providers } = useFirestoreQuery(requestsQuery, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Provider requests</h1>
        <p className="muted mt-1">Approve or reject provider applications. Admins are never created through signup.</p>
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <article key={provider.id} className="panel p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">{provider.businessName}</h2>
                  <Badge>Pending</Badge>
                </div>
                <p className="text-sm text-slate-600">{provider.ownerName} | {provider.email} | {provider.phone}</p>
                <p className="text-sm text-slate-600">{provider.location} | {provider.experience}</p>
                <p className="max-w-3xl text-sm text-slate-700">{provider.description}</p>
              </div>
              <div className="w-full space-y-3 lg:max-w-sm">
                <textarea className="input min-h-20" placeholder="Rejection note" value={notes[provider.id] || ''} onChange={(event) => setNotes({ ...notes, [provider.id]: event.target.value })} />
                <div className="flex gap-2">
                  <button className="btn-primary flex-1" onClick={() => approveProvider(provider.id)}>Approve</button>
                  <button className="btn-muted flex-1 text-rose-700" onClick={() => rejectProvider(provider.id, notes[provider.id] || '')}>Reject</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!providers.length && <EmptyState title="No pending providers" message="New provider applications will appear here." />}
    </section>
  );
}
