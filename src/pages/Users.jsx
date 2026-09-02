import { collection, doc, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFirestoreQuery from '../hooks/useFirestoreQuery.js';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { logAdminAction } from '../lib/firestore.js';

function titleCase(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'N/A';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function Users() {
  const { searchQuery = '' } = useOutletContext();
  const { currentUser, userProfile } = useAuth();
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('createdAt', 'desc')), []);
  const { items: users } = useFirestoreQuery(usersQuery, []);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) return users;
    return users.filter((user) => [user.fullName, user.email, user.phone, user.role, user.status]
      .some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)));
  }, [normalizedQuery, users]);

  async function toggleDisabled(user) {
    const status = user.status === 'disabled' ? (user.role === 'provider' ? 'approved' : 'active') : 'disabled';
    const reason = window.prompt(`Reason for ${status === 'disabled' ? 'disabling' : 'enabling'} this user:`)?.trim();
    if (!reason) return;

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'users', user.id), { status, updatedAt: serverTimestamp() });
      logAdminAction({
        batch,
        admin: { currentUser, userProfile },
        action: status === 'disabled' ? 'USER_DISABLED' : 'USER_ENABLED',
        targetType: 'user',
        targetId: user.id,
        targetName: user.fullName || user.email,
        reason,
        previousValue: user.status,
        newValue: status,
      });
      await batch.commit();
    } catch (error) {
      console.error('Failed to update user status:', error);
      window.alert('The user status could not be updated. Please try again.');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Manage users</h1>
        <p className="muted mt-1">View all roles and disable accounts when needed.</p>
      </div>

      <div className="panel overflow-hidden">
        {filteredUsers.map((user) => (
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
        {!!users.length && !filteredUsers.length && <div className="p-5"><EmptyState title="No users match your search" message="Try a different name, email, phone, role, or status." /></div>}
      </div>
    </section>
  );
}
