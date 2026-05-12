import { CheckCircle2, FileText, XCircle } from 'lucide-react';
import { useState } from 'react';
import Badge from '../components/Badge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { providerRequests } from '../data/mockData.js';

export default function Providers() {
  const [requests, setRequests] = useState(providerRequests);

  function updateStatus(id, status) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Verification" description="Review pending provider applications and uploaded documents." />

      <div className="grid gap-4 lg:grid-cols-2">
        {requests.map((request) => (
          <article key={request.id} className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{request.name}</h2>
                <p className="muted">{request.service} • {request.city} • {request.experience}</p>
              </div>
              <Badge>{request.status}</Badge>
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
              <button className="btn-primary" onClick={() => updateStatus(request.id, 'Approved')}><CheckCircle2 className="h-4 w-4" />Accept</button>
              <button className="btn-muted text-rose-600" onClick={() => updateStatus(request.id, 'Rejected')}><XCircle className="h-4 w-4" />Reject</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
