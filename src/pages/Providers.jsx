import { CheckCircle2, FileText, XCircle } from 'lucide-react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { providerRequests } from '../data/mockData.js';
import { db } from '../firebase.js';

const providerStatusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800',
};

export default function Providers() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadProviderRequests() {
      try {
        const snapshot = await getDocs(collection(db, 'providerRequests'));
        const firestoreRequests = snapshot.docs.map((requestDoc) => {
          const request = requestDoc.data();

          return {
            ...request,
            id: requestDoc.id,
            documents: request.documents || [],
          };
        });

        setRequests(firestoreRequests.length > 0 ? firestoreRequests : providerRequests);
      } catch (loadError) {
        console.error('Failed to load provider requests:', loadError);
        setError('Could not load provider requests from Firestore. Showing fallback data.');
        setRequests(providerRequests);
      } finally {
        setLoading(false);
      }
    }

    loadProviderRequests();
  }, []);

  async function updateStatus(id, status) {
    const request = requests.find((currentRequest) => currentRequest.id === id);

    if (!request) {
      return;
    }

    setUpdatingId(id);
    setError('');

    try {
      await setDoc(doc(db, 'providerRequests', String(id)), { ...request, status }, { merge: true });
      setRequests((current) => current.map((currentRequest) => (
        currentRequest.id === id ? { ...currentRequest, status } : currentRequest
      )));
    } catch (updateError) {
      console.error('Failed to update provider request:', updateError);
      setError('Could not update provider request status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Verification" description="Review pending provider applications and uploaded documents." />

      {loading && (
        <div className="panel p-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading provider requests...
        </div>
      )}

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {requests.map((request) => (
          <article key={request.id} className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{request.name}</h2>
                <p className="muted">{request.service} • {request.city} • {request.experience}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${providerStatusStyles[request.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                {request.status}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold">Uploaded documents</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {request.documents.map((document) => (
                  <span key={document} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                    <FileText className="h-4 w-4 text-brand-600" />
                    {document}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => updateStatus(request.id, 'Approved')} disabled={updatingId === request.id}>
                <CheckCircle2 className="h-4 w-4" />{updatingId === request.id ? 'Updating...' : 'Accept'}
              </button>
              <button className="btn-muted text-rose-600" onClick={() => updateStatus(request.id, 'Rejected')} disabled={updatingId === request.id}>
                <XCircle className="h-4 w-4" />{updatingId === request.id ? 'Updating...' : 'Reject'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
