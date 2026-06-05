import { collection, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';

function titleCase(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'N/A';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function Users() {
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('createdAt', 'desc')), []);
  const { items: users } = useFirestoreQuery(usersQuery, []);

  async function toggleDisabled(user) {
    const status = user.status === 'disabled' ? (user.role === 'provider' ? 'approved' : 'active') : 'disabled';
    await updateDoc(doc(db, 'users', user.id), { status, updatedAt: serverTimestamp() });
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Manage users</h1>
        <p className="muted mt-1">View all roles and disable accounts when needed.</p>
      </div>

      <div className="panel overflow-hidden">
        {users.map((user) => (
          <div key={user.id} className="grid gap-3 border-b border-slate-100 p-5 last:border-0 lg:grid-cols-[1fr_140px_140px_130px] lg:items-center">
            <div>
              <p className="font-semibold text-slate-950">{String(user.fullName || user.email || 'Unknown user')}</p>
              <p className="muted">{String(user.email || 'No email')} {user.phone ? `| ${String(user.phone)}` : ''}</p>
            </div>
            <p className="text-sm font-medium">{titleCase(user.role)}</p>
            <Badge>{titleCase(user.status)}</Badge>
            <button className="btn-muted" onClick={() => toggleDisabled(user)}>{user.status === 'disabled' ? 'Enable' : 'Disable'}</button>
          </div>
        ))}
        {!users.length && <div className="p-5"><EmptyState title="No users yet" message="Signed-up users and manually-created admins appear here." /></div>}
      </div>
    </section>
  );
}
