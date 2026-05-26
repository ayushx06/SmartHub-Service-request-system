import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Badge from '../components/Badge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { complaints as complaintData } from '../data/mockData.js';

export default function Complaints() {
  const [complaints, setComplaints] = useState(complaintData);

  function updateComplaint(id, updates) {
    setComplaints((current) => current.map((complaint) => (complaint.id === id ? { ...complaint, ...updates } : complaint)));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Complaint Management" description="Review issues, add admin notes, and resolve customer complaints." />

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <article key={complaint.id} className="panel p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{complaint.subject}</h2>
                <p className="muted">{complaint.id} • {complaint.customer} • Priority: {complaint.priority}</p>
              </div>
              <Badge>{complaint.status}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
              <select className="input" value={complaint.status} onChange={(event) => updateComplaint(complaint.id, { status: event.target.value })}>
                <option>Open</option>
                <option>In Review</option>
                <option>Resolved</option>
              </select>
              <input className="input" value={complaint.note} onChange={(event) => updateComplaint(complaint.id, { note: event.target.value })} placeholder="Add admin notes" />
              <button className="btn-primary" onClick={() => updateComplaint(complaint.id, { status: 'Resolved' })}><CheckCircle2 className="h-4 w-4" />Resolve</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
