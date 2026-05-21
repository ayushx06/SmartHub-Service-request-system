import { CheckCircle2 } from 'lucide-react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { complaints as complaintData } from '../data/mockData.js';
import { db } from '../firebase.js';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  function getComplaintText(complaint) {
    return complaint.issue || complaint.subject || '';
  }

  function getComplaintCustomer(complaint) {
    return complaint.userName || complaint.customer || '';
  }

  function getComplaintNotes(complaint) {
    return complaint.notes ?? complaint.note ?? '';
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'complaints'),
      (snapshot) => {
        const firestoreComplaints = snapshot.docs.map((complaintDoc) => ({
          ...complaintDoc.data(),
          id: complaintDoc.id,
        }));

        setComplaints(firestoreComplaints.length > 0 ? firestoreComplaints : complaintData);
        setLoading(false);
      },
      (loadError) => {
        console.error('Failed to load complaints:', loadError);
        setError('Could not load complaints from Firestore. Showing fallback data.');
        setComplaints(complaintData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function applyComplaintUpdates(id, updates) {
    setComplaints((current) => current.map((complaint) => (complaint.id === id ? { ...complaint, ...updates } : complaint)));
  }

  async function updateComplaint(id, updates) {
    const previousComplaints = complaints;

    applyComplaintUpdates(id, updates);
    setUpdatingId(id);
    setError('');

    try {
      await updateDoc(doc(db, 'complaints', String(id)), updates);
    } catch (updateError) {
      console.error('Failed to update complaint:', updateError);
      setError('Could not update complaint in Firestore. Please try again.');
      setComplaints(previousComplaints);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Complaint Management" description="Review issues, add admin notes, and resolve customer complaints." />

      {loading && (
        <div className="panel p-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading complaints...
        </div>
      )}

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <article key={complaint.id} className="panel p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{getComplaintText(complaint)}</h2>
                <p className="muted">{getComplaintCustomer(complaint)}{complaint.category ? ` • ${complaint.category}` : ''} • Priority: {complaint.priority}</p>
              </div>
              <Badge>{complaint.status}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
              <select className="input" value={complaint.status} onChange={(event) => updateComplaint(complaint.id, { status: event.target.value })} disabled={updatingId === complaint.id}>
                <option>Open</option>
                <option>In Review</option>
                <option>Resolved</option>
              </select>
              <input className="input" value={getComplaintNotes(complaint)} onChange={(event) => applyComplaintUpdates(complaint.id, { notes: event.target.value })} onBlur={(event) => updateComplaint(complaint.id, { notes: event.target.value })} placeholder="Add admin notes" />
              <button className="btn-primary" onClick={() => updateComplaint(complaint.id, { status: 'Resolved' })} disabled={updatingId === complaint.id}><CheckCircle2 className="h-4 w-4" />{updatingId === complaint.id ? 'Updating...' : 'Resolve'}</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
