import { Search, Trash2, UserX } from 'lucide-react';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { users as userData } from '../data/mockData.js';
import { db } from '../firebase.js';

function getUserName(user) {
  return user.name || user.userName || user.fullName || '';
}

function getUserContact(user) {
  return user.email || user.phone || '';
}

function getUserJoined(user) {
  if (user.joined) {
    return user.joined;
  }

  if (user.createdAt?.toDate) {
    return user.createdAt.toDate().toLocaleDateString();
  }

  if (user.createdAt?.seconds) {
    return new Date(user.createdAt.seconds * 1000).toLocaleDateString();
  }

  return user.createdAt || '';
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const firestoreUsers = snapshot.docs.map((userDoc) => ({
          ...userDoc.data(),
          id: userDoc.id,
        }));

        setUsers(firestoreUsers.length > 0 ? firestoreUsers : userData);
        setLoading(false);
      },
      (loadError) => {
        console.error('Failed to load users:', loadError);
        setError('Could not load users from Firestore. Showing fallback data.');
        setUsers(userData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = `${getUserName(user)} ${user.email || ''} ${user.phone || ''}`.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === 'All' || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [users, query, role]);

  async function toggleBlock(id) {
    const previousUsers = users;
    const user = users.find((currentUser) => currentUser.id === id);

    if (!user) {
      return;
    }

    const status = user.status === 'Blocked' ? 'Active' : 'Blocked';

    setUsers((current) => current.map((currentUser) => (currentUser.id === id ? { ...currentUser, status } : currentUser)));
    setUpdatingId(id);
    setError('');

    try {
      await updateDoc(doc(db, 'users', String(id)), { status });
    } catch (updateError) {
      console.error('Failed to update user status:', updateError);
      setError('Could not update user status in Firestore. Please try again.');
      setUsers(previousUsers);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteUser(id) {
    const previousUsers = users;

    setUsers((current) => current.filter((user) => user.id !== id));
    setDeletingId(id);
    setError('');

    try {
      await deleteDoc(doc(db, 'users', String(id)));
    } catch (deleteError) {
      console.error('Failed to delete user:', deleteError);
      setError('Could not delete user from Firestore. Please try again.');
      setUsers(previousUsers);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="View customers and providers, filter accounts, and manage access." />

      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" />
          </label>
          <select className="input" value={role} onChange={(event) => setRole(event.target.value)}>
            <option>All</option>
            <option>Customer</option>
            <option>Provider</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="panel p-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading users...
        </div>
      )}

      {error && (
        <div className="panel border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{getUserName(user)}</p>
                      <p className="text-slate-500">{getUserContact(user)}</p>
                    </td>
                    <td className="px-5 py-4">{user.role}</td>
                    <td className="px-5 py-4">{getUserJoined(user)}</td>
                    <td className="px-5 py-4">{user.bookings}</td>
                    <td className="px-5 py-4"><Badge>{user.status}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="btn-muted" onClick={() => toggleBlock(user.id)} disabled={updatingId === user.id || deletingId === user.id}><UserX className="h-4 w-4" />{user.status === 'Blocked' ? 'Unblock' : 'Block'}</button>
                        <button className="btn-muted text-rose-600" onClick={() => deleteUser(user.id)} disabled={updatingId === user.id || deletingId === user.id}><Trash2 className="h-4 w-4" />Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
